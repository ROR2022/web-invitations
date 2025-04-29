import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// Acción del servidor para guardar la característica
async function saveFeature(formData: FormData) {
  "use server";
  
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const isEdit = id && id !== "new";
  
  // Datos básicos de la característica
  const featureData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
  };
  
  let result;
  
  // Crear o actualizar la característica
  if (isEdit) {
    // Actualizar característica existente
    result = await supabase
      .from("features")
      .update(featureData)
      .eq("id", id);
  } else {
    // Crear nueva característica
    result = await supabase
      .from("features")
      .insert(featureData)
      .select();
  }
  
  if (result.error) {
    console.error("Error guardando característica:", result.error);
    throw new Error(`Error al guardar característica: ${result.error.message}`);
  }
  
  // Revalidar y redirigir
  revalidatePath("/admin/features");
  redirect("/admin/features");
}

export default async function FeatureEditPage(props: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const params = await props.params;
  const isNewFeature = params.id === "new";
  
  let featureData = null;
  
  if (!isNewFeature) {
    // Obtener datos de la característica existente
    const { data: feature, error } = await supabase
      .from("features")
      .select("*")
      .eq("id", params.id)
      .single();
      
    if (error || !feature) {
      notFound();
    }
    
    featureData = feature;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/features" passHref>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewFeature ? "Nueva Característica" : "Editar Característica"}
          </h1>
        </div>
      </div>
      
      <form action={saveFeature} className="space-y-8 max-w-xl">
        <input type="hidden" name="id" value={params.id} />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Nombre de la característica" 
              defaultValue={featureData?.name || ""}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe la característica..." 
              defaultValue={featureData?.description || ""}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icono</Label>
            <Input 
              id="icon" 
              name="icon" 
              placeholder="lucide-calendar" 
              defaultValue={featureData?.icon || ""}
            />
            <p className="text-xs text-muted-foreground">
              Nombre del icono de Lucide o clase CSS para mostrar junto a la característica
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <Link href="/admin/features" passHref>
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit">
            {isNewFeature ? "Crear Característica" : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}