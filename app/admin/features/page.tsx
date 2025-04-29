import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function FeaturesPage() {
  const supabase = await createClient();
  
  // Obtener todas las características
  const { data: features, error } = await supabase
    .from('features')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching features:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Características</h1>
          <p className="text-muted-foreground">
            Gestiona las características disponibles para los paquetes
          </p>
        </div>
        <Link href="/admin/features/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Característica
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-4 p-4 font-medium bg-muted">
          <div>Nombre</div>
          <div>Descripción</div>
          <div>Icono</div>
          <div>Acciones</div>
        </div>
        <div className="divide-y">
          {features?.map((feature) => (
            <div key={feature.id} className="grid grid-cols-4 p-4 items-center">
              <div className="font-medium">{feature.name}</div>
              <div className="text-sm text-muted-foreground">
                {feature.description || "Sin descripción"}
              </div>
              <div className="text-sm font-mono">{feature.icon || "—"}</div>
              <div className="flex space-x-2">
                <Link href={`/admin/features/${feature.id}`} passHref>
                  <Button variant="outline" size="sm">Editar</Button>
                </Link>
                <form action={`/api/admin/features/${feature.id}/delete`} method="POST">
                  <Button 
                    type="submit" 
                    variant="destructive"
                    size="sm"
                  >
                    Eliminar
                  </Button>
                </form>
              </div>
            </div>
          ))}
          {(!features || features.length === 0) && (
            <div className="p-4 text-center text-muted-foreground">
              No hay características disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}