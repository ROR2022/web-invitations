import { ComponentProperty } from '../types';

/**
 * Función auxiliar para crear el objeto configurableProperties de manera segura
 * Evita el error "Cannot convert undefined or null to object" que ocurre cuando 
 * se intenta usar Object.keys en un objeto que podría ser null o undefined
 */
export function createConfigurableProperties(
  schema: any | undefined | null
): Record<string, ComponentProperty> {

  //console.warn('Schema:', schema);

  if (!schema) {
    // Reducimos los logs para no saturar la consola
    console.warn('Schema es undefined or null', schema);
    return {};
  }

  //console.warn('Schema properties:', schema.properties);

  try {
    return Object.keys(schema).reduce((acc: Record<string, ComponentProperty>, key: string) => {
      // Usamos type assertion (as) para manejar la incompatibilidad de tipos
      acc[key] = schema[key] as ComponentProperty;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error creando configurableProperties:', error);
    return {};
  }
}
