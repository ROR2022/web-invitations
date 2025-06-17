import { NextRequest, NextResponse } from 'next/server';
import { getInvitationStats } from '@/services/invitation.service';
import { createClient } from '@/utils/supabase/server';

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
    
    const result = await getInvitationStats(id, user.id);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 