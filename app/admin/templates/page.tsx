import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function TemplatesPage() {
  const supabase = await createClient();
  
  // Obtener todas las plantillas
  const { data: templates, error } = await supabase
    .from('templates')
    .select(`
      *,
      package_templates(
        id,
        package:packages(id, name)
      )
    `)
    .order('event_type', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
  }

  // Agrupar plantillas por tipo de evento
  const templatesByType: Record<string, any[]> = {};
  templates?.forEach(template => {
    if (!templatesByType[template.event_type]) {
      templatesByType[template.event_type] = [];
    }
    templatesByType[template.event_type].push(template);
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plantillas</h1>
          <p className="text-muted-foreground">
            Gestiona las plantillas de invitaciones
          </p>
        </div>
        <Link href="/admin/templates/editor/new" className="flex items-center text-sm" passHref>
          
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Añadir Plantilla</span>
          
        </Link>
      </div>

      {Object.entries(templatesByType).length > 0 ? (
        Object.entries(templatesByType).map(([eventType, eventTemplates]) => (
          <div key={eventType} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">
              {eventType.replace('-', ' ')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventTemplates.map((template) => (
                <div key={template.id} className="rounded-lg border overflow-hidden">
                  <div className="aspect-video relative">
                    <Image 
                      src={template.thumbnail_url} 
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{template.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {template.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.package_templates?.length || 0} paquetes asociados
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/templates/${template.id}`} passHref>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                      <form action={`/api/admin/templates/${template.id}/toggle`} method="POST">
                        <Button 
                          type="submit" 
                          variant={template.is_active ? "destructive" : "outline"}
                          size="sm"
                        >
                          {template.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No hay plantillas disponibles</p>
        </div>
      )}
    </div>
  );
}