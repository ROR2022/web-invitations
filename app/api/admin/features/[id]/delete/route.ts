import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/services/supabaseClient";

export async function POST(
  request: NextRequest
) {
  try {
    // Verificar que el usuario es administrador
    if (!await isAdmin()) {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 }
      );
    }

    //extraer los params del request
    const objUrl = request.nextUrl
    const params = objUrl.searchParams

    const id = params.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "No se proporcionó un ID válido" },
        { status: 400 }
      );
    }
    const supabase = await createClient();
    
    // Verificar si existen relaciones en package_features
    const { count, error: countError } = await supabase
      .from("package_features")
      .select("*", { count: 'exact', head: true })
      .eq("feature_id", id);
      
    if (countError) {
      return NextResponse.json(
        { error: `Error al verificar relaciones: ${countError.message}` },
        { status: 400 }
      );
    }
    
    // No permitir eliminar características que están en uso
    if (count && count > 0) {
      return NextResponse.json(
        { 
          error: "No se puede eliminar esta característica porque está asociada a uno o más paquetes",
          count
        },
        { status: 400 }
      );
    }
    
    // Eliminar la característica
    const { error: deleteError } = await supabase
      .from("features")
      .delete()
      .eq("id", id);
      
    if (deleteError) {
      return NextResponse.json(
        { error: `Error al eliminar la característica: ${deleteError.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Característica eliminada correctamente"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}