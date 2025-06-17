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

// Función utilitaria para obtener la fecha predeterminada (34 días en el futuro)
const getDefaultEventDate = (): string => {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 34);
  const result = defaultDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  console.log('getDefaultEventDate() called in ConfigurableCountdown, returning:', result);
  return result;
};

// Función para parsear fechas en diferentes formatos
const parseEventDate = (dateString: string): Date => {
  // Si no hay fecha o está vacía, usar fecha predeterminada (34 días en el futuro)
  if (!dateString || dateString.trim() === '') {
    return new Date(getDefaultEventDate());
  }
  
  try {
    let date: Date;
    
    // Verificar formato ISO (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      date = new Date(dateString);
    }
    // Verificar formato con barras invertidas o puntos (DD/MM/YYYY o DD.MM.YYYY)
    else if (/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/.test(dateString)) {
      const parts = dateString.split(/[\/.-]/);
      // Asumimos formato DD/MM/YYYY (formato europeo/latino)
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    // Verificar formatos en español con texto (Sábado 04 de mayo de 2025)
    else if (/(\d{1,2})\s+de\s+([a-záéíóúü]+)(?:\s*,?\s*|\s+de\s+)(\d{4})/i.test(dateString)) {
      const meses: Record<string, number> = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
        'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
      };
      
      // Extraer números y mes del texto
      const match = dateString.match(/(\d{1,2})\s+de\s+([a-záéíóúü]+)(?:\s*,?\s*|\s+de\s+)(\d{4})/i);
      if (match) {
        const dia = parseInt(match[1]);
        const mes = match[2].toLowerCase();
        const año = parseInt(match[3]);
        
        // Verificar si el mes está en nuestro diccionario
        if (mes in meses) {
          date = new Date(año, meses[mes as keyof typeof meses], dia);
        } else {
          // Si no reconocemos el mes, intentamos con el constructor estándar
          date = new Date(dateString);
        }
      } else {
        // Fallback al constructor estándar
        date = new Date(dateString);
      }
    }
    // Intento final con el constructor de Date
    else {
      date = new Date(dateString);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }
    
    return date;
  } catch (error) {
    console.error('Error parseando fecha:', error);
    return new Date(getDefaultEventDate()); // Fecha predeterminada como fallback
  }
};

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
  // Debug: Imprimir los props que llegan al componente
  console.log('ConfigurableCountdown props received:', { 
    eventDate, 
    isEditing,
    defaultDate: getDefaultEventDate() 
  });
  
  // Estado para el tiempo restante
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Estado para controlar cuando el tiempo ha expirado
  const [isExpired, setIsExpired] = useState(false);
  
  // FORZAR VALOR DE 34 DÍAS SI ES UNA FECHA ACTUAL (recién creado) o está vacío
  useEffect(() => {
    if (onPropertyChange && 
        (!eventDate || 
         eventDate === new Date().toISOString().split('T')[0] ||
         eventDate === new Date(Date.now()).toISOString().split('T')[0])) {
      console.log('Forzando cambio a fecha predeterminada de 34 días:', getDefaultEventDate());
      onPropertyChange('eventDate', getDefaultEventDate());
    }
  }, [eventDate, onPropertyChange]);
  
  // Calcular el tiempo restante
  useEffect(() => {
    // Si estamos en modo edición, mostrar un tiempo fijo
    if (isEditing) {
      setTimeLeft({
        days: 34, // Cambiado para mantener consistencia con el valor predeterminado
        hours: 12,
        minutes: 30,
        seconds: 15
      });
      return;
    }
    
    // Usar fecha predeterminada si no hay eventDate
    const dateToUse = eventDate || getDefaultEventDate();
    console.log('Date being used:', { 
      eventDate, 
      dateToUse, 
      isEmpty: !eventDate || eventDate.trim() === '',
      defaultGenerated: getDefaultEventDate() 
    });
    
    // Crear fecha objetivo parseando la fecha y agregando la hora
    const parsedEventDate = parseEventDate(dateToUse);
    
    // Si tenemos una hora, la añadimos a la fecha
    if (eventTime) {
      const [hours, minutes, seconds] = (eventTime || '00:00:00').split(':').map(Number);
      parsedEventDate.setHours(hours || 0);
      parsedEventDate.setMinutes(minutes || 0);
      parsedEventDate.setSeconds(seconds || 0);
    }
    
    // Usar la fecha parseada como objetivo
    const targetDateTime = parsedEventDate;
    
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
