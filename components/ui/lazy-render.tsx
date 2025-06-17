"use client";

import React, { useState, useEffect } from 'react';
import { useConditionalRender } from '@/hooks/use-conditional-render';

interface LazyRenderProps {
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente para renderizado condicional de elementos basado en visibilidad
 */
const LazyRender: React.FC<LazyRenderProps> = ({
  children,
  height = 'auto',
  width = '100%',
  placeholder,
  threshold = 0.1,
  rootMargin = '100px 0px',
  triggerOnce = true,
  skip = false,
  className = '',
  style,
}) => {
  const { ref, isVisible, hasBeenVisible } = useConditionalRender({
    threshold,
    rootMargin,
    triggerOnce,
    skip,
  });

  // Determinar si debemos renderizar el contenido
  const shouldRender = triggerOnce ? hasBeenVisible : isVisible;
  
  // Placeholder por defecto
  const defaultPlaceholder = (
    <div
      style={{
        height,
        width,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="lazy-loading-placeholder" />
    </div>
  );
  
  // Renderizar el placeholder o el contenido
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`lazy-render ${className}`}
      style={{ 
        minHeight: height,
        width,
        ...style
      }}
    >
      {shouldRender ? children : (placeholder || defaultPlaceholder)}
    </div>
  );
};

export default LazyRender;
