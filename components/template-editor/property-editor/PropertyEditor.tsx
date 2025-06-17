"use client";

import React from 'react';
import StringControl from './controls/StringControl';
import NumberControl from './controls/NumberControl';
import BooleanControl from './controls/BooleanControl';
import DateControl from './controls/DateControl';
import ArrayControl from './controls/ArrayControl';
import MusicSelectorControl from './controls/MusicSelectorControl';
import { ComponentConfig, ConfigPropertyType } from '../types';

// Schema para propiedades genéricas
export interface PropertySchema {
  type: ConfigPropertyType; // Usamos el tipo definido en types.ts
  label: string;
  description?: string;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  [key: string]: any; // Para propiedades adicionales específicas de cada tipo
}

export interface PropertyEditorProps {
  component: ComponentConfig;
  schema?: Record<string, PropertySchema>;
  onChange: (componentId: string, propertyName: string, value: any) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  schema,
  onChange
}) => {
  // Función para generar un esquema predeterminado basado en las propiedades existentes
  const generateDefaultSchema = () => {
    const defaultSchema: Record<string, PropertySchema> = {};
    
    Object.entries(component.properties).forEach(([key, value]) => {
      let type: ConfigPropertyType = 'text'; // Valor por defecto
      
      if (Array.isArray(value)) {
        type = 'array';
      } else if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (typeof value === 'string') {
        // Intentar determinar si es una fecha
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          type = 'date';
        } else {
          type = 'text';
        }
      }
      
      defaultSchema[key] = {
        type: type,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        description: `Propiedad ${key}`,
        required: false
      };
    });
    
    return defaultSchema;
  };
  
  // Usar esquema proporcionado o generar uno predeterminado
  const propertySchema = schema || generateDefaultSchema();
  
  // Renderizar el control apropiado según el tipo de propiedad
  const renderPropertyControl = (propertyName: string, schema: PropertySchema) => {
    const value = component.properties[propertyName];
    
    // Creamos un objeto base de propiedades que se usa en todos los controles
    const basePropertyProps = {
      name: propertyName,
      label: schema.label,
      description: schema.description,
      required: schema.required
    };
    
    switch (schema.type) {
      case 'text':
      case 'richText':
        return (
          <StringControl
            key={propertyName}
            property={{
              ...basePropertyProps,
              type: schema.type
            } as any}
            value={value as string}
            onChange={(newValue) => onChange(component.id, propertyName, newValue)}
          />
        );
        
      case 'number':
        return (
          <NumberControl
            key={propertyName}
            property={{
              ...basePropertyProps,
              type: schema.type
            } as any}
            value={value as number}
            onChange={(newValue) => onChange(component.id, propertyName, newValue)}
          />
        );
        
      case 'boolean':
        return (
          <BooleanControl
            key={propertyName}
            property={{
              ...basePropertyProps,
              type: schema.type
            } as any}
            value={value as boolean}
            onChange={(newValue) => onChange(component.id, propertyName, newValue)}
          />
        );
        
      case 'date':
        return (
          <DateControl
            key={propertyName}
            property={{
              ...basePropertyProps,
              type: schema.type
            } as any}
            value={value as string}
            onChange={(newValue) => onChange(component.id, propertyName, newValue)}
          />
        );
        
      case 'array':
        return (
          <ArrayControl
            key={propertyName}
            property={{
              ...basePropertyProps,
              type: schema.type,
              itemType: schema.itemType
            } as any}
            value={value as any[]}
            onChange={(newValue) => onChange(component.id, propertyName, newValue)}
          />
        );
        
      case 'musicSelector':
        return (
          <MusicSelectorControl
            key={propertyName}
            property={{
              ...basePropertyProps,
              type: schema.type
            } as any}
            value={value as string}
            onChange={(newValue) => onChange(component.id, propertyName, newValue)}
          />
        );
        
      default:
        return (
          <div key={propertyName} className="text-sm text-muted-foreground p-2 border rounded-md">
            Tipo de propiedad no soportado: {schema.type}
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {Object.entries(propertySchema).map(([propertyName, schema]) => 
        renderPropertyControl(propertyName, schema)
      )}
    </div>
  );
};

export default PropertyEditor;
