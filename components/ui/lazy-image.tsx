"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useConditionalRender } from '@/hooks/use-conditional-render';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  style?: React.CSSProperties;
}

/**
 * Componente de imagen optimizado que implementa lazy loading y optimización para móviles
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, isVisible, hasBeenVisible } = useConditionalRender({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px 0px',
    skip: priority // No usar lazy loading si la imagen es prioritaria
  });

  // Generar un placeholder si no se proporciona uno
  const defaultBlurDataURL = blurDataURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIj48L3JlY3Q+PC9zdmc+';
  
  // Optimizar el origen de la imagen para móviles si es necesaria
  const optimizedSrc = src;
  
  // Manejar eventos de carga y error
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setError(true);
    console.error(`Error al cargar la imagen: ${src}`);
  };
  
  // Determinar si debemos renderizar la imagen
  const shouldLoad = priority || hasBeenVisible;
  
  // Estilos de transición para el fade-in
  const imageStyle: React.CSSProperties = {
    ...style,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };
  
  // Renderizar un placeholder si hay error
  if (error) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`lazy-image-error ${className}`}
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
  
  // Renderizar un placeholder mientras se carga
  if (!shouldLoad) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`lazy-image-placeholder ${className}`}
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
  
  // Renderizar la imagen con Next.js Image
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`lazy-image-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width || 500}
        height={height || 300}
        className={`lazy-image ${className}`}
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

export default LazyImage;
