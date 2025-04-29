"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ComponentProperty } from '../../types';
import { thankYouSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente ThankYou configurable para el editor de plantillas
 * Sección final de agradecimiento en la invitación
 */

// Definir el tipo de propiedades basado en el esquema
export type ThankYouProps = {
  // Propiedades configurables
  title: string;
  message: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  showSignature: boolean;
  signature: string;
  signatureFont: string;
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

const ConfigurableThankYou: React.FC<ThankYouProps> = ({
  title,
  message,
  backgroundImage,
  backgroundColor,
  textColor,
  showSignature,
  signature,
  signatureFont,
  isEditing = false,
  onPropertyChange
}) => {
  // Determinar el estilo de fondo
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { backgroundColor };
  
  // Obtener la clase de fuente para la firma
  const getSignatureFontClass = () => {
    if (signatureFont === 'Great Vibes') return 'font-script';
    if (signatureFont === 'Playfair Display') return 'font-serif';
    return '';
  };

  return (
    <section 
      className={`py-20 md:py-28 w-full relative flex items-center justify-center min-h-[50vh] ${isEditing ? 'editing-mode' : ''}`}
      style={backgroundStyle}
      data-component-type="thankYou"
      id="thank-you-section"
    >
      <motion.div 
        className="container mx-auto px-4 text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-medium mb-6"
          style={{ color: textColor }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        
        <motion.div
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10"
          style={{ color: textColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        
        {showSignature && (
          <motion.div
            className={`text-2xl md:text-3xl mt-10 ${getSignatureFontClass()}`}
            style={{ color: textColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {signature}
          </motion.div>
        )}
        
        {/* Decorative elements */}
        <motion.div 
          className="divider mt-16"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="divider-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ color: textColor }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-50">
          Thank You Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(thankYouSchema);

export default ConfigurableThankYou;
