import { NextRequest, NextResponse } from "next/server";
import * as mediaService from "@/services/media.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    if (!file || !path) {
      return NextResponse.json(
        { error: "Se requiere un archivo y una ruta" }, 
        { status: 400 }
      );
    }
    
    const { data, error } = await mediaService.uploadMedia(path, file);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al subir archivo" }, 
      { status: 500 }
    );
  }
}