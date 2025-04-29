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
  DATE = 'date',
  TIME = 'time',
  LOCATION = 'location',
  ARRAY = 'array'
}

// Tipos de valores para las propiedades
export type PropertyValue = string | number | boolean | string[] | Date | null | {
  address: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

// Definición de tipos de componentes disponibles
export type ComponentType = 
  | 'hero'
  | 'countdown'
  | 'eventDetails'
  | 'gallery'
  | 'attendance'
  | 'giftOptions'
  | 'musicPlayer'
  | 'thankYou';

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
  | 'date'
  | 'time'
  | 'location'
  | 'array';

// Interfaz base para una propiedad configurable
export interface ConfigProperty {
  type: ConfigPropertyType;
  label: string;
  default?: any;
  required?: boolean;
  description?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  group?: string; // Grupo para organización en el editor de propiedades
  aspectRatio?: number; // Relación de aspecto para imágenes (ancho/alto)
  allowedFormats?: string[]; // Formatos permitidos para imágenes (jpg, png, etc.)
  maxSize?: number; // Tamaño máximo en MB para imágenes
}

// Propiedades específicas para diferentes tipos
export interface TextProperty extends ConfigProperty {
  type: 'text';
  default?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
}

export interface RichTextProperty extends ConfigProperty {
  type: 'richText';
  default?: string;
  toolbarOptions?: string[]; // Por ejemplo: ['bold', 'italic', 'link']
  multiline?: boolean;
}

export interface NumberProperty extends ConfigProperty {
  type: 'number';
  default?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // Por ejemplo: 'px', '%', 'em'
}

export interface BooleanProperty extends ConfigProperty {
  type: 'boolean';
  default?: boolean;
}

export interface ColorProperty extends ConfigProperty {
  type: 'color';
  default?: string; // Formato HEX o rgba
  opacity?: boolean; // Si permite ajustar opacidad
}

export interface ImageProperty extends ConfigProperty {
  type: 'image';
  default?: string;
  aspectRatio?: number; // Por ejemplo: 16/9, 4/3, 1 (cuadrado)
  maxSize?: number; // Tamaño máximo en KB
  allowedFormats?: string[]; // Por ejemplo: ['jpg', 'png', 'webp']
}

export interface FileProperty extends ConfigProperty {
  type: 'file';
  default?: string;
  maxSize?: number; // Tamaño máximo en KB
  allowedFormats?: string[]; // Por ejemplo: ['mp3', 'wav']
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProperty extends ConfigProperty {
  type: 'select';
  options: SelectOption[];
  default?: string;
  multiple?: boolean;
}

export interface FontProperty extends ConfigProperty {
  type: 'font';
  default?: string;
  category?: 'display' | 'serif' | 'sans-serif' | 'handwriting' | 'monospace';
}

export interface DateProperty extends ConfigProperty {
  type: 'date';
  default?: string; // Formato ISO
  minDate?: string;
  maxDate?: string;
}

export interface TimeProperty extends ConfigProperty {
  type: 'time';
  default?: string; // Formato HH:MM
  format?: '12h' | '24h';
}

export interface LocationProperty extends ConfigProperty {
  type: 'location';
  default?: {
    address: string;
    lat?: number;
    lng?: number;
    placeId?: string;
  }
}

export interface ArrayProperty extends ConfigProperty {
  type: 'array';
  default?: string[];
  itemType?: ConfigPropertyType;
}

// Tipo unión para todas las propiedades posibles
export type ComponentProperty = 
  | TextProperty
  | RichTextProperty
  | NumberProperty
  | BooleanProperty
  | ColorProperty
  | ImageProperty
  | FileProperty
  | SelectProperty
  | FontProperty
  | DateProperty
  | TimeProperty
  | LocationProperty
  | ArrayProperty;

// Interfaz para la configuración de un componente
export interface ComponentConfig {
  id: string;
  type: ComponentType;
  order: number;
  visible: boolean;
  properties: Record<string, any>;
  name?: string;           // Nombre amigable del componente
  description?: string;    // Descripción del componente
  icon?: string;           // Icono del componente
}

// Definición para un tema
export interface Theme {
  name: string;
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

// Interfaz para la configuración completa de una plantilla
export interface TemplateConfig {
  id: string;
  name: string;
  description?: string;
  theme: Theme;
  components: ComponentConfig[];
}
