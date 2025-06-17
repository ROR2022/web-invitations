"use client";

import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

interface EnumControlProps {
  property: NamedComponentProperty;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para propiedades de tipo enum (selección entre opciones)
 */
const EnumControl: React.FC<EnumControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required, options = [] } = property;
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Select
        value={value || ''}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar opción" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: { value: string, label: string }) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PropertyWrapper>
  );
};

export default EnumControl;
