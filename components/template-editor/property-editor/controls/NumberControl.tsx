"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

interface NumberControlProps {
  property: NamedComponentProperty;
  value: number;
  onChange: (value: number) => void;
}

/**
 * Control para propiedades de tipo número
 */
const NumberControl: React.FC<NumberControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required, min, max, step } = property;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    onChange(newValue as number);
  };
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <div className="flex items-center space-x-2">
        <Input
          id={`prop-${name}`}
          type="number"
          value={value === undefined ? '' : value}
          onChange={handleChange}
          placeholder={label}
          className="w-full"
          min={min}
          max={max}
          step={step || 1}
        />
        
        {/* Mostrar unidad si existe */}
        {(property as any).unit && (
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {(property as any).unit}
          </span>
        )}
      </div>
    </PropertyWrapper>
  );
};

export default NumberControl;
