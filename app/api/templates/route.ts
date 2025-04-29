import { NextRequest, NextResponse } from "next/server";
import * as templateService from "@/services/template.service";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await templateService.listTemplates();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al listar plantillas" }, { status: 500 });
  }
}