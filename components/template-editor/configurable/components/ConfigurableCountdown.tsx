"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComponentProperty } from '../../types';
import { countdownSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente Countdown configurable para el editor de plantillas
 * Muestra una cuenta regresiva hacia la fecha del evento
 */

// Definir el tipo de propiedades basado en el esquema
export type CountdownProps = {
  // Propiedades configurables
  eventDate: string;
  eventTime: string;
  title: string;
  showLabels: boolean;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  style: 'simple' | 'boxes' | 'circles' | 'flip';
  animation: boolean;
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

// Interfaz para el tiempo restante
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ConfigurableCountdown: React.FC<CountdownProps> = ({
  eventDate,
  eventTime,
  title,
  showLabels,
  backgroundColor,
  textColor,
  accentColor,
  style,
  animation,
  isEditing = false,
  onPropertyChange
}) => {
  // Estado para el tiempo restante
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Estado para controlar cuando el tiempo ha expirado
  const [isExpired, setIsExpired] = useState(false);
  
  // Calcular el tiempo restante
  useEffect(() => {
    // Si estamos en modo edición, mostrar un tiempo fijo
    if (isEditing) {
      setTimeLeft({
        days: 45,
        hours: 12,
        minutes: 30,
        seconds: 15
      });
      return;
    }
    
    // Crear fecha objetivo combinando fecha y hora
    const targetDateTime = new Date(`${eventDate}T${eventTime || '00:00:00'}`);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDateTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    
    // Actualizar el tiempo restante cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Establecer el tiempo inicial
    setTimeLeft(calculateTimeLeft());
    
    // Limpiar intervalo
    return () => clearInterval(timer);
  }, [eventDate, eventTime, isEditing]);
  
  // Determinar clases para el estilo de los números
  const getTimeUnitClasses = () => {
    switch (style) {
      case 'boxes':
        return 'bg-opacity-10 rounded-lg p-4 flex flex-col items-center min-w-[80px]';
      case 'circles':
        return 'rounded-full p-4 flex flex-col items-center justify-center min-w-[80px] aspect-square';
      case 'flip':
        return 'relative overflow-hidden rounded-lg p-4 flex flex-col items-center min-w-[80px]';
      default:
        return 'p-4 flex flex-col items-center min-w-[70px]';
    }
  };
  
  // Función para renderizar cada unidad de tiempo (días, horas, etc.)
  const renderTimeUnit = (value: number, label: string) => {
    const timeUnitClasses = getTimeUnitClasses();
    const bgStyle = style === 'simple' ? {} : { backgroundColor: `${accentColor}20` };
    
    return (
      <div 
        className={`${timeUnitClasses} ${animation ? 'transition-all duration-300' : ''}`}
        style={bgStyle}
      >
        <div 
          className={`text-3xl md:text-4xl font-bold ${style === 'flip' ? 'flip-number' : ''}`}
          style={{ color: accentColor }}
        >
          {value.toString().padStart(2, '0')}
        </div>
        {showLabels && (
          <div className="text-sm mt-1" style={{ color: textColor }}>
            {label}
          </div>
        )}
      </div>
    );
  };

  return (
    <section 
      className={`py-16 md:py-24 w-full ${isEditing ? 'editing-mode' : ''}`}
      style={{ backgroundColor }}
      data-component-type="countdown"
      id="countdown-section"
    >
      <motion.div 
        className="container mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {!isExpired ? (
          <>
            <h2 
              className="text-3xl md:text-4xl font-medium mb-10"
              style={{ color: textColor }}
            >
              {title}
            </h2>
            
            <div className="flex justify-center space-x-4 md:space-x-6">
              {renderTimeUnit(timeLeft.days, 'Días')}
              {renderTimeUnit(timeLeft.hours, 'Horas')}
              {renderTimeUnit(timeLeft.minutes, 'Minutos')}
              {renderTimeUnit(timeLeft.seconds, 'Segundos')}
            </div>
          </>
        ) : (
          <h2 
            className="text-3xl md:text-4xl font-medium mb-10"
            style={{ color: textColor }}
          >
            ¡El evento ha comenzado!
          </h2>
        )}
      </motion.div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Countdown Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(countdownSchema);

export default ConfigurableCountdown;
