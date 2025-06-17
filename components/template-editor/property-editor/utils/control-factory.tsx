"use client";

import React from 'react';
import { PropertyType } from '../../types';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

// Importar controles
import StringControl from '../controls/StringControl';
import NumberControl from '../controls/NumberControl';
import BooleanControl from '../controls/BooleanControl';
import ColorControl from '../controls/ColorControl';
import DateControl from '../controls/DateControl';
import EnumControl from '../controls/EnumControl';
import ImageControl from '../controls/ImageControl';
import FontControl from '../controls/FontControl';
import FontSelectorControl from '../controls/FontSelectorControl';
import MusicSelectorControl from '../controls/MusicSelectorControl';
import LocationControl from '../controls/LocationControl';
import ArrayControl from '../controls/ArrayControl';

/**
 * Factory para crear un control basado en el tipo de propiedad
 */
export function createPropertyControl(
  propertyDef: NamedComponentProperty,
  value: any,
  onChange: (property: string, value: any) => void
) {
  // Props comunes para todos los controles
  const commonProps = {
    property: propertyDef,
    value: value,
    onChange: (newValue: any) => onChange(propertyDef.name, newValue)
  };

  // Crear el control específico según el tipo de propiedad
  switch (propertyDef.type) {
    case PropertyType.STRING:
      return <StringControl {...commonProps} />;
      
    case PropertyType.NUMBER:
      return <NumberControl {...commonProps} />;
      
    case PropertyType.BOOLEAN:
      return <BooleanControl {...commonProps} />;
      
    case PropertyType.COLOR:
      return <ColorControl {...commonProps} />;
      
    case PropertyType.DATE:
      return <DateControl {...commonProps} />;
      
    case PropertyType.ENUM:
      return <EnumControl {...commonProps} />;
      
    case PropertyType.IMAGE:
      return <ImageControl {...commonProps} />;
      
    case PropertyType.FONT:
      return <FontControl {...commonProps} />;
      
    case PropertyType.FONT_SELECTOR:
      return <FontSelectorControl {...commonProps} />;
      
    case PropertyType.MUSIC_SELECTOR:
      return <MusicSelectorControl {...commonProps} />;
      
    case PropertyType.LOCATION:
      return <LocationControl {...commonProps} />;
      
    case PropertyType.ARRAY:
      return <ArrayControl {...commonProps} />;
      
    default:
      return (
        <div className="text-sm text-gray-500 p-2 bg-gray-100 rounded">
          Editor no disponible para el tipo: {propertyDef.type}
        </div>
      );
  }
}
