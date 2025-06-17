"use client";

import React from 'react';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';
import ResourceSelector from '../../resource-manager/ResourceSelector';

interface ImageControlProps {
  property: NamedComponentProperty;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para propiedades de tipo imagen
 */
const ImageControl: React.FC<ImageControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required, aspectRatio } = property;
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <div className="space-y-2">
        <ResourceSelector 
          value={value || ''}
          onChange={onChange}
          label={label}
          aspectRatio={aspectRatio}
        />
      </div>
    </PropertyWrapper>
  );
};

export default ImageControl;
