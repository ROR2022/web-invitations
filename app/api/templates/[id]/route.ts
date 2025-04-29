import { NextRequest, NextResponse } from "next/server";
import * as templateService from "@/services/template.service";

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
    const { data, error } = await templateService.getTemplate(id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener plantilla" }, { status: 500 });
  }
}