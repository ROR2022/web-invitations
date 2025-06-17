import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateInvitation, getInvitationById } from '@/services/invitation.service';
import { InvitationStatus } from '@/types/invitation';
import { validateInvitationForPublishing, generatePublicSlug } from '@/utils/invitation-validator';

/**
 * API para publicar una invitación
 * POST /api/invitations/[id]/publish
 */
export async function POST(
  request: NextRequest
) {
  try {
    const objUrl = request.nextUrl;
    const params = objUrl.searchParams; 
    const id = params.get('id') || '';
    
    // Verificar autenticación
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Obtener la invitación actual
    const invitationId = id as string;
    const { data: invitation, error: fetchError } = await getInvitationById(invitationId, session.user.id);
    
    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: fetchError || 'Invitación no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar que la invitación esté en borrador o haya estado publicada antes
    if (invitation.status !== InvitationStatus.DRAFT && invitation.status !== InvitationStatus.PUBLISHED) {
      return NextResponse.json(
        { error: 'Solo se pueden publicar invitaciones en estado borrador' },
        { status: 400 }
      );
    }
    
    // Validar que tenga todos los campos requeridos
    const validationErrors = validateInvitationForPublishing(invitation);
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'La invitación no cumple con todos los requisitos para ser publicada',
          validationErrors 
        },
        { status: 400 }
      );
    }
    
    // Generar URL pública si no existe
    const publicUrl = invitation.publicUrl || generatePublicSlug(invitation);
    
    // Actualizar invitación a estado publicado
    const { data: updatedInvitation, error: updateError } = await updateInvitation(
      invitationId,
      session.user.id || '',
      {
        status: InvitationStatus.PUBLISHED,
        publicUrl,
        publishedAt: new Date().toISOString()
      }
    );
    
    if (updateError || !updatedInvitation) {
      return NextResponse.json(
        { error: updateError || 'Error al publicar la invitación' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedInvitation);
    
  } catch (error: any) {
    console.error('Error en API de publicación:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 