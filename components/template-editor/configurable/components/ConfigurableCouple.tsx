"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Flower, Star, CircleUser } from 'lucide-react';
import Image from 'next/image';
import { ComponentProperty } from '../../types';
import { coupleSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente Couple configurable para el editor de plantillas
 * Muestra información sobre los novios, con fotos y descripciones
 */

// Definir el tipo de propiedades basado en el esquema
export type CoupleProps = {
  // Contenido general
  sectionTitle: string;
  
  // Información del primer cónyuge
  person1Name: string;
  person1Image: string;
  person1Description: string;
  
  // Información del segundo cónyuge
  person2Name: string;
  person2Image: string;
  person2Description: string;
  
  // Historia común (opcional)
  showStory: boolean;
  storyTitle: string;
  storyText: string;
  
  // Estilos visuales
  backgroundColor: string;
  useTexture: boolean;
  texturePattern: string;
  textureOpacity: number;
  textColor: string;
  accentColor: string;
  decorativeIcon: 'heart' | 'flower' | 'star' | 'rings' | 'none';
  
  // Fuentes
  titleFont: string;
  namesFont: string;
  textFont: string;
  
  // Animación
  showAnimation: boolean;
  
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

const ConfigurableCouple: React.FC<CoupleProps> = ({
  sectionTitle,
  person1Name,
  person1Image,
  person1Description,
  person2Name,
  person2Image,
  person2Description,
  showStory,
  storyTitle,
  storyText,
  backgroundColor,
  useTexture,
  texturePattern,
  textureOpacity,
  textColor,
  accentColor,
  decorativeIcon,
  titleFont,
  namesFont,
  textFont,
  showAnimation,
  isEditing = false,
  onPropertyChange
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  // Debug the texture settings
  useEffect(() => {
    if (useTexture) {
      console.log('Texture is enabled');
      console.log('Texture pattern URL:', texturePattern);
      console.log('Texture opacity:', textureOpacity);
    }
  }, [useTexture, texturePattern, textureOpacity]);
  
  // Función para renderizar el icono decorativo
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      strokeWidth: 1,
      className: "inline-block",
      style: { color: accentColor }
    };
    
    switch (decorativeIcon) {
      case 'heart':
        return <Heart {...iconProps} />;
      case 'flower':
        return <Flower {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'rings':
        return <CircleUser {...iconProps} />;
      default:
        return null;
    }
  };
  
  // Estilos para las fuentes
  const titleStyle = {
    fontFamily: getFontFamily(titleFont, 'serif'),
    color: textColor
  };
  
  const namesStyle = {
    fontFamily: getFontFamily(namesFont, 'serif'),
    color: accentColor
  };
  
  const textStyle = {
    fontFamily: getFontFamily(textFont, 'sans-serif'),
    color: textColor
  };
  
  // Estilo para la sección
  const sectionStyle = {
    backgroundColor,
    position: 'relative' as const
  };
  
  // Utilizar imágenes predeterminadas si están vacías
  const actualPerson1Image = person1Image || '/images/novia1.jpeg';
  const actualPerson2Image = person2Image || '/images/novio1.jpeg';
  
  // Animación condicional
  const getAnimationProps = () => {
    if (!showAnimation) return {};
    
    return {
      initial: { opacity: 0, y: 20 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      transition: { duration: 0.8 }
    };
  };
  
  return (
    <section 
      className={`py-16 px-4 w-full relative ${isEditing ? 'editing-mode' : ''}`}
      style={sectionStyle}
      data-component-type="couple"
      id="couple-section"
      ref={ref}
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
      
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Título de la sección */}
        {sectionTitle && (
          <motion.h2 
            className="text-3xl md:text-4xl text-center mb-8"
            style={titleStyle}
            {...getAnimationProps()}
          >
            {sectionTitle}
          </motion.h2>
        )}
        
        {/* Divisor decorativo superior */}
        {decorativeIcon !== 'none' && (
          <div className="flex items-center justify-center mb-12">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="mx-4">
              {renderIcon()}
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        )}
        
        {/* Sección de novios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Primer cónyuge */}
          <motion.div 
            className="flex flex-col items-center text-center"
            {...getAnimationProps()}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {actualPerson1Image && (
              <div className="mb-5 rounded-full overflow-hidden w-48 h-48 mx-auto relative">
                <Image 
                  src={actualPerson1Image} 
                  alt={person1Name}
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  className="object-cover"
                />
              </div>
            )}
            <h3 
              className="text-2xl font-medium mb-3"
              style={namesStyle}
            >
              {person1Name}
            </h3>
            <p
              className="text-base leading-relaxed"
              style={textStyle}
            >
              {person1Description}
            </p>
          </motion.div>
          
          {/* Segundo cónyuge */}
          <motion.div 
            className="flex flex-col items-center text-center"
            {...getAnimationProps()}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {actualPerson2Image && (
              <div className="mb-5 rounded-full overflow-hidden w-48 h-48 mx-auto relative">
                <Image 
                  src={actualPerson2Image} 
                  alt={person2Name}
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  className="object-cover"
                />
              </div>
            )}
            <h3 
              className="text-2xl font-medium mb-3"
              style={namesStyle}
            >
              {person2Name}
            </h3>
            <p
              className="text-base leading-relaxed"
              style={textStyle}
            >
              {person2Description}
            </p>
          </motion.div>
        </div>
        
        {/* Historia compartida (opcional) */}
        {showStory && (
          <motion.div 
            className="mb-12 text-center max-w-3xl mx-auto"
            {...getAnimationProps()}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {storyTitle && (
              <h3 
                className="text-2xl font-medium mb-4"
                style={namesStyle}
              >
                {storyTitle}
              </h3>
            )}
            <p
              className="text-base leading-relaxed"
              style={textStyle}
            >
              {storyText}
            </p>
          </motion.div>
        )}
        
        {/* Divisor decorativo inferior */}
        {decorativeIcon !== 'none' && (
          <div className="flex items-center justify-center">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="mx-4">
              {renderIcon()}
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        )}
      </div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Couple Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(coupleSchema);

export default ConfigurableCouple; 