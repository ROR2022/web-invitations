import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Obtener estadísticas básicas
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  const { count: invitationsCount } = await supabase
    .from('invitations')
    .select('*', { count: 'exact', head: true });
    
  const { count: templatesCount } = await supabase
    .from('templates')
    .select('*', { count: 'exact', head: true });
    
  const { count: packagesCount } = await supabase
    .from('packages')
    .select('*', { count: 'exact', head: true });

  // Obtener invitaciones recientes
  const { data: recentInvitations } = await supabase
    .from('invitations')
    .select('id, title, created_at, payment_status, is_published')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { title: "Usuarios", value: usersCount || 0, description: "Total de usuarios registrados" },
    { title: "Invitaciones", value: invitationsCount || 0, description: "Invitaciones creadas" },
    { title: "Plantillas", value: templatesCount || 0, description: "Plantillas disponibles" },
    { title: "Paquetes", value: packagesCount || 0, description: "Paquetes disponibles" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Panel principal de administración
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Invitations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Invitaciones Recientes</h2>
        <div className="rounded-md border">
          <div className="grid grid-cols-5 p-4 font-medium bg-muted">
            <div>ID</div>
            <div>Título</div>
            <div>Fecha</div>
            <div>Estado de Pago</div>
            <div>Publicada</div>
          </div>
          <div className="divide-y">
            {recentInvitations?.map((invitation) => (
              <div key={invitation.id} className="grid grid-cols-5 p-4 items-center">
                <div className="text-sm font-mono">{invitation.id.substring(0, 8)}...</div>
                <div>{invitation.title}</div>
                <div>{new Date(invitation.created_at).toLocaleDateString()}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invitation.payment_status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invitation.payment_status}
                  </span>
                </div>
                <div>
                  {invitation.is_published ? 
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Sí
                    </span> :
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No
                    </span>
                  }
                </div>
              </div>
            ))}
            {(!recentInvitations || recentInvitations.length === 0) && (
              <div className="p-4 text-center text-muted-foreground">
                No hay invitaciones recientes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}