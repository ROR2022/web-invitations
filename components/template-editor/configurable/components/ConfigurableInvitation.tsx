"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Flower, Star } from 'lucide-react';
import Image from 'next/image';
import { ComponentProperty } from '../../types';
import { invitationSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente Invitation configurable para el editor de plantillas
 * Muestra la invitación formal con mensaje principal
 */

// Definir el tipo de propiedades basado en el esquema
export type InvitationProps = {
  // Textos principales
  introText: string;
  mainEventText: string;
  formalText: string;
  
  // Fuentes de texto
  introTextFont: string;
  mainEventTextFont: string;
  formalTextFont: string;
  hostNamesFont: string;
  
  // Información de anfitriones
  showHosts: boolean;
  hostType: 'parents' | 'couple' | 'individual';
  host1FirstName: string;
  host1LastName: string;
  host2FirstName: string;
  host2LastName: string;
  separatorText: string;
  
  // Información de padrinos
  showPadrinos: boolean;
  padrinosTitle: string;
  numPadrinos: 'one' | 'two';
  padrino1FirstName: string;
  padrino1LastName: string;
  padrino1Role: string;
  padrino2FirstName: string;
  padrino2LastName: string;
  padrino2Role: string;
  padrinosFont: string;
  
  // Estilos visuales
  backgroundColor: string;
  useTexture: boolean;
  texturePattern: string;
  textureOpacity: number;
  mainTextColor: string;
  accentTextColor: string;
  decorativeIcon: 'heart' | 'flower' | 'star' | 'none';
  showAnimation: boolean;
  
  // Elementos opcionales
  showImage: boolean;
  imageUrl: string;
  
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

const ConfigurableInvitation: React.FC<InvitationProps> = ({
  introText,
  mainEventText,
  formalText,
  introTextFont,
  mainEventTextFont,
  formalTextFont,
  hostNamesFont,
  showHosts,
  hostType,
  host1FirstName,
  host1LastName,
  host2FirstName,
  host2LastName,
  separatorText,
  showPadrinos,
  padrinosTitle,
  numPadrinos,
  padrino1FirstName,
  padrino1LastName,
  padrino1Role,
  padrino2FirstName,
  padrino2LastName,
  padrino2Role,
  padrinosFont,
  backgroundColor,
  useTexture,
  texturePattern,
  textureOpacity,
  mainTextColor,
  accentTextColor,
  decorativeIcon,
  showAnimation,
  showImage,
  imageUrl,
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
      style: { color: accentTextColor }
    };
    
    switch (decorativeIcon) {
      case 'heart':
        return <Heart {...iconProps} />;
      case 'flower':
        return <Flower {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      default:
        return null;
    }
  };
  
  // Estilos para las fuentes
  const introTextStyle = {
    fontFamily: getFontFamily(introTextFont, 'serif'),
    color: mainTextColor
  };
  
  const mainEventTextStyle = {
    fontFamily: getFontFamily(mainEventTextFont, 'serif'),
    color: accentTextColor
  };
  
  const formalTextStyle = {
    fontFamily: getFontFamily(formalTextFont, 'serif'),
    color: mainTextColor
  };
  
  const hostNamesStyle = {
    fontFamily: getFontFamily(hostNamesFont, 'serif'),
    color: accentTextColor
  };
  
  const padrinosStyle = {
    fontFamily: getFontFamily(padrinosFont, 'serif'),
    color: accentTextColor
  };
  
  // Direct inline styles for the section and texture
  const sectionStyle = {
    backgroundColor,
    position: 'relative' as const
  };
  
  return (
    <section 
      className={`py-16 px-4 w-full relative ${isEditing ? 'editing-mode' : ''}`}
      style={sectionStyle}
      data-component-type="invitation"
      id="invitation-section"
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
      
      <div 
        ref={ref}
        className={`max-w-3xl mx-auto text-center transition-all duration-1000 relative z-10 ${
          showAnimation && isInView ? "opacity-100 translate-y-0" : 
          showAnimation ? "opacity-0 translate-y-10" : "opacity-100"
        }`}
      >
        {/* Texto principal */}
        <h2 className="text-2xl md:text-3xl mb-8 leading-relaxed">
          <span style={introTextStyle}>{introText}</span>
          <br />
          <span 
            className="text-3xl md:text-4xl font-medium"
            style={mainEventTextStyle}
          >
            {mainEventText}
          </span>
          <br />
          <span style={formalTextStyle}>{formalText}</span>
        </h2>
        
        {/* Imagen opcional */}
        {showImage && imageUrl && (
          <div className="my-8 relative w-[200px] h-[200px] mx-auto">
            <Image 
              src={imageUrl} 
              alt="Evento" 
              fill
              sizes="200px"
              className="rounded-full object-cover"
            />
          </div>
        )}
        
        {/* Información de anfitriones */}
        {showHosts && (
          <div className="my-8">
            <p 
              className="text-2xl font-medium"
              style={hostNamesStyle}
            >
              {host1FirstName}
            </p>
            <p 
              className="text-2xl font-medium"
              style={hostNamesStyle}
            >
              {host1LastName}
            </p>
            
            {(hostType === 'parents' || hostType === 'couple') && (
              <>
                <p 
                  className="my-2"
                  style={{ color: mainTextColor }}
                >
                  {separatorText}
                </p>
                <p 
                  className="text-2xl font-medium"
                  style={hostNamesStyle}
                >
                  {host2FirstName}
                </p>
                <p 
                  className="text-2xl font-medium"
                  style={hostNamesStyle}
                >
                  {host2LastName}
                </p>
              </>
            )}
          </div>
        )}
        
        {/* Divisor decorativo entre Anfitriones y Padrinos (si ambos están visibles) */}
        {showHosts && showPadrinos && (
          <div className="flex items-center justify-center my-6">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="mx-4">
              {renderIcon()}
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        )}
        
        {/* Sección de Padrinos */}
        {showPadrinos && (
          <div className="my-8">
            {padrinosTitle && (
              <p 
                className="text-xl mb-4"
                style={{ color: mainTextColor }}
              >
                {padrinosTitle}
              </p>
            )}
            
            <div className="flex flex-col items-center space-y-2">
              {/* Primer padrino */}
              <div className="mb-2">
                <p 
                  className="text-xl font-medium"
                  style={padrinosStyle}
                >
                  {padrino1FirstName}
                </p>
                <p 
                  className="text-xl font-medium"
                  style={padrinosStyle}
                >
                  {padrino1LastName}
                </p>
                <p 
                  className="text-md mt-1"
                  style={{ color: mainTextColor }}
                >
                  {padrino1Role}
                </p>
              </div>
              
              {/* Segundo padrino (condicional) */}
              {numPadrinos === 'two' && (
                <div className="mt-4">
                  <p 
                    className="text-xl font-medium"
                    style={padrinosStyle}
                  >
                    {padrino2FirstName}
                  </p>
                  <p 
                    className="text-xl font-medium"
                    style={padrinosStyle}
                  >
                    {padrino2LastName}
                  </p>
                  <p 
                    className="text-md mt-1"
                    style={{ color: mainTextColor }}
                  >
                    {padrino2Role}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Divisor decorativo al final */}
        {decorativeIcon !== 'none' && (
          <div className="flex items-center justify-center my-6">
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
          Invitation Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(invitationSchema);

export default ConfigurableInvitation;
