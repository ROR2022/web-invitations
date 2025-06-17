"use client";

import React from 'react';

// Tipos
interface MobileDateControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para seleccionar fechas en móviles
 */
const MobileDateControl: React.FC<MobileDateControlProps> = ({
  label,
  value,
  onChange
}) => {
  // Manejar cambios en el input de fecha
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Formato para el input de fecha (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    
    // Si ya está en formato ISO, devolverlo tal cual
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.substring(0, 10); // Solo YYYY-MM-DD
    }
    
    // Intentar parsear otras formas de fecha
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toISOString().substring(0, 10);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="text-control">
        <input
          type="date"
          value={formatDateForInput(value)}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default MobileDateControl;
