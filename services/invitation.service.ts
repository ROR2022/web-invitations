//import { Database } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { 
  Invitation, 
  InvitationStatus,
  CreateInvitationDTO,
  GuestRSVP
} from '@/types/invitation';
import { v4 as uuidv4 } from 'uuid';



/**
 * Obtiene todas las invitaciones de un usuario
 */
export async function getUserInvitations(userId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching invitations: ${error.message}`);
    }

    return { data: transformInvitations(data), error: null };
  } catch (error: any) {
    console.error('Error in getUserInvitations:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Obtiene una invitación por su ID
 */
export async function getInvitationById(id: string, userId?: string) {
  const supabase = await createClient();
  try {
    let query = supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      
    
    // Si se proporciona un userId, verificar que la invitación pertenezca al usuario
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) {
      throw new Error(`Error fetching invitation: ${error.message}`);
    }

    return { data: transformInvitation(data), error: null };
  } catch (error: any) {
    console.error('Error in getInvitationById:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Crea una nueva invitación para un usuario
 */
export async function createInvitation(userId: string, dto: CreateInvitationDTO) {
  const supabase = await createClient();
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    // Configuración por defecto
    const defaultConfig = {
      title: "Mi Invitación",
      eventDate: "",
      eventTime: "",
      location: "",
      eventType: dto.eventType,
      hostNames: [],
      rsvpEnabled: true,
      theme: {
        primaryColor: "#9333ea",
        secondaryColor: "#6b21a8",
        fontFamily: "Montserrat",
      },
      components: {
        countdown: true,
        map: true,
        gallery: dto.packageType !== 'basic',
        music: dto.packageType !== 'basic',
        gifts: true,
        itinerary: dto.packageType === 'vip',
        accommodation: dto.packageType === 'vip',
      },
      templateId: dto.templateId
    };

    // Mezclar la configuración predeterminada con la inicial si se proporciona
    const config = dto.initialConfig 
      ? { ...defaultConfig, ...dto.initialConfig }
      : defaultConfig;

    const newInvitation = {
      id,
      user_id: userId,
      status: InvitationStatus.DRAFT,
      package_type: dto.packageType,
      config,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('invitations')
      .insert(newInvitation)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating invitation: ${error.message}`);
    }

    return { data: transformInvitation(data), error: null };
  } catch (error: any) {
    console.error('Error in createInvitation:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Actualiza una invitación existente
 */
export async function updateInvitation(
  id: string, 
  userId: string, 
  updates: Partial<Invitation>
) {
  const supabase = await createClient();
  try {
    // Transformar el objeto de actualización para PostgreSQL
    const now = new Date().toISOString();
    const dbUpdates: any = {
      updated_at: now
    };

    // Manejar status si se proporciona
    if (updates.status) {
      dbUpdates.status = updates.status;
    }

    // Si hay un cambio de estado a PUBLISHED, establecer publishedAt
    if (updates.status === InvitationStatus.PUBLISHED && !updates.publishedAt) {
      dbUpdates.published_at = now;
    }

    // Manejar config si se proporciona
    if (updates.config) {
      dbUpdates.config = updates.config;
    }

    // Manejar packageType si se proporciona
    if (updates.packageType) {
      dbUpdates.package_type = updates.packageType;
    }

    // Manejar publicUrl si se proporciona
    if (updates.publicUrl) {
      dbUpdates.public_url = updates.publicUrl;
    }

    const { data, error } = await supabase
      .from('invitations')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId) // Asegurar que el usuario sea el propietario
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating invitation: ${error.message}`);
    }

    return { data: transformInvitation(data), error: null };
  } catch (error: any) {
    console.error('Error in updateInvitation:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Elimina una invitación
 */
export async function deleteInvitation(id: string, userId: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Asegurar que el usuario sea el propietario

    if (error) {
      throw new Error(`Error deleting invitation: ${error.message}`);
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error in deleteInvitation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene las estadísticas de una invitación
 */
export async function getInvitationStats(id: string, userId: string) {
  const supabase = await createClient();
  try {
    // Verificar que la invitación pertenezca al usuario
    const invitationResult = await getInvitationById(id, userId);
    if (invitationResult.error) {
      throw new Error(invitationResult.error);
    }

    // Obtener estadísticas de vistas
    const { data: viewsData, error: viewsError } = await supabase
      .from('invitation_views')
      .select('*')
      .eq('invitation_id', id);

    if (viewsError) {
      throw new Error(`Error fetching invitation views: ${viewsError.message}`);
    }

    // Obtener RSVPs
    const { data: rsvpData, error: rsvpError } = await supabase
      .from('guest_rsvps')
      .select('*')
      .eq('invitation_id', id);

    if (rsvpError) {
      throw new Error(`Error fetching invitation RSVPs: ${rsvpError.message}`);
    }

    // Calcular estadísticas
    const uniqueVisitors = new Set(viewsData.map(view => view.visitor_id)).size;
    const confirmations = rsvpData.filter(rsvp => rsvp.attending).length;
    const declines = rsvpData.filter(rsvp => !rsvp.attending).length;

    const stats = {
      views: viewsData.length,
      uniqueVisitors,
      confirmations,
      declines,
      pending: 0 // No tenemos invitados pendientes aún
    };

    return { data: stats, error: null };
  } catch (error: any) {
    console.error('Error in getInvitationStats:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Guarda una confirmación (RSVP) de un invitado
 */
export async function saveGuestRSVP(rsvp: Omit<GuestRSVP, 'id' | 'createdAt'>) {
  const supabase = await createClient();
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newRSVP = {
      id,
      invitation_id: rsvp.invitationId,
      name: rsvp.name,
      email: rsvp.email || null,
      phone: rsvp.phone || null,
      attending: rsvp.attending,
      number_of_guests: rsvp.numberOfGuests,
      message: rsvp.message || null,
      dietary_restrictions: rsvp.dietaryRestrictions || null,
      created_at: now
    };

    const { data, error } = await supabase
      .from('guest_rsvps')
      .insert(newRSVP)
      .select()
      .single();

    if (error) {
      throw new Error(`Error saving RSVP: ${error.message}`);
    }

    return { data: transformRSVP(data), error: null };
  } catch (error: any) {
    console.error('Error in saveGuestRSVP:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Registra una vista de invitación
 */
export async function recordInvitationView(invitationId: string, visitorId: string) {
  const supabase = await createClient();
  try {
    // Verificar si ya existe una vista para este visitante/invitación
    const { data: existingView } = await supabase
      .from('invitation_views')
      .select('*')
      .eq('invitation_id', invitationId)
      .eq('visitor_id', visitorId)
      .single();
    
    if (existingView) {
      // Actualizar la fecha de la vista existente
      const { error } = await supabase
        .from('invitation_views')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', existingView.id);
        
      if (error) throw new Error(`Error updating view: ${error.message}`);
      return { success: true, error: null };
    } else {
      // Crear una nueva vista
      const { error } = await supabase
        .from('invitation_views')
        .insert({
          invitation_id: invitationId,
          visitor_id: visitorId,
          viewed_at: new Date().toISOString()
        });
        
      if (error) throw new Error(`Error recording view: ${error.message}`);
      return { success: true, error: null };
    }
  } catch (error: any) {
    console.error('Error in recordInvitationView:', error);
    return { success: false, error };
  }
}

/**
 * Crea una invitación basada en una plantilla existente
 */
export async function createInvitationFromTemplate(params: {
  templateId: string;
  profileId: string;
  name: string;
  slug: string;
  status?: string;
  customizations?: Record<string, any>;
}) {
  const supabase = await createClient();
  try {
    // 1. Obtener la plantilla
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', params.templateId)
      .single();
      
    if (templateError || !template) {
      throw new Error(`Plantilla no encontrada: ${templateError?.message || 'ID inválido'}`);
    }
    
    // 2. Verificar que el perfil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('id', params.profileId)
      .single();
      
    if (profileError || !profile) {
      throw new Error(`Perfil no encontrado: ${profileError?.message || 'ID inválido'}`);
    }
    
    // 3. Obtener la configuración de la plantilla para copiarla
    let config = template.config || {};
    
    // 4. Aplicar personalizaciones si existen
    if (params.customizations && Object.keys(params.customizations).length > 0) {
      config = {
        ...config,
        ...params.customizations
      };
    }
    
    // 5. Preparar datos para la nueva invitación
    const invitation = {
      user_id: profile.user_id,
      profile_id: params.profileId,
      name: params.name,
      slug: params.slug,
      status: params.status || 'draft',
      template_id: params.templateId,
      config: config,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // 6. Crear la invitación
    const { data, error } = await supabase
      .from('invitations')
      .insert([invitation])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error creando invitación: ${error.message}`);
    }
    
    return { data: transformInvitation(data), error: null };
  } catch (error: any) {
    console.error('Error in createInvitationFromTemplate:', error);
    return { data: null, error };
  }
}

/**
 * Genera pases de invitado para una invitación
 * Cada pase es un código único que un invitado puede usar para acceder
 */
export async function generatePasses(invitationId: string, count: number) {
  const supabase = await createClient();
  try {
    // Verificar que la invitación existe
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('id')
      .eq('id', invitationId)
      .single();
    
    if (invitationError || !invitation) {
      throw new Error(`Invitación no encontrada: ${invitationError?.message || 'ID inválido'}`);
    }
    
    // Generar los pases
    const passes = [];
    for (let i = 0; i < count; i++) {
      passes.push({
        invitation_id: invitationId,
        code: `${uuidv4().substring(0, 8).toUpperCase()}`, // Código corto y único
        status: 'active',
        created_at: new Date().toISOString(),
        used_at: null
      });
    }
    
    // Insertar los pases en la base de datos
    const { data, error } = await supabase
      .from('invitation_passes')
      .insert(passes)
      .select();
    
    if (error) {
      throw new Error(`Error generando pases: ${error.message}`);
    }
    
    // Transformar los datos antes de devolverlos
    return { 
      data: data.map(pass => ({
        id: pass.id,
        code: pass.code,
        status: pass.status,
        createdAt: pass.created_at,
        usedAt: pass.used_at
      })), 
      error: null 
    };
  } catch (error: any) {
    console.error('Error in generatePasses:', error);
    return { data: null, error };
  }
}

// Funciones de transformación para conversión de snake_case a camelCase

function transformInvitation(dbInvitation: any): Invitation {
  if (!dbInvitation) return dbInvitation;

  return {
    id: dbInvitation.id,
    userId: dbInvitation.user_id,
    config: dbInvitation.config,
    status: dbInvitation.status,
    packageType: dbInvitation.package_type,
    createdAt: dbInvitation.created_at,
    updatedAt: dbInvitation.updated_at,
    publishedAt: dbInvitation.published_at,
    publicUrl: dbInvitation.public_url,
    stats: dbInvitation.stats,
    paymentInfo: dbInvitation.payment_info
  };
}

function transformInvitations(dbInvitations: any[]): Invitation[] {
  if (!dbInvitations) return [];
  return dbInvitations.map(transformInvitation);
}

function transformRSVP(dbRSVP: any): GuestRSVP {
  if (!dbRSVP) return dbRSVP;

  return {
    id: dbRSVP.id,
    invitationId: dbRSVP.invitation_id,
    name: dbRSVP.name,
    email: dbRSVP.email,
    phone: dbRSVP.phone,
    attending: dbRSVP.attending,
    numberOfGuests: dbRSVP.number_of_guests,
    message: dbRSVP.message,
    dietaryRestrictions: dbRSVP.dietary_restrictions,
    createdAt: dbRSVP.created_at
  };
}