"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

interface FontControlProps {
  property: NamedComponentProperty;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control simple para propiedades de tipo fuente (entrada de texto)
 */
const FontControl: React.FC<FontControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required } = property;
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Input 
        id={`prop-${name}`}
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full"
      />
    </PropertyWrapper>
  );
};

export default FontControl;
