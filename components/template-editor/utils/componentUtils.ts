import { ComponentProperty } from '../types';

// Nombres amigables para los tipos de componentes
export const componentTypeNames: Record<string, string> = {
  hero: "Portada",
  countdown: "Cuenta Regresiva",
  eventDetails: "Detalles del Evento",
  gallery: "Galería",
  attendance: "Asistencia",
  giftOptions: "Mesa de Regalos",
  musicPlayer: "Reproductor de Música",
  thankYou: "Agradecimiento",
  invitation: "Invitación Formal",
  couple: "Nosotros",
};

// Los iconos se definen en cada componente que los usa, no aquí
// ya que utilizar JSX en un archivo .ts causaría errores

/**
 * Función auxiliar para crear el objeto configurableProperties de manera segura
 * Evita el error "Cannot convert undefined or null to object" que ocurre cuando 
 * se intenta usar Object.keys en un objeto que podría ser null o undefined
 */
export function createConfigurableProperties(
  schema: any | undefined | null
): Record<string, ComponentProperty> {

  if (!schema) {
    console.warn('Schema es undefined or null', schema);
    return {};
  }

  try {
    const result = Object.keys(schema).reduce((acc: Record<string, ComponentProperty>, key: string) => {
      // Usamos type assertion (as) para manejar la incompatibilidad de tipos
      acc[key] = schema[key] as ComponentProperty;
      return acc;
    }, {});
    
    return result;
  } catch (error) {
    console.error('Error creando configurableProperties:', error);
    return {};
  }
}
