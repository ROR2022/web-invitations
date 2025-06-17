import { NextRequest, NextResponse } from "next/server";
import * as templateService from "@/services/template.service";
import { createClient } from "@/utils/supabase/server";

// Endpoint para crear una plantilla temporal
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticación - necesario para seguridad aunque no guardemos el ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }
    
    // Crear plantilla temporal sin pasar el user_id
    const { data, error } = await templateService.createTemporaryTemplate();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { data, message: "Plantilla temporal creada con éxito" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al crear plantilla temporal:", error);
    
    return NextResponse.json(
      { error: error.message || "Error al crear plantilla temporal" },
      { status: 500 }
    );
  }
} 