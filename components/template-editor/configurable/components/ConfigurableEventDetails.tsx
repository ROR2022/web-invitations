"use client";

import React from 'react';
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
    lat?: number;
    lng?: number;
    placeId?: string;
  };
  ceremonyDetails: string;
  
  // Propiedades de la recepción
  receptionTitle: string;
  receptionDate: string;
  receptionTime: string;
  receptionLocation: {
    address: string;
    lat?: number;
    lng?: number;
    placeId?: string;
  };
  receptionDetails: string;
  
  // Propiedades de estilo
  showMap: boolean;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  dressCode: string;
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

// Función auxiliar para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
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
  showMap,
  backgroundColor,
  textColor,
  iconColor,
  dressCode,
  isEditing = false,
  onPropertyChange
}) => {
  // Determinar si mostrar ceremonia y/o recepción
  const showCeremony = ceremonyTitle && (ceremonyDate || ceremonyTime || ceremonyLocation?.address);
  const showReception = receptionTitle && (receptionDate || receptionTime || receptionLocation?.address);

  return (
    <section 
      className={`py-16 md:py-24 w-full relative ${isEditing ? 'editing-mode' : ''}`}
      style={{ backgroundColor }}
      data-component-type="eventDetails"
      id="event-details-section"
    >
      <motion.div 
        className="container mx-auto px-4 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-medium mb-4"
            style={{ color: textColor }}
          >
            Detalles del Evento
          </h2>
          
          {dressCode && (
            <div 
              className="inline-block border px-4 py-2 rounded-full mt-4"
              style={{ borderColor: iconColor, color: textColor }}
            >
              <span className="font-medium">Código de vestimenta:</span> {dressCode}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                style={{ color: textColor }}
              >
                {ceremonyTitle}
              </h3>
              
              <div className="space-y-4">
                {ceremonyDate && (
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      <strong>Fecha:</strong> {formatDate(ceremonyDate)}
                    </div>
                  </div>
                )}
                
                {ceremonyTime && (
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      <strong>Hora:</strong> {formatTime(ceremonyTime)}
                    </div>
                  </div>
                )}
                
                {ceremonyLocation?.address && (
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      <strong>Lugar:</strong> {ceremonyLocation.address}
                    </div>
                  </div>
                )}
                
                {ceremonyDetails && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      {ceremonyDetails}
                    </div>
                  </div>
                )}
              </div>
              
              {showMap && ceremonyLocation?.lat && ceremonyLocation?.lng && (
                <div className="mt-6 h-48 rounded overflow-hidden">
                  {/* En modo edición o sin API key configurada, mostrar un placeholder */}
                  {isEditing || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === undefined ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                      <MapPin className="mr-2" size={20} />
                      Vista previa del mapa
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${ceremonyLocation.lat},${ceremonyLocation.lng}`}
                      allowFullScreen
                      title="Mapa de ubicación de ceremonia"
                    />
                  )}
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
                style={{ color: textColor }}
              >
                {receptionTitle}
              </h3>
              
              <div className="space-y-4">
                {receptionDate && (
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      <strong>Fecha:</strong> {formatDate(receptionDate)}
                    </div>
                  </div>
                )}
                
                {receptionTime && (
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      <strong>Hora:</strong> {formatTime(receptionTime)}
                    </div>
                  </div>
                )}
                
                {receptionLocation?.address && (
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      <strong>Lugar:</strong> {receptionLocation.address}
                    </div>
                  </div>
                )}
                
                {receptionDetails && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-1 flex-shrink-0" style={{ color: iconColor }} />
                    <div style={{ color: textColor }}>
                      {receptionDetails}
                    </div>
                  </div>
                )}
              </div>
              
              {showMap && receptionLocation?.lat && receptionLocation?.lng && (
                <div className="mt-6 h-48 rounded overflow-hidden">
                  {/* En modo edición o sin API key configurada, mostrar un placeholder */}
                  {isEditing || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === undefined ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                      <MapPin className="mr-2" size={20} />
                      Vista previa del mapa
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${receptionLocation.lat},${receptionLocation.lng}`}
                      allowFullScreen
                      title="Mapa de ubicación de recepción"
                    />
                  )}
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
