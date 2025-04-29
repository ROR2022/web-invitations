import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function PackagesPage() {
  const supabase = await createClient();
  
  // Obtener todos los paquetes
  const { data: packages, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_features(
        id,
        feature:features(id, name)
      )
    `)
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching packages:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paquetes</h1>
          <p className="text-muted-foreground">
            Gestiona los paquetes disponibles para los usuarios
          </p>
        </div>
        <Link href="/admin/packages/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Paquete
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-6 p-4 font-medium bg-muted">
          <div>Nombre</div>
          <div>Slug</div>
          <div>Precio</div>
          <div>Features</div>
          <div>Estado</div>
          <div>Acciones</div>
        </div>
        <div className="divide-y">
          {packages?.map((pkg) => (
            <div key={pkg.id} className="grid grid-cols-6 p-4 items-center">
              <div className="font-medium">{pkg.name}</div>
              <div className="text-sm font-mono">{pkg.slug}</div>
              <div>${pkg.price.toFixed(2)}</div>
              <div className="text-sm">
                {pkg.package_features?.length || 0}
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pkg.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pkg.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <Link href={`/admin/packages/${pkg.id}`} passHref>
                  <Button variant="outline" size="sm">Editar</Button>
                </Link>
                <form action={`/api/admin/packages/${pkg.id}/toggle`} method="POST">
                  <Button 
                    type="submit" 
                    variant={pkg.is_active ? "destructive" : "outline"}
                    size="sm"
                  >
                    {pkg.is_active ? 'Desactivar' : 'Activar'}
                  </Button>
                </form>
              </div>
            </div>
          ))}
          {(!packages || packages.length === 0) && (
            <div className="p-4 text-center text-muted-foreground">
              No hay paquetes disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}