import { NextRequest, NextResponse } from 'next/server';
import { recordInvitationView } from '@/services/invitation.service';

/**
 * API para registrar una vista de invitación
 * POST /api/invitations/[id]/view
 */
export async function POST(
  request: NextRequest
) {
  try {
    const objUrl = request.nextUrl;
    const params = objUrl.searchParams; 
    const id = params.get('id') || '';
    
    // Obtener el ID de visitante del cuerpo
    const body = await request.json();
    const { visitorId } = body;
    
    if (!visitorId) {
      return NextResponse.json(
        { error: 'Se requiere ID de visitante' },
        { status: 400 }
      );
    }
    
    // Registrar la vista
    const invitationId = id;
    const { success, error } = await recordInvitationView(invitationId, visitorId);
    
    if (!success) {
      return NextResponse.json(
        { error: error || 'Error al registrar la vista' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error en API de registro de vista:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 