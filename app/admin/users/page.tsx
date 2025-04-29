import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, User, UserCheck } from 'lucide-react';

export default async function UsersPage(props: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient();
  
  const searchQuery = (await props.searchParams).q || '';

  // Obtener usuarios con búsqueda si se proporciona
  let query = supabase.from('profiles').select(`
      *,
      invitations!invitations_profile_id_fkey(id, title)
    `);

  // Ahora utilizamos la relación explícita a través de profile_id

  if (searchQuery) {
    query = query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
  }

  const { data: users, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios registrados en la plataforma
          </p>
        </div>
        <div className="flex items-center space-x-2 w-64">
          <form className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              className="pl-8"
              name="q"
              defaultValue={searchQuery}
            />
          </form>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-6 p-4 font-medium bg-muted">
          <div className="col-span-2">Usuario</div>
          <div>Email</div>
          <div>Rol</div>
          <div>Invitaciones</div>
          <div>Acciones</div>
        </div>
        <div className="divide-y">
          {users?.map(user => (
            <div key={user.id} className="grid grid-cols-6 p-4 items-center">
              <div className="col-span-2 flex items-center space-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  {user.full_name ? (
                    <span className="text-sm font-medium">
                      {user.full_name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.full_name || 'Usuario sin nombre'}</p>
                  <p className="text-sm text-muted-foreground">
                    Creado el {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="text-sm">{user.invitations?.length || 0} invitaciones</div>
              <div className="flex space-x-2">
                <Link href={`/admin/users/${user.id}`} passHref>
                  <Button variant="outline" size="sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Ver detalles
                  </Button>
                </Link>
              </div>
            </div>
          ))}
          {(!users || users.length === 0) && (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery
                ? `No se encontraron usuarios que coincidan con "${searchQuery}"`
                : 'No hay usuarios registrados'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
