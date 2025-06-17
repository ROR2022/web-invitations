"use client";

import React from 'react';
import { useDevice } from '@/hooks/use-mobile';
import { useConditionalRender } from '@/hooks/use-conditional-render';
import { motion } from 'framer-motion';

interface OptimizedResponsiveRendererProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  portrait?: React.ReactNode;
  landscape?: React.ReactNode;
  lazyLoad?: boolean;
  lazyLoadThreshold?: number;
  lazyLoadMargin?: string;
  animateIn?: boolean;
  animationDelay?: number;
}

/**
 * Componente optimizado para renderizar contenido adaptativo según el dispositivo
 * Implementa lazy loading y transiciones optimizadas para mejorar rendimiento
 */
const OptimizedResponsiveRenderer: React.FC<OptimizedResponsiveRendererProps> = ({
  children,
  mobile,
  tablet,
  desktop,
  portrait,
  landscape,
  lazyLoad = false,
  lazyLoadThreshold = 0.1,
  lazyLoadMargin = '200px 0px',
  animateIn = true,
  animationDelay = 0,
}) => {
  const { deviceType, orientation, width, height } = useDevice();
  
  // Configurar conditional render para lazy loading si se requiere
  const { ref, isVisible, hasBeenVisible } = useConditionalRender({
    threshold: lazyLoadThreshold,
    rootMargin: lazyLoadMargin,
    triggerOnce: true,
    skip: !lazyLoad
  });
  
  // Determinar el contenido a mostrar según el dispositivo y orientación
  const getContent = () => {
    // Priorizar orientación si se especifica
    if (orientation === 'portrait' && portrait) {
      return portrait;
    }
    
    if (orientation === 'landscape' && landscape) {
      return landscape;
    }
    
    // Luego priorizar según tipo de dispositivo
    if (deviceType === 'mobile' && mobile) {
      return mobile;
    }
    
    if (deviceType === 'tablet' && tablet) {
      return tablet;
    }
    
    if (deviceType === 'desktop' && desktop) {
      return desktop;
    }
    
    // Por defecto, usar children
    return children;
  };
  
  // Si no usamos lazy loading, renderizar directamente
  if (!lazyLoad) {
    if (animateIn) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animationDelay, duration: 0.5 }}
        >
          {getContent()}
        </motion.div>
      );
    }
    return <>{getContent()}</>;
  }
  
  // Con lazy loading, renderizar según visibilidad
  const shouldRender = hasBeenVisible;
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="optimized-responsive-container"
      style={{ minHeight: '50px' }}
    >
      {shouldRender ? (
        animateIn ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay, duration: 0.5 }}
          >
            {getContent()}
          </motion.div>
        ) : (
          getContent()
        )
      ) : (
        <div className="optimized-responsive-placeholder" />
      )}
    </div>
  );
};

export default OptimizedResponsiveRenderer;
