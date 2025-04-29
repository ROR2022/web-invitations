import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/services/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const body = await request.json();
    
    // Validar datos mínimos necesarios
    if (!body.invitation_id || !body.name) {
      return NextResponse.json(
        { error: "Se requiere invitation_id y name" }, 
        { status: 400 }
      );
    }
    
    // Crear el attendee
    const { data, error } = await supabase
      .from('attendees')
      .insert([body])
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al registrar asistente" }, 
      { status: 500 }
    );
  }
}