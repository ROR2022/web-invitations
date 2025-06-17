import { NextRequest, NextResponse } from "next/server";
import * as invitationService from "@/services/invitation.service";
import { generateSlug } from "@/utils/slugUtils";
import { getUserInvitations, createInvitation } from '@/services/invitation.service';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const result = await getUserInvitations(user.id);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const body = await request.json();
    const result = await createInvitation(user.id, body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}