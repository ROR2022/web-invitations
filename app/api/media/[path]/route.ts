import { NextRequest, NextResponse } from "next/server";
import * as mediaService from "@/services/media.service";

export async function GET(
  request: NextRequest
) {
  try {
    // Decodificar la ruta que viene en la URL
    const objUrl = request.nextUrl
    const params = objUrl.searchParams

    const path = decodeURIComponent(params.get('path') || '');
    const url = mediaService.getMediaUrl(path);
    
    return NextResponse.json({ url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener URL del archivo" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    // Decodificar la ruta que  viene en la URL
    const objUrl = request.nextUrl
    const params = objUrl.searchParams

    const path = decodeURIComponent(params.get('path') || '');
    const { data, error } = await mediaService.deleteMedia(path);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al eliminar archivo" }, 
      { status: 500 }
    );
  }
}