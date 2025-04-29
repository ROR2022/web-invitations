"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ComponentProperty } from '../../types';
import { heroSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente Hero configurable para el editor de plantillas
 * Permite personalizar todos los aspectos visuales sin necesidad de código
 */

// Definir el tipo de propiedades basado en el esquema
export type HeroProps = {
  // Propiedades visuales configurables
  backgroundImage: string;
  backgroundOverlay: string;
  title: string;
  subtitle: string;
  name: string;
  titleFont: string;
  subtitleFont: string;
  textColor: string;
  height: 'fullscreen' | 'large' | 'medium' | 'small';
  animation: 'fade' | 'slide' | 'zoom' | 'none';
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

// Función auxiliar para obtener configuraciones de animación
const getAnimationConfig = (type: string) => {
  switch (type) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1 }
      };
    case 'slide':
      return {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1 }
      };
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1 }
      };
    default:
      return {
        initial: {},
        animate: {},
        transition: {}
      };
  }
};

// Función auxiliar para obtener la altura basada en la configuración
const getHeightClass = (height: string) => {
  switch (height) {
    case 'fullscreen':
      return 'h-screen';
    case 'large':
      return 'h-[80vh]';
    case 'medium':
      return 'h-[60vh]';
    case 'small':
      return 'h-[40vh]';
    default:
      return 'h-screen';
  }
};

const ConfigurableHero: React.FC<HeroProps> = ({
  backgroundImage,
  backgroundOverlay,
  title,
  subtitle,
  name,
  titleFont,
  subtitleFont,
  textColor,
  height,
  animation,
  isEditing = false,
  onPropertyChange
}) => {
  // Aplicar configuraciones de animación
  const animationConfig = getAnimationConfig(animation);
  const heightClass = getHeightClass(height);
  
  // Estilos para las fuentes
  const getTitleFontFamily = () => {
    if (titleFont === 'Great Vibes') return 'var(--font-great-vibes)';
    if (titleFont === 'Playfair Display') return 'var(--font-playfair)';
    return titleFont; // Devuelve el valor directamente para otras fuentes
  };
  
  const getSubtitleFontFamily = () => {
    if (subtitleFont === 'Great Vibes') return 'var(--font-great-vibes)';
    if (subtitleFont === 'Playfair Display') return 'var(--font-playfair)';
    return subtitleFont;
  };

  const titleFontStyle = {
    fontFamily: getTitleFontFamily(),
    color: textColor
  };
  
  const subtitleFontStyle = {
    fontFamily: getSubtitleFontFamily(),
    color: textColor
  };

  return (
    <section 
      className={`relative ${heightClass} flex flex-col items-center justify-center overflow-hidden ${isEditing ? 'editing-mode' : ''}`}
      data-component-type="hero"
      id="hero-section"
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      {/* Superposición de color */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: backgroundOverlay
        }}
      />
      
      {/* Contenido */}
      <motion.div
        className="z-10 text-center px-4 space-y-4"
        {...(animation !== 'none' ? animationConfig : {})}
      >
        <motion.p
          className="text-2xl md:text-3xl"
          style={subtitleFontStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>
        
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl"
          style={titleFontStyle}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {title}
        </motion.h1>
        
        <motion.div
          className="text-4xl md:text-5xl mt-4"
          style={titleFontStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {name}
        </motion.div>
        
        {/* Indicador de desplazamiento */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="scroll-indicator flex flex-col items-center">
            <span className="text-sm mb-2" style={{ color: textColor }}>
              Desliza hacia abajo
            </span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: textColor }}
            >
              <path 
                d="M12 4V20M12 20L18 14M12 20L6 14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-50">
          Hero Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
console.warn('ConfigurableHero heroSchema: ', heroSchema);
export const configurableProperties = createConfigurableProperties(heroSchema);
console.warn('ConfigurableHero configurableProperties: ', configurableProperties);

export default ConfigurableHero;
