"use client";

import React from 'react';

// Tipos
interface MobileTimeControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  format?: '12h' | '24h';  // Formato de hora (12h o 24h)
}

/**
 * Control para seleccionar hora en dispositivos móviles
 */
const MobileTimeControl: React.FC<MobileTimeControlProps> = ({
  label,
  value,
  onChange,
  format = '24h'
}) => {
  // Manejar cambios en el input de hora
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Formatear la hora para el input time
  const formatTimeForInput = (timeString: string) => {
    if (!timeString) return '';
    
    // Si ya está en formato HH:MM, devolverlo tal cual
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
      return timeString.substring(0, 5); // Solo HH:MM
    }
    
    // Intentar parsear otras formas de hora
    try {
      // Crear una fecha temporal para parsear la hora
      const today = new Date();
      const date = new Date(`${today.toISOString().split('T')[0]}T${timeString}`);
      
      if (isNaN(date.getTime())) return '';
      
      return date.toTimeString().substring(0, 5); // HH:MM
    } catch (e) {
      return '';
    }
  };

  // Convertir entre formato 24h y 12h para mostrar al usuario (solo para UI)
  const getDisplayTime = (timeString: string): string => {
    if (!timeString) return '';
    
    if (format === '12h') {
      try {
        const timeParts = timeString.split(':');
        let hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 debería ser 12 en formato 12h
        
        return `${hours}:${minutes} ${ampm}`;
      } catch (e) {
        return timeString;
      }
    }
    
    return timeString;
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="time-control">
        <input
          type="time"
          value={formatTimeForInput(value)}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {value && format === '12h' && (
          <div className="mt-1 text-xs text-gray-500">
            {getDisplayTime(value)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTimeControl;
