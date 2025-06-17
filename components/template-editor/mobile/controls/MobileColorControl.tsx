"use client";

import React from 'react';

// Tipos
interface MobileColorControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para seleccionar colores en móviles
 */
const MobileColorControl: React.FC<MobileColorControlProps> = ({
  label,
  value,
  onChange
}) => {
  // Manejar cambios en el input de color
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="color-control">
        <div 
          className="color-preview"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={handleChange}
          className="w-full h-10"
        />
      </div>
    </div>
  );
};

export default MobileColorControl;
