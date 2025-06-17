"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface PropertyLabelProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

/**
 * Componente que renderiza la etiqueta de una propiedad con su descripción opcional
 */
const PropertyLabel: React.FC<PropertyLabelProps> = ({
  name,
  label,
  description,
  required
}) => {
  return (
    <Label htmlFor={`prop-${name}`} className="text-sm font-medium flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      
      {description && (
        <span className="ml-1 text-muted-foreground">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-4 w-4 p-0 hover:bg-transparent">
                <HelpCircle size={12} className="text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 text-sm" side="right">
              {description}
            </PopoverContent>
          </Popover>
        </span>
      )}
    </Label>
  );
};

export default PropertyLabel;
