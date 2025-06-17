/**
 * Tipos base para el editor de plantillas
 */

// Enum para los tipos de propiedades
export enum PropertyType {
  STRING = 'text',
  RICH_TEXT = 'richText',
  NUMBER = 'number', 
  BOOLEAN = 'boolean',
  COLOR = 'color',
  IMAGE = 'image',
  FILE = 'file',
  ENUM = 'select',
  FONT = 'font',
  FONT_SELECTOR = 'font_selector',
  DATE = 'date',
  TIME = 'time',
  LOCATION = 'location',
  ARRAY = 'array',
  MUSIC_SELECTOR = 'musicSelector'
}

// Tipos de valores para las propiedades
export type PropertyValue = string | number | boolean | string[] | Date | null | {
  address: string;
  locationUrl?: string;
  buttonText?: string;
};

// Tipos de componentes disponibles
export enum ComponentType {
  HERO = 'hero',
  EVENT_DETAILS = 'eventDetails',
  COUNTDOWN = 'countdown',
  GALLERY = 'gallery',
  ATTENDANCE = 'attendance',
  MUSIC_PLAYER = 'musicPlayer',
  GIFT_OPTIONS = 'giftOptions',
  THANK_YOU = 'thankYou',
  ITINERARY = 'itinerary',
  ACCOMMODATION = 'accommodation',
  INVITATION = 'invitation',
  COUPLE = 'couple'
}

// Tipos básicos para propiedades configurables
export type ConfigPropertyType = 
  | 'text' 
  | 'richText'
  | 'number' 
  | 'boolean' 
  | 'color' 
  | 'image' 
  | 'file' 
  | 'select'
  | 'font'
  | 'font_selector'
  | 'date'
  | 'time'
  | 'location'
  | 'array'
  | 'musicSelector';

// Interfaz base para una propiedad configurable
export interface ComponentProperty {
  type: ConfigPropertyType;
  label: string;
  default?: any;
  required?: boolean;
  description?: string;
  category?: string; // Categoría para agrupar propiedades en la UI
  group?: string;     // Para mantener compatibilidad con el código existente
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  aspectRatio?: number; // Relación de aspecto para imágenes (ancho/alto)
  allowedFormats?: string[]; // Formatos permitidos para imágenes (jpg, png, etc.)
  maxSize?: number; // Tamaño máximo en MB para imágenes
}

export interface TextProperty extends ComponentProperty {
  type: 'text';
  default?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
}

export interface RichTextProperty extends ComponentProperty {
  type: 'richText';
  default?: string;
  toolbarOptions?: string[]; // Por ejemplo: ['bold', 'italic', 'link']
  multiline?: boolean;
}

export interface NumberProperty extends ComponentProperty {
  type: 'number';
  default?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // Por ejemplo: 'px', '%', 'em'
}

export interface BooleanProperty extends ComponentProperty {
  type: 'boolean';
  default?: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export interface ColorProperty extends ComponentProperty {
  type: 'color';
  default?: string; // Formato HEX o rgba
  opacity?: boolean; // Si permite ajustar opacidad
}

export interface ImageProperty extends ComponentProperty {
  type: 'image';
  default?: string;
  aspectRatio?: number;
  maxSize?: number;
  allowedFormats?: string[];
}

export interface FileProperty extends ComponentProperty {
  type: 'file';
  default?: string;
  maxSize?: number; // Tamaño máximo en KB
  allowedFormats?: string[]; // Por ejemplo: ['mp3', 'wav']
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProperty extends ComponentProperty {
  type: 'select';
  options: SelectOption[];
  default?: string;
  multiple?: boolean;
}

export interface FontProperty extends ComponentProperty {
  type: 'font';
  default?: string;
  category?: 'display' | 'serif' | 'sans-serif' | 'handwriting' | 'monospace';
}

export interface FontSelectorProperty extends ComponentProperty {
  type: 'font_selector';
  defaultValue?: string;
  sampleText?: string;
}

export interface DateProperty extends ComponentProperty {
  type: 'date';
  default?: string; // Formato ISO
  minDate?: string;
  maxDate?: string;
}

export interface TimeProperty extends ComponentProperty {
  type: 'time';
  default?: string; // Formato HH:MM
  format?: '12h' | '24h';
}

export interface LocationProperty extends ComponentProperty {
  type: 'location';
  default?: {
    address: string;
    locationUrl?: string;
    buttonText?: string;
  }
}

export interface ArrayProperty extends ComponentProperty {
  type: 'array';
  default?: string[];
  itemType?: ConfigPropertyType;
}

export interface MusicSelectorProperty extends ComponentProperty {
  type: 'musicSelector';
  default?: string;
  label: string;
  description?: string;
  required?: boolean;
  group?: string;
};

// Tipo unión para todas las propiedades posibles
export type ComponentConfigProperty = string | number | boolean | Array<any> | Record<string, any>;

// Configuración de un componente
export interface ComponentConfig {
  id: string;
  type: ComponentType | string;
  order: number;
  visible: boolean;
  properties: Record<string, ComponentConfigProperty>;
  name?: string;           // Nombre amigable del componente
  description?: string;    // Descripción del componente
  icon?: string;           // Icono del componente
}

// Tema de la plantilla
export interface Theme {
  name?: string; // Hacerlo opcional para compatibilidad
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background: string;
    text: string;
    headings?: string;
  };
  fonts?: {
    heading: string;
    body: string;
    accent?: string;
  };
  spacing?: {
    sections: 'compact' | 'normal' | 'spacious';
  };
}

// Configuración completa de la plantilla
export interface TemplateConfig {
  id: string;
  name: string;
  description?: string;
  theme: Theme;
  components: ComponentConfig[];
  category?: string;
  eventType?: string;
}

// Definición de tipos para los hooks y controles del editor
export interface NamedComponentProperty {
  name: string;
  type: string;
  label: string;
  description?: string;
  required?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
  options?: Array<{ label: string; value: any }>;
  [key: string]: any;
}
