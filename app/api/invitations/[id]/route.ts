import { NextRequest, NextResponse } from "next/server";
import * as invitationService from "@/services/invitation.service";

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
    const { data, error } = await invitationService.getInvitation(id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data) {
      return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener invitación" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
) {
  try {
    //extraer los params del  request
    const objUrl = request.nextUrl
    const params = objUrl.searchParams

    const id = params.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "No se proporcionó un ID válido" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const { data, error } = await invitationService.updateInvitation(id, body);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar invitación" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    //extraer los params del   request
    const objUrl = request.nextUrl
    const params = objUrl.searchParams

    const id = params.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "No se proporcionó un ID válido" },
        { status: 400 }
      );
    }
    const { error } = await invitationService.deleteInvitation(id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar invitación" }, { status: 500 });
  }
}