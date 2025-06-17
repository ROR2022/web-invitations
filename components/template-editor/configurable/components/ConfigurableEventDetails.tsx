"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Info } from 'lucide-react';
import { ComponentProperty } from '../../types';
import { eventDetailsSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente EventDetails configurable para el editor de plantillas
 * Muestra información sobre el lugar, fecha y hora del evento
 */

// Definir el tipo de propiedades basado en el esquema
export type EventDetailsProps = {
  // Propiedades de la ceremonia
  ceremonyTitle: string;
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocation: {
    address: string;
    locationUrl?: string;
    buttonText?: string;
  };
  ceremonyDetails: string;
  
  // Propiedades de la recepción
  receptionTitle: string;
  receptionDate: string;
  receptionTime: string;
  receptionLocation: {
    address: string;
    locationUrl?: string;
    buttonText?: string;
  };
  receptionDetails: string;
  
  // Propiedades de fuentes
  sectionTitleFont: string;
  eventTitleFont: string;
  detailsFont: string;
  
  // Propiedades de estilo
  backgroundColor: string;
  useTexture: boolean;
  texturePattern: string;
  textureOpacity: number;
  textColor: string;
  iconColor: string;
  buttonColor: string;
  buttonTextColor: string;
  dressCode: string;
  dressCodeDetails: string;
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

// Función centralizada para obtener la familia de fuentes
const getFontFamily = (fontName: string | undefined, defaultFont: string = 'serif') => {
  // Usar un valor predeterminado si la fuente es undefined
  const fontToUse = fontName || defaultFont;
  
  switch (fontToUse) {
    case 'Great Vibes':
      return 'var(--font-great-vibes)';
    case 'Playfair Display':
      return 'var(--font-playfair)';
    case 'Montserrat':
      return 'var(--font-montserrat)';
    case 'Roboto':
      return 'var(--font-roboto)';
    case 'Lora':
      return 'var(--font-lora)';
    case 'Dancing Script':
      return 'var(--font-dancing-script)';
    case 'Pacifico':
      return 'var(--font-pacifico)';
    case 'Open Sans':
      return 'var(--font-open-sans)';
    case 'Oswald':
      return 'var(--font-oswald)';
    case 'Merriweather':
      return 'var(--font-merriweather)';
    default:
      return fontToUse;
  }
};

// Función auxiliar para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return '';

  //console.warn('formateando string fecha:', dateString);
  //console.warn('tipo de fecha:', typeof dateString);
  
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
    
    //console.warn('fecha formateada a objeto:', date);
    
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString; // Devolver el string original si hay error
  }
};

// Función auxiliar para formatear horas
const formatTime = (timeString: string) => {
  if (!timeString) return '';
  
  try {
    // Convertir formato 24h a formato 12h
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  } catch (error) {
    return timeString;
  }
};

const ConfigurableEventDetails: React.FC<EventDetailsProps> = ({
  ceremonyTitle,
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyDetails,
  receptionTitle,
  receptionDate,
  receptionTime,
  receptionLocation,
  receptionDetails,
  sectionTitleFont,
  eventTitleFont,
  detailsFont,
  backgroundColor,
  useTexture,
  texturePattern,
  textureOpacity,
  textColor,
  iconColor,
  buttonColor,
  buttonTextColor,
  dressCode,
  dressCodeDetails,
  isEditing = false,
  onPropertyChange
}) => {
  // Determinar si mostrar ceremonia y/o recepción
  const showCeremony = ceremonyTitle && (ceremonyDate || ceremonyTime || ceremonyLocation?.address);
  const showReception = receptionTitle && (receptionDate || receptionTime || receptionLocation?.address);

  // Debug the texture settings
  useEffect(() => {
    if (useTexture) {
      console.log('Texture is enabled in EventDetails');
      console.log('Texture pattern URL:', texturePattern);
      console.log('Texture opacity:', textureOpacity);
    }
  }, [useTexture, texturePattern, textureOpacity]);

  // Estilos para las fuentes
  const sectionTitleStyle = {
    fontFamily: getFontFamily(sectionTitleFont, 'serif'),
    color: textColor
  };
  
  const eventTitleStyle = {
    fontFamily: getFontFamily(eventTitleFont, 'serif'),
    color: textColor
  };
  
  const detailsTextStyle = {
    fontFamily: getFontFamily(detailsFont, 'sans-serif'),
    color: textColor
  };

  // Estilos para los botones de ubicación
  const buttonStyle = {
    backgroundColor: buttonColor || '#4F46E5',
    color: buttonTextColor || '#ffffff'
  };

  // Estilo de la sección con posición relativa para el fondo de textura
  const sectionStyle = {
    backgroundColor,
    position: 'relative' as const
  };

  return (
    <section 
      className={`py-16 md:py-24 w-full relative ${isEditing ? 'editing-mode' : ''}`}
      style={sectionStyle}
      data-component-type="eventDetails"
      id="event-details-section"
    >
      {/* Direct texture background div */}
      {useTexture && texturePattern && (
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `url(${texturePattern})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            opacity: textureOpacity,
            zIndex: 1
          }}
        ></div>
      )}
      
      <motion.div 
        className="container mx-auto px-4 max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-medium mb-4"
            style={sectionTitleStyle}
          >
            Detalles del Evento
          </h2>
          
          {dressCode && (
            <div 
              className="inline-block border px-4 py-2 rounded-full mt-4"
              style={{ borderColor: iconColor, ...detailsTextStyle }}
            >
              <span className="font-medium">Código de vestimenta:</span> {dressCode}
            </div>
          )}
          
          {dressCodeDetails && (
            <div 
              className="max-w-xl mx-auto mt-2 text-sm"
              style={detailsTextStyle}
            >
              {dressCodeDetails}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-5">
          {/* Ceremonia */}
          {showCeremony && (
            <motion.div 
              className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 
                className="text-2xl font-medium mb-6 text-center"
                style={eventTitleStyle}
              >
                {ceremonyTitle}
              </h3>
              
              <div className="space-y-4">
                {ceremonyDate && (
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      <strong>Fecha:</strong> {formatDate(ceremonyDate)}
                    </div>
                  </div>
                )}
                
                {ceremonyTime && (
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      <strong>Hora:</strong> {formatTime(ceremonyTime)}
                    </div>
                  </div>
                )}
                
                {ceremonyLocation?.address && (
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      <strong>Lugar:</strong> {ceremonyLocation.address}
                    </div>
                  </div>
                )}
                
                {ceremonyDetails && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      {ceremonyDetails}
                    </div>
                  </div>
                )}
              </div>
              
              {ceremonyLocation?.locationUrl && (
                <div className="mt-6 text-center">
                  <a 
                    href={ceremonyLocation.locationUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                    style={buttonStyle}
                  >
                    <MapPin size={16} className="mr-2" /> 
                    {ceremonyLocation.buttonText || 'Ver ubicación'}
                  </a>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Recepción */}
          {showReception && (
            <motion.div 
              className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 
                className="text-2xl font-medium mb-6 text-center"
                style={eventTitleStyle}
              >
                {receptionTitle}
              </h3>
              
              <div className="space-y-4">
                {receptionDate && (
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      <strong>Fecha:</strong> {formatDate(receptionDate)}
                    </div>
                  </div>
                )}
                
                {receptionTime && (
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      <strong>Hora:</strong> {formatTime(receptionTime)}
                    </div>
                  </div>
                )}
                
                {receptionLocation?.address && (
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      <strong>Lugar:</strong> {receptionLocation.address}
                    </div>
                  </div>
                )}
                
                {receptionDetails && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={detailsTextStyle}>
                      {receptionDetails}
                    </div>
                  </div>
                )}
              </div>
              
              {receptionLocation?.locationUrl && (
                <div className="mt-6 text-center">
                  <a 
                    href={receptionLocation.locationUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                    style={buttonStyle}
                  >
                    <MapPin size={16} className="mr-2" /> 
                    {receptionLocation.buttonText || 'Ver ubicación'}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Event Details Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(eventDetailsSchema);

export default ConfigurableEventDetails;
