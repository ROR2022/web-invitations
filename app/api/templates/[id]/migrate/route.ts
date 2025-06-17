import { NextRequest, NextResponse } from "next/server";
import * as templateService from "@/services/template.service";

/**
 * API endpoint for migrating a legacy template to the config-only format
 * This removes html/css/js fields and relies only on the config field
 */
export async function POST(
  request: NextRequest
) {
  try {
    // Get the template ID from route params
    const params = request.nextUrl.searchParams;
    const id = params.get('id');
    if (!id || id === 'migrate') {
      return NextResponse.json(
        { error: "No se proporcionó un ID válido" },
        { status: 400 }
      );
    }
    
    // Attempt to convert the legacy template
    try {
      const { data, error } = await templateService.convertLegacyTemplate(id);
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      return NextResponse.json({
        message: "Plantilla migrada con éxito",
        data
      });
    } catch (error: any) {
      // Special handling for templates that cannot be auto-converted
      if (error.message === 'Legacy template without config cannot be automatically converted') {
        return NextResponse.json({
          error: "Esta plantilla no puede ser migrada automáticamente porque no tiene una configuración",
          needsManualMigration: true
        }, { status: 422 }); // 422 Unprocessable Entity
      }
      
      throw error; // Re-throw for general error handling
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al migrar plantilla" },
      { status: 500 }
    );
  }
} 