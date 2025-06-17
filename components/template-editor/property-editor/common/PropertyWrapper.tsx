"use client";

import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PropertyWrapperProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Componente contenedor para propiedades que añade etiqueta y descripción
 */
const PropertyWrapper: React.FC<PropertyWrapperProps> = ({
  name,
  label,
  description,
  required,
  children
}) => {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-1">
        <label htmlFor={`prop-${name}`} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs text-xs">
                {description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div>
        {children}
      </div>
    </div>
  );
};

export default PropertyWrapper;
