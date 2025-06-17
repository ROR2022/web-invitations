import { Invitation } from "@/types/invitation";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Valida que todos los campos requeridos estén completos antes de publicar
 * @param invitation Invitación a validar
 * @returns Array de errores de validación, vacío si no hay errores
 */
export function validateInvitationForPublishing(invitation: Invitation): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validar título
  if (!invitation.config.title?.trim()) {
    errors.push({
      field: 'title',
      message: 'El título de la invitación es obligatorio'
    });
  }
  
  // Validar fecha del evento
  if (!invitation.config.eventDate?.trim()) {
    errors.push({
      field: 'eventDate',
      message: 'La fecha del evento es obligatoria'
    });
  }
  
  // Validar hora del evento
  if (!invitation.config.eventTime?.trim()) {
    errors.push({
      field: 'eventTime',
      message: 'La hora del evento es obligatoria'
    });
  }
  
  // Validar ubicación
  if (!invitation.config.location?.trim()) {
    errors.push({
      field: 'location',
      message: 'La ubicación del evento es obligatoria'
    });
  }
  
  // Validar nombre(s) de anfitrión(es)
  if (!invitation.config.hostNames || invitation.config.hostNames.length === 0) {
    errors.push({
      field: 'hostNames',
      message: 'Debe especificar al menos un anfitrión'
    });
  }
  
  // Validar componentes activos según el tipo de evento
  validateEventSpecificFields(invitation, errors);
  
  return errors;
}

/**
 * Valida campos específicos según el tipo de evento
 */
function validateEventSpecificFields(invitation: Invitation, errors: ValidationError[]): void {
  switch (invitation.config.eventType) {
    case 'wedding':
      // Campos específicos para bodas
      if (!invitation.config.coupleNames || invitation.config.coupleNames.length < 2) {
        errors.push({
          field: 'coupleNames',
          message: 'Debe especificar ambos nombres de la pareja'
        });
      }
      break;
    
    case 'birthday':
      // Campos específicos para cumpleaños
      if (!invitation.config.celebrantName?.trim()) {
        errors.push({
          field: 'celebrantName',
          message: 'El nombre del homenajeado es obligatorio'
        });
      }
      
      if (!invitation.config.celebrantAge) {
        errors.push({
          field: 'celebrantAge',
          message: 'La edad del homenajeado es obligatoria'
        });
      }
      break;
      
    case 'baptism':
      // Campos específicos para bautizos
      if (!invitation.config.babyName?.trim()) {
        errors.push({
          field: 'babyName',
          message: 'El nombre del bebé es obligatorio'
        });
      }
      break;
      
    case 'graduation':
      // Campos específicos para graduaciones
      if (!invitation.config.graduateName?.trim()) {
        errors.push({
          field: 'graduateName',
          message: 'El nombre del graduado es obligatorio'
        });
      }
      
      if (!invitation.config.degree?.trim()) {
        errors.push({
          field: 'degree',
          message: 'El título o grado obtenido es obligatorio'
        });
      }
      break;
  }
}

/**
 * Genera un slug amigable para la URL pública
 */
export function generatePublicSlug(invitation: Invitation): string {
  // Base del slug según el tipo de evento
  let baseSlug = '';
  
  switch (invitation.config.eventType) {
    case 'wedding':
      baseSlug = 'boda';
      
      // Intentar usar nombres de la pareja
      if (invitation.config.coupleNames && invitation.config.coupleNames.length >= 2) {
        const names = invitation.config.coupleNames.map(name => 
          name.split(' ')[0].toLowerCase()
        );
        baseSlug += `-${names[0]}-y-${names[1]}`;
      }
      break;
      
    case 'birthday':
      baseSlug = 'cumpleanos';
      
      // Intentar usar nombre del homenajeado
      if (invitation.config.celebrantName) {
        baseSlug += `-de-${invitation.config.celebrantName.split(' ')[0].toLowerCase()}`;
      }
      break;
      
    case 'baptism':
      baseSlug = 'bautizo';
      
      // Intentar usar nombre del bebé
      if (invitation.config.babyName) {
        baseSlug += `-de-${invitation.config.babyName.split(' ')[0].toLowerCase()}`;
      }
      break;
      
    case 'graduation':
      baseSlug = 'graduacion';
      
      // Intentar usar nombre del graduado
      if (invitation.config.graduateName) {
        baseSlug += `-de-${invitation.config.graduateName.split(' ')[0].toLowerCase()}`;
      }
      break;
      
    default:
      baseSlug = 'invitacion';
      
      // Usar título general
      if (invitation.config.title) {
        baseSlug += `-${invitation.config.title.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`;
      }
  }
  
  // Añadir fecha para hacer el slug más único
  if (invitation.config.eventDate) {
    try {
      const date = new Date(invitation.config.eventDate);
      baseSlug += `-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    } catch (e) {
      // Usar un sufijo aleatorio si la fecha no es válida
      baseSlug += `-${Date.now().toString().substring(8, 13)}`;
    }
  } else {
    // Usar un sufijo aleatorio si no hay fecha
    baseSlug += `-${Date.now().toString().substring(8, 13)}`;
  }
  
  // Limpiar el slug de caracteres especiales y acentos
  return baseSlug
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9-]/g, '-')     // Convertir no alfanuméricos a guiones
    .replace(/-+/g, '-')             // Combinar guiones adyacentes
    .replace(/^-|-$/g, '');          // Remover guiones al inicio y fin
} 