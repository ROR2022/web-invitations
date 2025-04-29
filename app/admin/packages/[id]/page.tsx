import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// Acción del servidor para guardar el paquete
async function savePackage(formData: FormData) {
  "use server";
  
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const isEdit = id && id !== "new";
  
  // Datos básicos del paquete
  const packageData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    price: parseFloat(formData.get("price") as string),
    description: formData.get("description") as string,
    is_active: formData.has("is_active"),
  };
  
  // Características seleccionadas
  const selectedFeatures = Array.from(formData.entries())
    .filter(([key, value]) => key.startsWith("feature_") && value === "on")
    .map(([key]) => key.replace("feature_", ""));
  
  let result;
  
  // Crear o actualizar el paquete
  if (isEdit) {
    // Actualizar paquete existente
    result = await supabase
      .from("packages")
      .update(packageData)
      .eq("id", id);
  } else {
    // Crear nuevo paquete
    result = await supabase
      .from("packages")
      .insert(packageData)
      .select()
      .single();
  }
  
  if (result.error) {
    console.error("Error guardando paquete:", result.error);
    throw new Error(`Error al guardar paquete: ${result.error.message}`);
  }
  
  // Si es creación, obtenemos el nuevo ID
  const packageId = isEdit ? id : result.data?.id;
  
  if (packageId && selectedFeatures.length > 0) {
    // Si es edición, primero eliminamos las relaciones existentes
    if (isEdit) {
      await supabase
        .from("package_features")
        .delete()
        .eq("package_id", packageId);
    }
    
    // Crear las nuevas relaciones con características
    const featureRelations = selectedFeatures.map(featureId => ({
      package_id: packageId,
      feature_id: featureId
    }));
    
    const featuresResult = await supabase
      .from("package_features")
      .insert(featureRelations);
      
    if (featuresResult.error) {
      console.error("Error guardando características:", featuresResult.error);
    }
  }
  
  // Revalidar y redirigir
  revalidatePath("/admin/packages");
  redirect("/admin/packages");
}

export default async function PackageEditPage(props: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const params = await props.params;
  const isNewPackage = params.id === "new";
  
  // Obtener todas las características disponibles
  const { data: features } = await supabase
    .from("features")
    .select("*")
    .order("name");
    
  let packageData = null;
  let selectedFeatures: string[] = [];
  
  if (!isNewPackage) {
    // Obtener datos del paquete existente
    const { data: pkg, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", params.id)
      .single();
      
    if (error || !pkg) {
      notFound();
    }
    
    packageData = pkg;
    
    // Obtener características asociadas al paquete
    const { data: packageFeatures } = await supabase
      .from("package_features")
      .select("feature_id")
      .eq("package_id", params.id);
      
    selectedFeatures = packageFeatures?.map(pf => pf.feature_id) || [];
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/packages" passHref>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewPackage ? "Nuevo Paquete" : "Editar Paquete"}
          </h1>
        </div>
      </div>
      
      <form action={savePackage} className="space-y-8 max-w-2xl">
        <input type="hidden" name="id" value={params.id} />
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Nombre del paquete" 
                defaultValue={packageData?.name || ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input 
                id="slug" 
                name="slug" 
                placeholder="nombre-del-paquete" 
                defaultValue={packageData?.slug || ""}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              step="0.01" 
              placeholder="99.99" 
              defaultValue={packageData?.price || ""}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Descripción del paquete..." 
              defaultValue={packageData?.description || ""}
              rows={4}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_active" 
              name="is_active" 
              defaultChecked={packageData?.is_active !== false}
            />
            <Label htmlFor="is_active">Activo</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Características</h3>
          <div className="grid grid-cols-2 gap-4 border rounded-md p-4">
            {features?.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`feature_${feature.id}`} 
                  name={`feature_${feature.id}`} 
                  defaultChecked={selectedFeatures.includes(feature.id)}
                />
                <Label htmlFor={`feature_${feature.id}`}>
                  {feature.name}
                </Label>
              </div>
            ))}
            
            {(!features || features.length === 0) && (
              <p className="text-muted-foreground text-sm col-span-2">
                No hay características disponibles
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <Link href="/admin/packages" passHref>
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit">
            {isNewPackage ? "Crear Paquete" : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}