"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

interface StringControlProps {
  property: NamedComponentProperty;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para propiedades de tipo texto
 */
const StringControl: React.FC<StringControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required } = property;
  const multiline = (property as any).multiline;
  const minLength = (property as any).minLength;
  const maxLength = (property as any).maxLength;
  
  // Si es multilinea, usar textarea
  if (multiline) {
    return (
      <PropertyWrapper
        name={name}
        label={label}
        description={description}
        required={required}
      >
        <Textarea
          id={`prop-${name}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className="w-full resize-y min-h-[100px]"
          minLength={minLength}
          maxLength={maxLength}
        />
      </PropertyWrapper>
    );
  }
  
  // Si no es multilinea, usar input normal
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
        minLength={minLength}
        maxLength={maxLength}
      />
    </PropertyWrapper>
  );
};

export default StringControl;
