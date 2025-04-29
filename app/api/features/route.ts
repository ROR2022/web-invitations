import { NextRequest, NextResponse } from "next/server";
import * as featureService from "@/services/feature.service";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await featureService.listFeatures();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al listar características" }, { status: 500 });
  }
}