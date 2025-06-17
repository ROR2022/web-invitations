import { NextRequest, NextResponse } from "next/server";
import * as templateService from "@/services/template.service";

// Helper to get the ID from the route or query params
const getTemplateId = (request: NextRequest, params: { id: string }) => {
  // Try to get from route params first
  if (params.id && params.id !== 'route') {
    return params.id;
  }
  
  // Otherwise try from query params
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    throw new Error("No se proporcionó un ID válido");
  }
  
  return id;
};

export async function GET(
  request: NextRequest
) {
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get('id');
    if (!id) {
      return NextResponse.json({ error: "No se proporcionó un ID válido" }, { status: 400 });
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

// Update a template
export async function PUT(
  request: NextRequest
) {
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get('id');
    if (!id) {
      return NextResponse.json({ error: "No se proporcionó un ID válido" }, { status: 400 });
    }
    const updates = await request.json();
    
    const { data, error } = await templateService.updateTemplate(id, updates);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data, message: "Plantilla actualizada con éxito" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar plantilla" },
      { status: 500 }
    );
  }
}

// Delete a template
export async function DELETE(
  request: NextRequest
) {
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get('id');
    if (!id) {
      return NextResponse.json({ error: "No se proporcionó un ID válido" }, { status: 400 });
    }
    
    const { error } = await templateService.deleteTemplate(id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Plantilla eliminada con éxito" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al eliminar plantilla" },
      { status: 500 }
    );
  }
}

// Special endpoints for specific operations

// Duplicate a template
export async function POST(
  request: NextRequest
) {
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get('id');
    if (!id) {
      return NextResponse.json({ error: "No se proporcionó un ID válido" }, { status: 400 });
    }
    const { newName } = await request.json();
    
    if (!newName) {
      return NextResponse.json(
        { error: "Se requiere el campo 'newName'" },
        { status: 400 }
      );
    }
    
    const { data, error } = await templateService.duplicateTemplate(id, newName);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { data, message: "Plantilla duplicada con éxito" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al duplicar plantilla" },
      { status: 500 }
    );
  }
}