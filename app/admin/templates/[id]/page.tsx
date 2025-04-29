import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Acción del servidor para guardar la plantilla
async function saveTemplate(formData: FormData) {
  "use server";
  
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const isEdit = id && id !== "new";
  
  // Datos básicos de la plantilla
  const templateData = {
    name: formData.get("name") as string,
    event_type: formData.get("event_type") as string,
    slug: formData.get("slug") as string,
    thumbnail_url: formData.get("thumbnail_url") as string,
    html_content: formData.get("html_content") as string,
    css_content: formData.get("css_content") as string,
    js_content: formData.get("js_content") as string,
    is_active: formData.has("is_active"),
  };
  
  // Paquetes seleccionados
  const selectedPackages = Array.from(formData.entries())
    .filter(([key, value]) => key.startsWith("package_") && value === "on")
    .map(([key]) => key.replace("package_", ""));
  
  let result;
  
  // Crear o actualizar la plantilla
  if (isEdit) {
    // Actualizar plantilla existente
    result = await supabase
      .from("templates")
      .update(templateData)
      .eq("id", id);
  } else {
    // Crear nueva plantilla
    result = await supabase
      .from("templates")
      .insert(templateData)
      .select()
      .single();
  }
  
  if (result.error) {
    console.error("Error guardando plantilla:", result.error);
    throw new Error(`Error al guardar plantilla: ${result.error.message}`);
  }
  
  // Si es creación, obtenemos el nuevo ID
  const templateId = isEdit ? id : result.data?.id;
  
  if (templateId && selectedPackages.length > 0) {
    // Si es edición, primero eliminamos las relaciones existentes
    if (isEdit) {
      await supabase
        .from("package_templates")
        .delete()
        .eq("template_id", templateId);
    }
    
    // Crear las nuevas relaciones con paquetes
    const packageRelations = selectedPackages.map(packageId => ({
      template_id: templateId,
      package_id: packageId
    }));
    
    const packagesResult = await supabase
      .from("package_templates")
      .insert(packageRelations);
      
    if (packagesResult.error) {
      console.error("Error guardando relaciones de paquetes:", packagesResult.error);
    }
  }
  
  // Revalidar y redirigir
  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

export default async function TemplateEditPage(props: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const params = await props.params;
  const isNewTemplate = params.id === "new";
  
  // Obtener todos los paquetes disponibles
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("name");
    
  let templateData = null;
  let selectedPackages: string[] = [];
  
  if (!isNewTemplate) {
    // Obtener datos de la plantilla existente
    const { data: template, error } = await supabase
      .from("templates")
      .select("*")
      .eq("id", params.id)
      .single();
      
    if (error || !template) {
      notFound();
    }
    
    templateData = template;
    
    // Obtener paquetes asociados a la plantilla
    const { data: templatePackages } = await supabase
      .from("package_templates")
      .select("package_id")
      .eq("template_id", params.id);
      
    selectedPackages = templatePackages?.map(tp => tp.package_id) || [];
  }
  
  // Lista de tipos de eventos para el selector
  const eventTypes = [
    { value: "boda", label: "Boda" },
    { value: "cumpleanos", label: "Cumpleaños" },
    { value: "bautizo", label: "Bautizo" },
    { value: "corporativo", label: "Corporativo" },
    { value: "otro", label: "Otro" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/templates" passHref>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewTemplate ? "Nueva Plantilla" : "Editar Plantilla"}
          </h1>
        </div>
      </div>
      
      <form action={saveTemplate} className="space-y-8">
        <input type="hidden" name="id" value={params.id} />
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="content">Contenido HTML/CSS/JS</TabsTrigger>
            <TabsTrigger value="packages">Paquetes Asociados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Nombre de la plantilla" 
                  defaultValue={templateData?.name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug" 
                  name="slug" 
                  placeholder="nombre-de-plantilla" 
                  defaultValue={templateData?.slug || ""}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_type">Tipo de Evento</Label>
                <select
                  id="event_type"
                  name="event_type"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={templateData?.event_type || ""}
                  required
                >
                  <option value="" disabled>Seleccionar tipo...</option>
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">URL de Thumbnail</Label>
                <Input 
                  id="thumbnail_url" 
                  name="thumbnail_url" 
                  placeholder="https://example.com/imagen.jpg" 
                  defaultValue={templateData?.thumbnail_url || ""}
                  required
                />
              </div>
            </div>
            
            {templateData?.thumbnail_url && (
              <div className="mt-4">
                <p className="text-sm mb-2">Vista previa:</p>
                <div className="relative h-40 w-64 rounded-md overflow-hidden">
                  <Image 
                    src={templateData.thumbnail_url}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_active" 
                name="is_active" 
                defaultChecked={templateData?.is_active !== false}
              />
              <Label htmlFor="is_active">Activa</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="html_content">Contenido HTML</Label>
              <Textarea 
                id="html_content" 
                name="html_content" 
                placeholder="<div>Contenido HTML de la plantilla...</div>" 
                defaultValue={templateData?.html_content || ""}
                rows={10}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="css_content">Contenido CSS</Label>
              <Textarea 
                id="css_content" 
                name="css_content" 
                placeholder="body { font-family: sans-serif; }" 
                defaultValue={templateData?.css_content || ""}
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="js_content">Contenido JavaScript</Label>
              <Textarea 
                id="js_content" 
                name="js_content" 
                placeholder="document.addEventListener('DOMContentLoaded', () => { ... });" 
                defaultValue={templateData?.js_content || ""}
                rows={6}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="packages" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Paquetes que incluyen esta plantilla</h3>
              <div className="grid grid-cols-2 gap-4 border rounded-md p-4">
                {packages?.map((pkg) => (
                  <div key={pkg.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`package_${pkg.id}`} 
                      name={`package_${pkg.id}`} 
                      defaultChecked={selectedPackages.includes(pkg.id)}
                    />
                    <Label htmlFor={`package_${pkg.id}`}>
                      {pkg.name} (${pkg.price})
                    </Label>
                  </div>
                ))}
                
                {(!packages || packages.length === 0) && (
                  <p className="text-muted-foreground text-sm col-span-2">
                    No hay paquetes disponibles
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-end space-x-4">
          <Link href="/admin/templates" passHref>
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit">
            {isNewTemplate ? "Crear Plantilla" : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}