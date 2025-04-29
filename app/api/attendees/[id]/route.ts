import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/services/supabaseClient";

export async function PUT(
  request: NextRequest
) {
  try {
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
    const supabase = await getSupabase();
    const body = await request.json();
    
    // Actualizar el attendee
    const { data, error } = await supabase
      .from('attendees')
      .update(body)
      .eq('id', id)
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Asistente no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ data: data[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar asistente" }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest  
) {
  try {
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
    const supabase = await getSupabase();
    
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data) {
      return NextResponse.json({ error: "Asistente no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener asistente" }, 
      { status: 500 }
    );
  }
}