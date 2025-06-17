import { Settings, Layout, Text, Image } from 'lucide-react';

// Sistema de grupos con metadatos
export const PROPERTY_GROUPS = {
  'Básicas': {
    icon: Settings,
    priority: 1,
    description: 'Configuración general del componente'
  },
  'Apariencia': {
    icon: Layout, 
    priority: 2,
    description: 'Personalización visual'
  },
  'Contenido': {
    icon: Text,
    priority: 3,
    description: 'Texto e imágenes'
  },
  'Avanzadas': {
    icon: Image,
    priority: 4,
    description: 'Opciones adicionales'
  }
};

// Tipos específicos para contexto de invitaciones digitales
export const EVENT_TYPE_OPTIONS = [
  { value: 'wedding', label: 'Boda' },
  { value: 'xv', label: 'XV años' },
  { value: 'baptism', label: 'Bautizo' },
  { value: 'corporate', label: 'Evento Corporativo' }
];

// Paletas de colores predefinidas por tipo de evento
export const EVENT_COLOR_PALETTES = {
  wedding: {
    name: 'Romántica',
    primary: '#D8B4E2',
    secondary: '#9D65C9', 
    accent: '#5D54A4',
    background: '#F9F7FC',
    text: '#2A2A2A'
  },
  xv: {
    name: 'Elegante',
    primary: '#F6C6EA',
    secondary: '#C490D1', 
    accent: '#ACACDE',
    background: '#FCFAFC',
    text: '#2A2A2A'
  },
  baptism: {
    name: 'Tierna',
    primary: '#A5E1AD',
    secondary: '#75C2F6', 
    accent: '#5499C7',
    background: '#F7FBFA',
    text: '#2A2A2A'
  },
  corporate: {
    name: 'Profesional',
    primary: '#7FB3D5',
    secondary: '#5499C7', 
    accent: '#2874A6',
    background: '#F5F9FC',
    text: '#2A2A2A'
  }
};
