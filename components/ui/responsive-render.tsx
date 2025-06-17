"use client";

import React from 'react';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveRenderProps {
  children: React.ReactNode;
  desktop?: React.ReactNode;
  tablet?: React.ReactNode;
  mobile?: React.ReactNode;
  portrait?: React.ReactNode;
  landscape?: React.ReactNode;
}

/**
 * Componente independiente para renderizado responsivo
 * Permite mostrar contenido diferente según el dispositivo o orientación
 */
const ResponsiveRender: React.FC<ResponsiveRenderProps> = ({
  children,
  desktop,
  tablet,
  mobile,
  portrait,
  landscape,
}) => {
  const { deviceType, orientation } = useResponsive();
  
  // Renderizar según orientación si se especifica
  if (orientation === 'portrait' && portrait) {
    return <>{portrait}</>;
  }
  
  if (orientation === 'landscape' && landscape) {
    return <>{landscape}</>;
  }
  
  // Renderizar según tipo de dispositivo
  if (deviceType === 'mobile' && mobile) {
    return <>{mobile}</>;
  }
  
  if (deviceType === 'tablet' && tablet) {
    return <>{tablet}</>;
  }
  
  if (deviceType === 'desktop' && desktop) {
    return <>{desktop}</>;
  }
  
  // Por defecto, renderizar children
  return <>{children}</>;
};

export default ResponsiveRender;
