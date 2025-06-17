import { NextRequest, NextResponse } from "next/server";
import * as invitationService from "@/services/invitation.service";
import { generateSlug } from "@/utils/slugUtils";

/**
 * API endpoint for creating invitations from templates
 * Uses the new config-based approach instead of HTML/CSS/JS
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.templateId || !body.profileId || !body.name) {
      return NextResponse.json(
        { error: "Se requieren los campos 'templateId', 'profileId' y 'name'" },
        { status: 400 }
      );
    }
    
    // Generate a slug if not provided
    const slug = body.slug || generateSlug(body.name);
    
    // Create invitation from template
    const { data, error } = await invitationService.createInvitationFromTemplate({
      templateId: body.templateId,
      profileId: body.profileId,
      name: body.name,
      slug,
      status: body.status || 'draft',
      customizations: body.customizations || {}
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      data,
      message: "Invitación creada con éxito desde la plantilla" 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al crear invitación desde plantilla" },
      { status: 500 }
    );
  }
} 