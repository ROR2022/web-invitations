"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

interface ColorControlProps {
  property: NamedComponentProperty;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para propiedades de tipo color
 */
const ColorControl: React.FC<ColorControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required } = property;
  const [isOpen, setIsOpen] = useState(false);
  
  // Asegurar que siempre haya un valor de color válido
  const safeColor = value || '#000000';
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <div className="flex space-x-2 items-center">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-10 p-0 flex justify-center items-center border" 
              style={{ backgroundColor: safeColor }}
              aria-label="Seleccionar color"
            >
              <span className="sr-only">Seleccionar color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <div className="flex flex-col gap-2">
              <input 
                type="color" 
                value={safeColor}
                onChange={(e) => onChange(e.target.value)}
                className="w-48 h-48"
              />
              <div className="grid grid-cols-5 gap-1 mt-2">
                {['#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300', 
                  '#DAF7A6', '#FF5733', '#82E0AA', '#3498DB', '#8E44AD']
                  .map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          id={`prop-${name}`}
          type="text"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className="flex-1"
        />
      </div>
    </PropertyWrapper>
  );
};

export default ColorControl;
