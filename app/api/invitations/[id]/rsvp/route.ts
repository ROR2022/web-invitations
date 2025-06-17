import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveGuestRSVP } from '@/services/invitation.service';
import { getInvitationById } from '@/services/invitation.service';
import { InvitationStatus } from '@/types/invitation';

// Esquema de validación para el RSVP
const rsvpSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Email inválido' }).optional(),
  phone: z.string().optional(),
  attending: z.boolean(),
  numberOfGuests: z.number().min(0).max(10, { message: 'Máximo 10 invitados adicionales' }),
  message: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
});

export async function POST(
  request: NextRequest
) {
  try {
    const objUrl = request.nextUrl;
    const params = objUrl.searchParams; 
    const id = params.get('id') || '';
    
    // Obtener ID de la invitación
    const invitationId = id;
    if (!invitationId) {
      return NextResponse.json(
        { error: 'ID de invitación no proporcionado' },
        { status: 400 }
      );
    }

    // Verificar que la invitación exista y esté publicada
    const { data: invitation, error: invitationError } = await getInvitationById(invitationId);
    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que la invitación esté publicada
    if (invitation.status !== InvitationStatus.PUBLISHED) {
      return NextResponse.json(
        { error: 'Esta invitación no está disponible para confirmar asistencia' },
        { status: 403 }
      );
    }

    // Obtener y validar los datos del RSVP
    const body = await request.json();
    const validationResult = rsvpSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Guardar el RSVP
    const rsvpData = {
      ...validationResult.data,
      invitationId,
    };

    const { data, error } = await saveGuestRSVP(rsvpData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error guardando RSVP:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la confirmación' },
      { status: 500 }
    );
  }
} 