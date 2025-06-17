import { 
  Invitation, 
  InvitationStatus, 
  PackageType,
  EventType,
  CreateInvitationDTO,
  GuestRSVP
} from '@/types/invitation';

/**
 * Obtiene todas las invitaciones del usuario
 */
export async function getUserInvitations(): Promise<Invitation[]> {
  try {
    const res = await fetch('/api/invitations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error fetching invitations');
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error in getUserInvitations client:', error);
    throw error;
  }
}

/**
 * Obtiene una invitación por su ID
 */
export async function getInvitationById(id: string): Promise<Invitation> {
  try {
    const res = await fetch(`/api/invitations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error fetching invitation');
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error in getInvitationById client:', error);
    throw error;
  }
}

/**
 * Crea una nueva invitación
 */
export async function createInvitation(data: CreateInvitationDTO): Promise<Invitation> {
  try {
    const res = await fetch('/api/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error creating invitation');
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error in createInvitation client:', error);
    throw error;
  }
}

/**
 * Actualiza una invitación existente
 */
export async function updateInvitation(
  id: string,
  updates: Partial<Invitation>
): Promise<Invitation> {
  try {
    const res = await fetch(`/api/invitations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error updating invitation');
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error in updateInvitation client:', error);
    throw error;
  }
}

/**
 * Elimina una invitación
 */
export async function deleteInvitation(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/invitations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error deleting invitation');
    }

    return true;
  } catch (error: any) {
    console.error('Error in deleteInvitation client:', error);
    throw error;
  }
}

/**
 * Publica una invitación (cambia el estado a PUBLISHED)
 */
export async function publishInvitation(id: string): Promise<Invitation> {
  try {
    const res = await fetch(`/api/invitations/${id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      const error = new Error(errorData.error || 'Error publishing invitation');
      
      if (errorData.validationErrors) {
        (error as any).validationErrors = errorData.validationErrors;
      }
      
      throw error;
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error in publishInvitation client:', error);
    throw error;
  }
}

/**
 * Archiva una invitación (cambia el estado a ARCHIVED)
 */
export async function archiveInvitation(id: string): Promise<Invitation> {
  try {
    const res = await fetch(`/api/invitations/${id}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error archiving invitation');
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error in archiveInvitation client:', error);
    throw error;
  }
}

/**
 * Obtiene las estadísticas de una invitación
 */
export async function getInvitationStats(id: string): Promise<any> {
  try {
    const res = await fetch(`/api/invitations/${id}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error fetching invitation stats');
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error in getInvitationStats client:', error);
    throw error;
  }
}

/**
 * Registra una vista de invitación
 */
export async function recordInvitationView(invitationId: string, visitorId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/invitations/${invitationId}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visitorId }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.warn('Error recording view:', error);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('Error in recordInvitationView client:', error);
    return false;
  }
}

/**
 * Guarda la confirmación de asistencia (RSVP) de un invitado
 */
export async function saveGuestRSVP(data: Omit<GuestRSVP, 'id' | 'createdAt'>): Promise<boolean> {
  try {
    const res = await fetch(`/api/invitations/${data.invitationId}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error saving RSVP');
    }

    return true;
  } catch (error: any) {
    console.error('Error in saveGuestRSVP client:', error);
    throw error;
  }
} 