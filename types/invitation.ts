/**
 * Enumeración para los estados posibles de una invitación
 */
export enum InvitationStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  PUBLISHED = 'published',
  CANCELED = 'canceled',
  ARCHIVED = 'archived'
}

/**
 * Enumeración para los paquetes disponibles
 */
export enum PackageType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  VIP = 'vip'
}

/**
 * Tipos de eventos soportados
 */
export enum EventType {
  WEDDING = 'wedding',
  BAPTISM = 'baptism',
  BIRTHDAY = 'birthday',
  SWEET_FIFTEEN = 'sweet_fifteen',
  GRADUATION = 'graduation',
  CORPORATE = 'corporate',
  OTHER = 'other'
}

/**
 * Representa la configuración básica de una invitación
 */
export interface InvitationConfig {
  title: string;
  eventDate: string;
  eventTime: string;
  location: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
  eventType: EventType;
  hostNames: string[];
  rsvpEnabled: boolean;
  rsvpDeadline?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    backgroundImage?: string;
  };
  components: {
    countdown: boolean;
    map: boolean;
    gallery: boolean;
    music: boolean;
    gifts: boolean;
    itinerary: boolean;
    accommodation: boolean;
  };
  // Propiedades específicas de paquetes premium y vip
  musicUrl?: string;
  galleryImages?: string[];
  giftRegistryUrl?: string;
  accommodationInfo?: string;
  itineraryItems?: Array<{
    time: string;
    description: string;
  }>;
  templateId: string;
  editorConfig?: any; // Configuración personalizada del editor
  
  // Campos específicos según tipo de evento
  coupleNames?: string[]; // Para bodas
  celebrantName?: string; // Para cumpleaños
  celebrantAge?: number; // Edad para cumpleaños o XV años
  honoreeNames?: string[]; // Para graduaciones u otros eventos
  graduateName?: string; // Nombre del graduado
  degree?: string; // Título o grado académico obtenido
  babyName?: string; // Para bautizos
}

/**
 * Modelo principal de una invitación
 */
export interface Invitation {
  id: string;
  userId: string;
  config: InvitationConfig;
  status: InvitationStatus;
  packageType: PackageType;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  publicUrl?: string;
  stats?: InvitationStats;
  paymentInfo?: PaymentInfo;
}

/**
 * Estadísticas relacionadas con la invitación
 */
export interface InvitationStats {
  views: number;
  uniqueVisitors: number;
  confirmations: number;
  declines: number;
  pending: number;
}

/**
 * Información de pago
 */
export interface PaymentInfo {
  paymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentDate?: string;
}

/**
 * Confirmación de asistencia de un invitado
 */
export interface GuestRSVP {
  id: string;
  invitationId: string;
  name: string;
  email?: string;
  phone?: string;
  attending: boolean;
  numberOfGuests: number;
  message?: string;
  dietaryRestrictions?: string;
  createdAt: string;
}

/**
 * Configuración para crear una nueva invitación
 */
export interface CreateInvitationDTO {
  packageType: PackageType;
  eventType: EventType;
  templateId: string;
  initialConfig?: Partial<InvitationConfig>;
} 