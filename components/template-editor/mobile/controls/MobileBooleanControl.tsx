"use client";

import React from 'react';

// Tipos
interface MobileBooleanControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

/**
 * Control para propiedades booleanas en móviles
 */
const MobileBooleanControl: React.FC<MobileBooleanControlProps> = ({
  label,
  value,
  onChange
}) => {
  // Manejar cambios en el interruptor
  const handleChange = () => {
    onChange(!value);
  };

  // Create a unique ID for the checkbox using label text
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="property-control">
      <div className="toggle-control">
        <div className="property-label">
          <label htmlFor={id}>{label}</label>
        </div>
        <div className="toggle-switch">
          <input
            id={id}
            type="checkbox"
            checked={value}
            onChange={handleChange}
            aria-label={label}
          />
          <span className="toggle-slider"></span>
        </div>
      </div>
    </div>
  );
};

export default MobileBooleanControl;
