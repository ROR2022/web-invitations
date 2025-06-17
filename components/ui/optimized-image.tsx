"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useConditionalRender } from '@/hooks/use-conditional-render';
import { useDevice } from '@/hooks/use-mobile';
import { getOptimizedResourceUrl, ResourcePriority, queueResource } from '@/services/network-optimization.service';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  layout?: 'fill' | 'fixed' | 'responsive' | 'intrinsic';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  resourcePriority?: ResourcePriority;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
}

/**
 * Componente de imagen con todas las optimizaciones de la Fase 5
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 80,
  className = '',
  style = {},
  objectFit = 'cover',
  resourcePriority = ResourcePriority.MEDIUM,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const { isMobile, isTablet } = useDevice();
  
  const { ref, isVisible, hasBeenVisible } = useConditionalRender({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px 0px', // Precarga cuando está a 200px de la vista
    skip: priority // No usar lazy loading si la imagen es prioritaria
  });

  // Obtener la URL optimizada según el dispositivo
  useEffect(() => {
    // Optimizar la URL según el tipo de dispositivo
    const optimizedUrl = getOptimizedResourceUrl(src, 'image');
    setOptimizedSrc(optimizedUrl);
    
    // Añadir a la cola de carga con la prioridad adecuada
    if (!priority) {
      queueResource({
        url: optimizedUrl,
        type: 'image',
        priority: resourcePriority
      });
    }
  }, [src, priority, resourcePriority]);

  // Calcular tamaños óptimos según el dispositivo
  const getOptimalDimensions = () => {
    if (!width || !height) {
      return { width: width || 800, height: height || 600 };
    }
    
    // Escalar dimensiones según el dispositivo
    let scaleFactor = 1;
    
    if (isMobile) {
      scaleFactor = 0.5; // 50% del tamaño original para móviles
    } else if (isTablet) {
      scaleFactor = 0.75; // 75% del tamaño original para tablets
    }
    
    return {
      width: Math.round(width * scaleFactor),
      height: Math.round(height * scaleFactor)
    };
  };

  const { width: optimalWidth, height: optimalHeight } = getOptimalDimensions();
  
  // Generar un placeholder si no se proporciona uno
  const defaultBlurDataURL = blurDataURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIj48L3JlY3Q+PC9zdmc+';
  
  // Estilos para la imagen
  const imageStyle: React.CSSProperties = {
    ...style,
    objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  // Manejar eventos
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setError(true);
    console.error(`Error al cargar imagen: ${src}`);
  };

  // Determinar si debemos renderizar la imagen
  const shouldRender = priority || hasBeenVisible;
  
  // Placeholder para errores
  if (error) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`optimized-image-error ${className}`}
        style={{
          width: width || '100%',
          height: height || '100%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
          borderRadius: '4px',
        }}
        {...props}
      >
        <span>Error al cargar imagen</span>
      </div>
    );
  }
  
  // Placeholder mientras se carga
  if (!shouldRender) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`optimized-image-placeholder ${className}`}
        style={{
          width: width || '100%',
          height: height || '100%',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
        {...props}
      />
    );
  }
  
  // Renderizar la imagen optimizada
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`optimized-image-container ${className}`}
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        width: width || '100%',
        height: height || 'auto'
      }}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={optimalWidth}
        height={optimalHeight}
        quality={quality}
        className={`optimized-image ${className}`}
        style={imageStyle}
        loading={priority ? 'eager' : 'lazy'}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
