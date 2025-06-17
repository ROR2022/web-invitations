"use client";

import React from 'react';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';
import FontSelector from '../../resource-manager/FontSelector';

// Extender el tipo para incluir propiedades específicas de selección de fuentes
interface FontSelectorControlProps {
  property: NamedComponentProperty & { sampleText?: string };
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para seleccionar fuentes de Google Fonts con previsualización
 */
const FontSelectorControl: React.FC<FontSelectorControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required, sampleText } = property;
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <FontSelector
        value={value}
        onChange={onChange}
        sampleText={sampleText || "Texto de muestra"}
      />
    </PropertyWrapper>
  );
};

export default FontSelectorControl;
