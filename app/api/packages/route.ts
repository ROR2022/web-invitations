import { NextRequest, NextResponse } from "next/server";
import * as packageService from "@/services/package.service";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await packageService.listPackages();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al listar paquetes" }, { status: 500 });
  }
}