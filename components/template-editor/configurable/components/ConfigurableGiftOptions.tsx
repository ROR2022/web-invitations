"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, CreditCard, ShoppingBag } from 'lucide-react';
import { ComponentProperty } from '../../types';
import { giftOptionsSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente GiftOptions configurable para el editor de plantillas
 * Muestra información sobre regalos o mesa de regalos
 */

// Definir el tipo de propiedades basado en el esquema
export type GiftOptionsProps = {
  // Propiedades configurables
  title: string;
  description: string;
  showCashOption: boolean;
  cashDescription: string;
  showGiftRegistries: boolean;
  registries: string | string[];
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

// Mapa de información sobre registros de regalo
const registryInfo = {
  liverpool: {
    name: 'Liverpool',
    logo: '/images/registries/liverpool.png',
    url: 'https://www.liverpool.com.mx/tienda/mesa-de-regalos/'
  },
  amazon: {
    name: 'Amazon',
    logo: '/images/registries/amazon.png',
    url: 'https://www.amazon.com.mx/gp/wedding/homepage'
  },
  palacio: {
    name: 'Palacio de Hierro',
    logo: '/images/registries/palacio.png',
    url: 'https://www.elpalaciodehierro.com/mesa-de-regalos/busqueda.html'
  },
  sears: {
    name: 'Sears',
    logo: '/images/registries/sears.png',
    url: 'https://www.sears.com.mx/Mesa-de-Regalos/'
  },
  other: {
    name: 'Otra tienda',
    logo: '/images/registries/gift.png',
    url: '#'
  }
};

const ConfigurableGiftOptions: React.FC<GiftOptionsProps> = ({
  title,
  description,
  showCashOption,
  cashDescription,
  showGiftRegistries,
  registries,
  backgroundColor,
  textColor,
  iconColor,
  isEditing = false,
  onPropertyChange
}) => {
  // Normalizar el valor de registries a un array
  const normalizedRegistries = typeof registries === 'string' 
    ? [registries] 
    : registries || [];

  return (
    <section 
      className={`py-16 md:py-24 w-full relative ${isEditing ? 'editing-mode' : ''}`}
      style={{ backgroundColor }}
      data-component-type="giftOptions"
      id="gift-options-section"
    >
      <motion.div 
        className="container mx-auto px-4 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-medium mb-4"
            style={{ color: textColor }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
          
          <motion.div
            className="text-lg prose max-w-none mx-auto"
            style={{ color: textColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        
        <div className="space-y-8">
          {/* Opción de efectivo */}
          {showCashOption && (
            <motion.div 
              className="bg-white bg-opacity-20 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <CreditCard size={24} style={{ color: iconColor }} className="mr-3" />
                <h3 
                  className="text-xl font-medium"
                  style={{ color: textColor }}
                >
                  Sobre monetario
                </h3>
              </div>
              
              <p 
                className="ml-9"
                style={{ color: textColor }}
              >
                {cashDescription}
              </p>
            </motion.div>
          )}
          
          {/* Mesa de regalos */}
          {showGiftRegistries && normalizedRegistries.length > 0 && (
            <motion.div 
              className="bg-white bg-opacity-20 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <Gift size={24} style={{ color: iconColor }} className="mr-3" />
                <h3 
                  className="text-xl font-medium"
                  style={{ color: textColor }}
                >
                  Mesa de regalos
                </h3>
              </div>
              
              <div className="ml-9 space-y-4">
                <p style={{ color: textColor }}>
                  Puedes encontrar nuestra mesa de regalos en:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {normalizedRegistries.map((registry, index) => {
                    const registryData = registryInfo[registry as keyof typeof registryInfo] || registryInfo.other;
                    
                    return isEditing ? (
                      <button 
                        key={index}
                        className="flex items-center p-4 bg-white bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all w-full text-left"
                      >
                        <div className="mr-3">
                          <ShoppingBag size={24} style={{ color: iconColor }} />
                        </div>
                        <div>
                          <div className="font-medium">{registryData.name}</div>
                          <div className="text-sm opacity-80">Tienda de regalos</div>
                        </div>
                      </button>
                    ) : (
                      <a 
                        key={index}
                        href={registryData.url}
                        className="flex items-center p-4 bg-white bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="w-10 h-10 flex items-center justify-center mr-3">
                          <Image 
                            src={registryData.logo} 
                            alt={registryData.name}
                            width={40}
                            height={40}
                            style={{
                              objectFit: 'contain',
                              width: '100%',
                              height: '100%'
                            }}
                            onError={(e) => {
                              // Si la imagen falla, mostrar un icono
                              const target = e.target as HTMLImageElement;
                              if (target && target.parentElement) {
                                target.style.display = 'none';
                                target.parentElement.appendChild(
                                  Object.assign(document.createElement('div'), {
                                    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
                                    className: 'text-primary'
                                  })
                                );
                              }
                            }}
                          />
                        </div>
                        <span style={{ color: textColor }}>{registryData.name}</span>
                      </a>
                    );
                  })}
                </div>
                
                <p className="text-sm mt-2" style={{ color: textColor }}>
                  Haz clic en el enlace para ir directamente a nuestra mesa de regalos
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Gift Options Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(giftOptionsSchema);

export default ConfigurableGiftOptions;
