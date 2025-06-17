import { NextRequest, NextResponse } from "next/server";
import * as invitationService from "@/services/invitation.service";
import { createClient } from '@/utils/supabase/server';

// Helper to get the ID from the route or query params
const getInvitationId = (request: NextRequest, params?: { id: string }) => {
  // Try to get from route params first if available
  if (params?.id && params.id !== 'route') {
    return params.id;
  }
  
  // Otherwise try from query params
  const objUrl = request.nextUrl
  const queryParams = objUrl.searchParams
  const id = queryParams.get('id');
  
  if (!id) {
    throw new Error("No se proporcionó un ID válido");
  }
  
  return id;
};

export async function GET(
  request: NextRequest
) {
  try {
    const objUrl = request.nextUrl;
    const params = objUrl.searchParams; 
    const id = params.get('id') || '';
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const result = await invitationService.getInvitationById(id, user.id);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
) {
  try {
    const objUrl = request.nextUrl;
    const params = objUrl.searchParams; 
    const id = params.get('id') || '';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const updates = await request.json();
    const result = await invitationService.updateInvitation(id, user.id, updates);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const objUrl = request.nextUrl;
    const params = objUrl.searchParams; 
    const id = params.get('id') || '';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const result = await invitationService.deleteInvitation(id, user.id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}