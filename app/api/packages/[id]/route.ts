import { NextRequest, NextResponse } from "next/server";
import * as packageService from "@/services/package.service";

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
    const { data, error } = await packageService.getPackage(id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data) {
      return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener paquete" }, { status: 500 });
  }
}