"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  backgroundImages: string[]; // Array of image URLs
  useCarousel: boolean; // Option to use carousel or single image
  carouselInterval: number; // Time between slides in milliseconds
  carouselEffect: 'fade' | 'slide'; // Effect for image transition
  backgroundOverlay: string;
  title: string;
  subtitle: string;
  name: string;
  titleFont: string;
  subtitleFont: string;
  nameFont: string;
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

const ConfigurableHero: React.FC<HeroProps> = ({
  backgroundImages,
  useCarousel,
  carouselInterval,
  carouselEffect,
  backgroundOverlay,
  title,
  subtitle,
  name,
  titleFont,
  subtitleFont,
  nameFont,
  textColor,
  height,
  animation,
  isEditing = false,
  onPropertyChange
}) => {
  // State to track current image index for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Filter out empty image URLs
  const validImages = backgroundImages.filter(img => img && img.trim() !== '');
  
  // If no valid images, use a default
  const hasImages = validImages.length > 0;
  
  // Carousel effect - only run when useCarousel is true and we have multiple images
  useEffect(() => {
    if (!useCarousel || validImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % validImages.length);
    }, carouselInterval);
    
    return () => clearInterval(interval);
  }, [useCarousel, validImages.length, carouselInterval]);
  
  // Aplicar configuraciones de animación
  const animationConfig = getAnimationConfig(animation);
  const heightClass = getHeightClass(height);
  
  // Estilos para las fuentes usando la función centralizada
  const titleFontStyle = {
    fontFamily: getFontFamily(titleFont, 'serif'),
    color: textColor
  };
  
  const subtitleFontStyle = {
    fontFamily: getFontFamily(subtitleFont, 'sans-serif'),
    color: textColor
  };

  const nameFontStyle = {
    fontFamily: getFontFamily(nameFont, 'Great Vibes'),
    color: textColor
  };
  
  // Get the current background image or a fallback
  const currentImage = hasImages ? validImages[currentImageIndex] : '/images/default-hero.jpg';
  
  // Animation variants for slides based on effect type
  const slideVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      hidden: { opacity: 0, x: 300 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -300 }
    }
  };

  return (
    <section 
      className={`relative ${heightClass} flex flex-col items-center justify-center overflow-hidden ${isEditing ? 'editing-mode' : ''}`}
      data-component-type="hero"
      id="hero-section"
    >
      {/* Carousel background */}
      <AnimatePresence mode="wait">
        {useCarousel && validImages.length > 1 ? (
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center z-0"
            initial={slideVariants[carouselEffect].hidden}
            animate={slideVariants[carouselEffect].visible}
            exit={slideVariants[carouselEffect].exit}
            transition={{ duration: 1 }}
            style={{ backgroundImage: `url(${currentImage})` }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${currentImage})` }}
          />
        )}
      </AnimatePresence>
      
      {/* Superposición de color */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: backgroundOverlay }}
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
          style={nameFontStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {name}
        </motion.div>
        
        {/* Carousel indicators when in carousel mode */}
        {useCarousel && validImages.length > 1 && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-10">
            {validImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
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
export const configurableProperties = createConfigurableProperties(heroSchema);

export default ConfigurableHero;
