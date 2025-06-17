import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Edit, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvitationPreview from "@/components/template-editor/InvitationPreview";

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
    description: formData.get("description") as string || '',
    thumbnail: formData.get("thumbnail") as string,
    // Ahora usamos config como principal, pero mantenemos compatibilidad con campos antiguos
    is_public: formData.has("is_public"),
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
  
  // Verificar si la plantilla usa el nuevo enfoque basado en config
  const hasConfigFormat = templateData?.config && Object.keys(templateData.config).length > 0;
  
  // Mostrar advertencia si tiene HTML/CSS/JS pero no tiene configuración
  const needsMigration = (templateData?.html || templateData?.css || templateData?.js) && !hasConfigFormat;
  
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
        
        {!isNewTemplate && (
          <div className="flex space-x-2">
            <Link href={`/admin/templates/editor/${params.id}`} passHref>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Abrir en Editor
              </Button>
            </Link>
            {hasConfigFormat && (
              <Link href={`/templates/preview/${params.id}`} passHref>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Vista Previa
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
      
      {needsMigration && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Esta plantilla usa el formato antiguo (HTML/CSS/JS) y debe ser migrada al nuevo formato basado en configuración.
                <Link href="/admin/templates/migration" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-2">
                  Ir a la herramienta de migración
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form action={saveTemplate} className="space-y-8">
        <input type="hidden" name="id" value={params.id} />
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            {!hasConfigFormat && (
              <TabsTrigger value="content">Contenido HTML/CSS/JS</TabsTrigger>
            )}
            {hasConfigFormat && (
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            )}
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Describe brevemente esta plantilla..." 
                defaultValue={templateData?.description || ""}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL de Thumbnail</Label>
                <Input 
                  id="thumbnail" 
                  name="thumbnail" 
                  placeholder="https://example.com/imagen.jpg" 
                  defaultValue={templateData?.thumbnail || ""}
                  required
                />
              </div>
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox 
                  id="is_public" 
                  name="is_public" 
                  defaultChecked={templateData?.is_public === true}
                />
                <Label htmlFor="is_public">Plantilla Pública</Label>
              </div>
            </div>
            
            {templateData?.thumbnail && (
              <div className="mt-4">
                <p className="text-sm mb-2">Vista previa:</p>
                <div className="relative h-40 w-64 rounded-md overflow-hidden border">
                  <Image 
                    src={templateData.thumbnail}
                    alt="Vista previa"
                    fill
                    sizes="(max-width: 640px) 100vw, 256px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          {!hasConfigFormat && (
            <TabsContent value="content" className="space-y-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-sm text-amber-700 mb-4">
                Este es el formato antiguo para almacenar plantillas. Considera migrar a la nueva arquitectura basada en configuración.
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="html_content">Contenido HTML</Label>
                <Textarea 
                  id="html_content" 
                  name="html_content" 
                  placeholder="<div>Contenido HTML de la plantilla...</div>" 
                  defaultValue={templateData?.html || ""}
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="css_content">Contenido CSS</Label>
                <Textarea 
                  id="css_content" 
                  name="css_content" 
                  placeholder="body { font-family: sans-serif; }" 
                  defaultValue={templateData?.css || ""}
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="js_content">Contenido JavaScript</Label>
                <Textarea 
                  id="js_content" 
                  name="js_content" 
                  placeholder="document.addEventListener('DOMContentLoaded', () => { ... });" 
                  defaultValue={templateData?.js || ""}
                  rows={6}
                />
              </div>
            </TabsContent>
          )}
          
          {hasConfigFormat && (
            <TabsContent value="preview" className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-700 mb-4">
                Esta plantilla usa el nuevo formato basado en configuración. Para modificar su contenido, usa el editor de plantillas.
              </div>
              
              <div className="border rounded-md p-4">
                <div className="w-full max-w-2xl mx-auto bg-white shadow-sm rounded-md overflow-hidden border">
                  {/* Renderizar una vista previa usando la configuración */}
                  {templateData?.config && (
                    <div className="h-[500px] overflow-auto">
                      <InvitationPreview config={templateData.config} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Link href={`/admin/templates/editor/${params.id}`} passHref>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Plantilla
                  </Button>
                </Link>
              </div>
            </TabsContent>
          )}
          
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