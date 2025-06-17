"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

// Extender la interfaz para incluir propiedades específicas del control booleano
interface BooleanProperty extends NamedComponentProperty {
  trueLabel?: string;
  falseLabel?: string;
}

interface BooleanControlProps {
  property: BooleanProperty;
  value: boolean;
  onChange: (value: boolean) => void;
}

/**
 * Control para propiedades de tipo booleano
 */
const BooleanControl: React.FC<BooleanControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required, trueLabel, falseLabel } = property;
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">
            {value ? (trueLabel || 'Activado') : (falseLabel || 'Desactivado')}
          </span>
        </div>
        <Switch
          id={`prop-${name}`}
          checked={!!value}
          onCheckedChange={onChange}
        />
      </div>
    </PropertyWrapper>
  );
};

export default BooleanControl;
