"use client";

import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type OrientationType = 'portrait' | 'landscape';

interface UseResponsiveOptions {
  mobileMaxWidth?: number;
  tabletMaxWidth?: number;
  updateOnResize?: boolean;
}

interface UseResponsiveResult {
  deviceType: DeviceType;
  orientation: OrientationType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  width: number | null;
  height: number | null;
}

/**
 * Hook personalizado para detección de dispositivos y orientación
 */
export function useResponsive(options: UseResponsiveOptions = {}): UseResponsiveResult {
  const {
    mobileMaxWidth = 640,
    tabletMaxWidth = 1024,
    updateOnResize = true,
  } = options;

  // Estados para almacenar información del dispositivo
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [orientation, setOrientation] = useState<OrientationType>('landscape');
  const [dimensions, setDimensions] = useState<{ width: number | null; height: number | null }>({
    width: null,
    height: null,
  });

  // Función para determinar el tipo de dispositivo basado en el ancho
  const getDeviceType = (width: number): DeviceType => {
    if (width <= mobileMaxWidth) return 'mobile';
    if (width <= tabletMaxWidth) return 'tablet';
    return 'desktop';
  };

  // Función para determinar la orientación
  const getOrientation = (width: number, height: number): OrientationType => {
    return width > height ? 'landscape' : 'portrait';
  };

  // Efecto para configurar los valores iniciales y suscribirse a cambios de tamaño
  useEffect(() => {
    // Solo se ejecuta en el cliente
    if (typeof window === 'undefined') return;

    // Función para actualizar los estados basados en dimensiones de ventana
    const updateValues = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceType(getDeviceType(width));
      setOrientation(getOrientation(width, height));
      setDimensions({ width, height });
    };

    // Actualizar valores iniciales
    updateValues();

    // Suscribirse a eventos de cambio de tamaño si updateOnResize es true
    if (updateOnResize) {
      window.addEventListener('resize', updateValues);

      // Limpieza al desmontar
      return () => {
        window.removeEventListener('resize', updateValues);
      };
    }
  }, [mobileMaxWidth, tabletMaxWidth, updateOnResize]);

  // Verificar si se ejecuta en entorno móvil usando User Agent (complementario)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    // Detectar dispositivos móviles a través de User Agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    
    if (mobileRegex.test(userAgent) && deviceType === 'desktop') {
      // Si el User Agent indica móvil pero la resolución no, ajustar
      setDeviceType(window.innerWidth <= tabletMaxWidth ? 'tablet' : 'mobile');
    }
  }, [deviceType, tabletMaxWidth]);

  // Efecto para detectar cambios de orientación
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOrientationChange = () => {
      setOrientation(getOrientation(window.innerWidth, window.innerHeight));
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Suscribirse al evento de cambio de orientación
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Retornar valores derivados y estados
  return {
    deviceType,
    orientation,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    width: dimensions.width,
    height: dimensions.height,
  };
}

/**
 * Componente para renderizar contenido adaptativo según el dispositivo
 */
interface ResponsiveRenderProps {
  children: React.ReactNode;
  desktop?: React.ReactNode;
  tablet?: React.ReactNode;
  mobile?: React.ReactNode;
  portrait?: React.ReactNode;
  landscape?: React.ReactNode;
}

export const ResponsiveRender: React.FC<ResponsiveRenderProps> = ({
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

export default {
  useResponsive,
  ResponsiveRender
};
