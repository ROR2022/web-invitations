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
    
    // Obtener el estado actual de la plantilla
    const { data: templateData, error: fetchError } = await supabase
      .from("templates")
      .select("is_active")
      .eq("id", id)
      .single();
      
    if (fetchError) {
      return NextResponse.json(
        { error: `Error al obtener la plantilla: ${fetchError.message}` },
        { status: 400 }
      );
    }
    
    if (!templateData) {
      return NextResponse.json(
        { error: "Plantilla no encontrada" },
        { status: 404 }
      );
    }
    
    // Invertir el estado actual
    const newState = !templateData.is_active;
    
    // Actualizar el estado
    const { error: updateError } = await supabase
      .from("templates")
      .update({ is_active: newState })
      .eq("id", id);
      
    if (updateError) {
      return NextResponse.json(
        { error: `Error al actualizar la plantilla: ${updateError.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Plantilla ${newState ? 'activada' : 'desactivada'} correctamente`,
      is_active: newState
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}