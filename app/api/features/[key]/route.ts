import { NextRequest, NextResponse } from "next/server";
import * as featureService from "@/services/feature.service";

export async function GET(
  request: NextRequest
) {
  try {
    //extraer los params del r  equest
    const objUrl = request.nextUrl
    const params = objUrl.searchParams

    const key = params.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: "No se proporcionó una clave válida" },
        { status: 400 }
      );
    }
    const { enabled, error } = await featureService.isFeatureEnabled(key);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ enabled });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al verificar característica" }, { status: 500 });
  }
}