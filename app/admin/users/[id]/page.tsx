import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Acción del servidor para cambiar el rol del usuario
async function changeUserRole(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const userId = formData.get('userId') as string;
  const newRole = formData.get('role') as string;

  // Validar que el rol es correcto
  if (newRole !== 'admin' && newRole !== 'customer') {
    throw new Error('Rol no válido');
  }

  // Actualizar el rol del usuario
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);

  if (error) {
    console.error('Error actualizando rol:', error);
    throw new Error(`Error al actualizar rol: ${error.message}`);
  }

  // Revalidar y redirigir
  revalidatePath(`/admin/users/${userId}`);
  redirect(`/admin/users/${userId}`);
}

export default async function UserDetailPage(props: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const params = await props.params;
  //const userId = params.id;

  // Obtener datos del usuario
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (userError || !userData) {
    notFound();
  }

  // Obtener invitaciones del usuario
  type Invitation = {
    id: string;
    title: string;
    event_date: string | null;
    payment_status: string;
    is_published: boolean;
    template: { id?: string; name?: string; event_type?: string } | null;
    package: { name: string } | null;
  };

  const { data: invitations, error: invitationsError } = await supabase
    .from('invitations')
    .select(
      `
      id,
      title,
      event_date,
      payment_status,
      is_published,
      template:templates(id, name, event_type),
      package:packages(name)
    `
    )
    .eq('user_id', params.id)
    .order('created_at', { ascending: false });

  if (invitationsError) {
    console.error('Error obteniendo invitaciones:', invitationsError);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/users" passHref>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Detalle de Usuario</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Información de Cuenta</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="text-sm font-mono">{userData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p>{userData.full_name || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{userData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p>{userData.phone || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rol Actual</p>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userData.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {userData.role}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
              <p>{new Date(userData.created_at).toLocaleDateString()}</p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Cambiar Rol</h3>
              <form action={changeUserRole} className="flex items-center space-x-2">
                <input type="hidden" name="userId" value={userData.id} />
                <select
                  name="role"
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue={userData.role}
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
                <Button type="submit" size="sm">
                  Guardar
                </Button>
              </form>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="invitations" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="invitations">Invitaciones</TabsTrigger>
              <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
            </TabsList>

            <TabsContent value="invitations">
              <Card>
                <div className="rounded-md">
                  <div className="grid grid-cols-5 p-4 font-medium bg-muted">
                    <div>Título</div>
                    <div>Plantilla</div>
                    <div>Paquete</div>
                    <div>Estado</div>
                    <div>Acciones</div>
                  </div>
                  <div className="divide-y">
                    {invitations?.map(invitation => (
                      <div key={invitation.id} className="grid grid-cols-5 p-4 items-center">
                        <div>
                          <p className="font-medium">{invitation.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {invitation.event_date
                              ? new Date(invitation.event_date).toLocaleDateString()
                              : 'Sin fecha'}
                          </p>
                        </div>
                        <div className="text-sm">
                          {Array.isArray(invitation.template)
                            ? '—'
                            : (invitation.template as { name?: string })?.name || '—'}
                          {Array.isArray(invitation.template)
                            ? null
                            : (invitation.template as { event_type?: string })?.event_type && (
                                <span className="text-xs text-muted-foreground block">
                                  {(invitation.template as { event_type?: string }).event_type}
                                </span>
                              )}
                        </div>
                        <div className="text-sm">
                          {Array.isArray(invitation.package)
                            ? invitation.package.map(pkg => pkg.name).join(', ') || '—'
                            : (invitation.package as { name: string })?.name || '—'}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invitation.payment_status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {invitation.payment_status}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invitation.is_published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {invitation.is_published ? 'Publicada' : 'Borrador'}
                          </span>
                        </div>
                        <div>
                          <Link href={`/admin/invitations/${invitation.id}`} passHref>
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {(!invitations || invitations.length === 0) && (
                      <div className="p-4 text-center text-muted-foreground">
                        Este usuario no ha creado invitaciones todavía
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="p-6">
                <div className="text-center p-4 text-muted-foreground">
                  Historial de actividad no disponible en esta versión
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
