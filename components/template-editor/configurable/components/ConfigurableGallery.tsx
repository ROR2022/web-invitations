"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ComponentProperty } from '../../types';
import { gallerySchema } from '../componentSchemas';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente Gallery configurable para el editor de plantillas
 * Muestra una galería de imágenes con diferentes layouts
 */

// Definir el tipo de propiedades basado en el esquema
export type GalleryProps = {
  // Propiedades generales
  title: string;
  description: string;
  
  // Propiedades de la galería
  layout: 'grid' | 'masonry' | 'carousel' | 'slideshow';
  numberOfImages: number;
  
  // Imágenes individuales
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  image7?: string;
  image8?: string;
  image9?: string;
  image10?: string;
  image11?: string;
  image12?: string;
  
  // Leyendas individuales
  caption1?: string;
  caption2?: string;
  caption3?: string;
  caption4?: string;
  caption5?: string;
  caption6?: string;
  caption7?: string;
  caption8?: string;
  caption9?: string;
  caption10?: string;
  caption11?: string;
  caption12?: string;
  
  // Propiedades de estilo
  backgroundColor: string;
  textColor: string;
  showCaptions: boolean;
  enableLightbox: boolean;
  imageStyle: 'square' | 'rounded' | 'circle' | 'polaroid';
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

const ConfigurableGallery: React.FC<GalleryProps> = ({
  title,
  description,
  layout,
  numberOfImages = 6,
  image1, image2, image3, image4, image5, image6,
  image7, image8, image9, image10, image11, image12,
  caption1, caption2, caption3, caption4, caption5, caption6,
  caption7, caption8, caption9, caption10, caption11, caption12,
  backgroundColor,
  textColor,
  showCaptions,
  enableLightbox,
  imageStyle,
  isEditing = false,
  onPropertyChange
}) => {
  // Estado para el lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Estado para el carrusel
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Generar array de imágenes a partir de las propiedades individuales
  const images = [
    { url: image1 || '', caption: caption1 || '' },
    { url: image2 || '', caption: caption2 || '' },
    { url: image3 || '', caption: caption3 || '' },
    { url: image4 || '', caption: caption4 || '' },
    { url: image5 || '', caption: caption5 || '' },
    { url: image6 || '', caption: caption6 || '' },
    { url: image7 || '', caption: caption7 || '' },
    { url: image8 || '', caption: caption8 || '' },
    { url: image9 || '', caption: caption9 || '' },
    { url: image10 || '', caption: caption10 || '' },
    { url: image11 || '', caption: caption11 || '' },
    { url: image12 || '', caption: caption12 || '' },
  ].filter((img, index) => img.url && index < numberOfImages);
  
  // Limitar el número de imágenes según la propiedad numberOfImages
  const displayImages = images.slice(0, numberOfImages);
  
  // Funciones para el lightbox
  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
    }
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };
  
  // Funciones para el carrusel
  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  };
  
  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };
  
  // Obtener clases para el estilo de las imágenes
  const getImageStyleClasses = () => {
    switch (imageStyle) {
      case 'rounded':
        return 'rounded-lg overflow-hidden';
      case 'circle':
        return 'rounded-full overflow-hidden aspect-square object-cover';
      case 'polaroid':
        return 'p-2 bg-white shadow-md rotate-1 hover:rotate-0 transition-transform';
      default:
        return '';
    }
  };
  
  // Renderizar la galería según el layout seleccionado
  const renderGallery = () => {
    const imageStyleClasses = getImageStyleClasses();
    
    switch (layout) {
      case 'grid':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayImages.map((image, index) => (
              <motion.div
                key={index}
                className={`${imageStyleClasses} ${imageStyle === 'polaroid' ? 'pt-2 pb-6' : ''} cursor-pointer`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openLightbox(index);
                    e.preventDefault();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative">
                  <Image 
                    src={image.url} 
                    alt={image.caption || `Imagen ${index + 1}`}
                    width={400}
                    height={300}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: imageStyle === 'circle' ? 'cover' : 'contain'
                    }}
                  />
                  {showCaptions && imageStyle !== 'polaroid' && image.caption && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-white text-sm text-center"
                      style={{ color: 'white' }}
                    >
                      {image.caption}
                    </div>
                  )}
                </div>
                {showCaptions && imageStyle === 'polaroid' && image.caption && (
                  <div className="text-center pt-2 text-sm" style={{ color: 'black' }}>
                    {image.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        );
        
      case 'masonry':
        return (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {displayImages.map((image, index) => (
              <motion.div
                key={index}
                className={`${imageStyleClasses} ${imageStyle === 'polaroid' ? 'pt-2 pb-6 inline-block' : 'break-inside-avoid'} cursor-pointer mb-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openLightbox(index);
                    e.preventDefault();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative">
                  <Image 
                    src={image.url} 
                    alt={image.caption || `Imagen ${index + 1}`}
                    width={400}
                    height={300}
                    style={{
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                  {showCaptions && imageStyle !== 'polaroid' && image.caption && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-white text-sm text-center"
                      style={{ color: 'white' }}
                    >
                      {image.caption}
                    </div>
                  )}
                </div>
                {showCaptions && imageStyle === 'polaroid' && image.caption && (
                  <div className="text-center pt-2 text-sm" style={{ color: 'black' }}>
                    {image.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        );
        
      case 'carousel':
        return (
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                {displayImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="min-w-full px-2"
                  >
                    <div 
                      className={`mx-auto max-w-2xl ${imageStyleClasses} overflow-hidden cursor-pointer ${imageStyle === 'polaroid' ? 'pt-2 pb-6' : ''}`}
                      onClick={() => openLightbox(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          openLightbox(index);
                          e.preventDefault();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <Image 
                        src={image.url} 
                        alt={image.caption || `Imagen ${index + 1}`}
                        width={600}
                        height={400}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '60vh',
                          objectFit: 'contain'
                        }}
                      />
                      {showCaptions && image.caption && (
                        <div 
                          className={`p-2 text-center ${imageStyle === 'polaroid' ? 'pt-2 text-black' : 'bg-black bg-opacity-60 text-white'}`}
                        >
                          {image.caption}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Controles del carrusel */}
            <button 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
              onClick={prevSlide}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
              onClick={nextSlide}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Indicadores */}
            <div className="flex justify-center mt-4 space-x-2">
              {displayImages.map((_, index) => (
                <button 
                  key={index}
                  className={`w-3 h-3 rounded-full ${carouselIndex === index ? 'bg-primary' : 'bg-gray-300'}`}
                  style={{ 
                    backgroundColor: carouselIndex === index ? 'var(--primary, #9a0045)' : '#cbd5e0',
                    opacity: carouselIndex === index ? 1 : 0.6 
                  }}
                  onClick={() => setCarouselIndex(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        );
        
      case 'slideshow':
        return (
          <div className="relative max-w-3xl mx-auto">
            {displayImages.map((image, index) => (
              <motion.div
                key={index}
                className={`${index === carouselIndex ? 'block' : 'hidden'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div 
                  className={`${imageStyleClasses} cursor-pointer ${imageStyle === 'polaroid' ? 'pt-2 pb-6' : ''}`}
                  onClick={() => openLightbox(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      openLightbox(index);
                      e.preventDefault();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Image 
                    src={image.url} 
                    alt={image.caption || `Imagen ${index + 1}`}
                    width={600}
                    height={400}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '70vh',
                      objectFit: 'contain'
                    }}
                  />
                  {showCaptions && image.caption && (
                    <div 
                      className={`p-2 text-center ${imageStyle === 'polaroid' ? 'pt-2 text-black' : 'bg-black bg-opacity-60 text-white absolute bottom-0 left-0 right-0'}`}
                    >
                      {image.caption}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Controles del slideshow */}
            <button 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
              onClick={prevSlide}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
              onClick={nextSlide}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Indicadores */}
            <div className="flex justify-center mt-4 space-x-2">
              {displayImages.map((_, index) => (
                <button 
                  key={index}
                  className={`w-3 h-3 rounded-full ${carouselIndex === index ? 'bg-primary' : 'bg-gray-300'}`}
                  style={{ 
                    backgroundColor: carouselIndex === index ? 'var(--primary, #9a0045)' : '#cbd5e0',
                    opacity: carouselIndex === index ? 1 : 0.6 
                  }}
                  onClick={() => setCarouselIndex(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section 
      className={`py-16 md:py-24 w-full relative ${isEditing ? 'editing-mode' : ''}`}
      style={{ backgroundColor }}
      data-component-type="gallery"
      id="gallery-section"
    >
      <div className="container mx-auto px-4">
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
          
          {description && (
            <motion.p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: textColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </div>
        
        {renderGallery()}
        
        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button 
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50"
              onClick={closeLightbox}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50"
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
            
            <Image 
              src={displayImages[currentImageIndex].url} 
              alt={displayImages[currentImageIndex].caption || `Imagen ${currentImageIndex + 1}`}
              width={800}
              height={600}
              style={{
                maxHeight: '90vh',
                maxWidth: '90vw',
                objectFit: 'contain',
                width: 'auto',
                height: 'auto'
              }}
            />
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50"
              onClick={nextImage}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button>
            
            {showCaptions && displayImages[currentImageIndex].caption && (
              <div className="absolute bottom-8 left-0 right-0 text-center text-white p-2">
                {displayImages[currentImageIndex].caption}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Gallery Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(gallerySchema);

export default ConfigurableGallery;
