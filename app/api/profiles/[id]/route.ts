import { NextRequest, NextResponse } from "next/server";
import * as profileService from "@/services/profile.service";

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
    const { data, error } = await profileService.getProfile(id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener perfil" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
) {
  try {
    //extraer los params del  request
    const objUrl = request.nextUrl
    const params = objUrl.searchParams

    const id = params.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "No se proporcionó un ID válido" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const { data, error } = await profileService.updateProfile(id, body);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar perfil" }, { status: 500 });
  }
}