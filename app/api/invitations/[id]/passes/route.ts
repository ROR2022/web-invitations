import { NextRequest, NextResponse } from "next/server";
import * as invitationService from "@/services/invitation.service";

export async function POST(
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
    const { count } = await request.json();
    
    if (!count || typeof count !== 'number' || count <= 0) {
      return NextResponse.json({ error: "Se requiere un número válido de pases a generar" }, { status: 400 });
    }
    
    const { data, error } = await invitationService.generatePasses(id, count);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data, count }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al generar pases" }, { status: 500 });
  }
}