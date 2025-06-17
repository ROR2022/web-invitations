"use client";

import React from 'react';
import { Settings } from 'lucide-react';
import { NamedComponentProperty } from '../hooks/useComponentProperties';
import { createPropertyControl } from '../utils/control-factory';
import { PROPERTY_GROUPS } from '../utils/property-groups';

interface PropertyCategoryProps {
  category: string;
  properties: NamedComponentProperty[];
  values: Record<string, any>;
  onPropertyChange: (property: string, value: any) => void;
}

/**
 * Componente que renderiza una categoría de propiedades con su título y controles
 */
const PropertyCategory: React.FC<PropertyCategoryProps> = ({
  category,
  properties,
  values,
  onPropertyChange
}) => {
  // Obtener metadatos del grupo si existen
  const groupInfo = PROPERTY_GROUPS[category as keyof typeof PROPERTY_GROUPS] || { 
    icon: Settings,
    description: '' 
  };
  
  const Icon = groupInfo.icon;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b pb-2">
        <Icon size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium">{category}</h3>
      </div>
      
      <div className="space-y-3 pl-1">
        {properties.map((propertyDef) => (
          <div key={propertyDef.name} className="space-y-1">
            {createPropertyControl(
              propertyDef,
              values[propertyDef.name],
              onPropertyChange
            )}
          </div>
        ))}
        
        {properties.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No hay propiedades configurables en esta categoría
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertyCategory;
