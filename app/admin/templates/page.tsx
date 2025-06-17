import { createClient } from "@/utils/supabase/server";
import TemplateList from "./template-list";

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

  // Pasar datos al componente cliente
  return <TemplateList initialTemplates={templates || []} />;
}