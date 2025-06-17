"use client";

import React from 'react';

// Tipos
interface MobileStringControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

/**
 * Control para editar propiedades de tipo texto en móviles
 */
const MobileStringControl: React.FC<MobileStringControlProps> = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = ''
}) => {
  // Manejar cambios en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="text-control">
        {multiline ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default MobileStringControl;
