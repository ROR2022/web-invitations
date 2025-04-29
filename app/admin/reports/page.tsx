import { createClient } from "@/utils/supabase/server";
//import { Card } from "@/components/ui/card";
import ReportsContent from "@/components/admin/ReportsContent";

// Importar el componente de carga dinámica para evitar problemas de SSR
//import dynamic from "next/dynamic";

// Cargar el componente completo de reportes de forma dinámica
// @ts-ignore - Ignoramos el error de tipado durante la compilación ya que el componente existe
/* const ReportsContent = dynamic(
  () => import('../../../components/admin/ReportsContent'),
  { ssr: false, loading: () => <p>Cargando reportes...</p> }
);
 */
// Componente servidor que obtiene los datos
export default async function ReportsPage() {
  const supabase = await createClient();
  
  // Obtener estadísticas de invitaciones por estado de pago
  const { data: paymentStats, error: paymentError } = await supabase
    .rpc('get_payment_stats', {}, { count: 'exact' });

  // Alternativa si no tienes una función RPC:
  // const { data: paymentStats, error: paymentError } = await supabase
  //   .from('invitations')
  //   .select('payment_status')
  //   .then(async ({ data, error }) => {
  //     if (error || !data) return { data: [], error };
  //     
  //     // Agrupar los estados de pago únicos
  //     const uniqueStatuses = [...new Set(data.map(item => item.payment_status))];
  //     
  //     // Contar invitaciones para cada estado
  //     const statsPromises = uniqueStatuses.map(async (status) => {
  //       const { count } = await supabase
  //         .from('invitations')
  //         .select('*', { count: 'exact', head: true })
  //         .eq('payment_status', status);
  //       
  //       return {
  //         payment_status: status,
  //         count: count || 0
  //       };
  //     });
  //     
  //     const stats = await Promise.all(statsPromises);
  //     return { data: stats, error: null };
  //   });
    
  if (paymentError) {
    console.error('Error fetching payment stats:', paymentError);
  }
  
  // Obtener estadísticas de invitaciones por tipo de evento
  const { data: eventTypeStats, error: eventTypeError } = await supabase
    .from('templates')
    .select('event_type, id')
    .then(async ({ data: templates, error }) => {
      if (error || !templates) return { data: [], error };
      
      // Para cada tipo de evento, contamos las invitaciones relacionadas
      const statsPromises = templates.map(async (template) => {
        const { count } = await supabase
          .from('invitations')
          .select('*', { count: 'exact', head: true })
          .eq('template_id', template.id);
        
        return {
          event_type: template.event_type,
          count: count || 0
        };
      });
      
      const stats = await Promise.all(statsPromises);
      
      // Agrupamos por tipo de evento sumando los conteos
      const eventTypeMap = new Map();
      stats.forEach(stat => {
        const currentCount = eventTypeMap.get(stat.event_type) || 0;
        eventTypeMap.set(stat.event_type, currentCount + stat.count);
      });
      
      return { 
        data: Array.from(eventTypeMap).map(([event_type, count]) => ({ event_type, count })),
        error: null 
      };
    });
    
  if (eventTypeError) {
    console.error('Error fetching event type stats:', eventTypeError);
  }
  
  // Obtener estadísticas de uso de paquetes
  const { data: packageStats, error: packageError } = await supabase
    .from('packages')
    .select('name, id')
    .then(async ({ data: packages, error }) => {
      if (error || !packages) return { data: [], error };
      
      // Para cada paquete, contamos las invitaciones relacionadas
      const statsPromises = packages.map(async (pkg) => {
        const { count } = await supabase
          .from('invitations')
          .select('*', { count: 'exact', head: true })
          .eq('package_id', pkg.id);
        
        return {
          name: pkg.name,
          count: count || 0
        };
      });
      
      const stats = await Promise.all(statsPromises);
      return { data: stats, error: null };
    });
    
  if (packageError) {
    console.error('Error fetching package stats:', packageError);
  }
  
  // Preparar los datos para pasar al componente cliente
  const reportData = {
    paymentStats: paymentStats || [],
    eventTypeStats: eventTypeStats || [],
    packageStats: packageStats || []
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">
          Estadísticas y análisis de uso de la plataforma
        </p>
      </div>
      
      {/* @ts-ignore - Ignoramos el error de tipado durante la compilación */}
      {reportData && 
        <ReportsContent data={reportData} />
      }
      
    </div>
  );
}