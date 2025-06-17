import { NextRequest, NextResponse } from "next/server";
import * as templateService from "@/services/template.service";
import { createClient } from "@/utils/supabase/server";

// Endpoint para listar plantillas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('isActive');
    const eventType = searchParams.get('eventType');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const includeDrafts = searchParams.get('includeDrafts');
    const packageType = searchParams.get('packageType');
    const limit = searchParams.get('limit');
    
    const supabase = await createClient();
    
    // Filtrar por tipo de paquete si se proporciona
    let templateIds: string[] = [];
    if (packageType) {
      // Primero obtenemos el paquete por su slug
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('id')
        .eq('slug', packageType)
        .single();
      
      if (packageError || !packageData) {
        return NextResponse.json(
          { error: "Tipo de paquete no encontrado" },
          { status: 400 }
        );
      }
      
      // Luego obtenemos las plantillas asociadas a este paquete
      const { data: templateData, error: templateError } = await supabase
        .from('package_templates')
        .select('template_id')
        .eq('package_id', packageData.id);
      
      if (templateError) {
        return NextResponse.json(
          { error: templateError.message },
          { status: 400 }
        );
      }
      
      // Si hay plantillas para este paquete, filtraremos por sus IDs
      if (templateData && templateData.length > 0) {
        templateIds = templateData.map(t => t.template_id);
      } else {
        // Si no hay plantillas para este paquete, devolver un array vacío
        return NextResponse.json({ data: [] }, { status: 200 });
      }
    }
    
    // Construir la consulta base
    let query = supabase.from('templates').select('*');
    
    // Aplicar filtros
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (status) {
      query = query.eq('status', status);
    } else if (includeDrafts !== 'true') {
      // Si no se especifica el estado y no se piden borradores, solo mostrar publicados
      query = query.eq('status', 'published');
    }
    
    // Aplicar filtro por IDs de plantillas si es necesario
    if (packageType && templateIds.length > 0) {
      query = query.in('id', templateIds);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    // Ordenar por fecha de actualización
    query = query.order('updated_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Para cada plantilla, obtener sus paquetes compatibles
    if (data && data.length > 0) {
      // Obtener todos los IDs de plantillas
      const allTemplateIds = data.map(template => template.id);
      
      // Obtener las relaciones de package_templates y los paquetes asociados
      const { data: packageInfo, error: packageError } = await supabase
        .from('package_templates')
        .select(`
          template_id,
          packages (
            slug
          )
        `)
        .in('template_id', allTemplateIds);
      
      if (!packageError && packageInfo) {
        // Crear un mapeo de plantillas a sus paquetes compatibles
        const packagesByTemplate: Record<string, string[]> = {};
        
        packageInfo.forEach(item => {
          if (!packagesByTemplate[item.template_id]) {
            packagesByTemplate[item.template_id] = [];
          }
          
          // Check if packages is an array and has at least one element
          if (item.packages && Array.isArray(item.packages) && item.packages.length > 0) {
            // Add each package slug to the list
            item.packages.forEach((pkg: any) => {
              if (pkg && pkg.slug) {
                packagesByTemplate[item.template_id].push(pkg.slug as string);
              }
            });
          } else if (item.packages && typeof item.packages === 'object' && 'slug' in item.packages) {
            // Handle case where packages is a single object
            packagesByTemplate[item.template_id].push(item.packages.slug as string);
          }
        });
        
        // Añadir la información de paquetes a cada plantilla
        data.forEach(template => {
          template.compatible_packages = packagesByTemplate[template.id] || [];
        });
      }
    }
    
    return NextResponse.json(
      { data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al listar plantillas:", error);
    
    return NextResponse.json(
      { error: error.message || "Error al listar plantillas" },
      { status: 500 }
    );
  }
}

// Endpoint para crear una plantilla
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // Verificar autenticación - necesario para seguridad aunque no guardemos el ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }
    
    // Crear la plantilla sin pasar user_id
    const { data, error } = await templateService.createTemplate({
      ...body
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al crear plantilla:", error);
    
    return NextResponse.json(
      { error: error.message || "Error al crear plantilla" },
      { status: 500 }
    );
  }
}