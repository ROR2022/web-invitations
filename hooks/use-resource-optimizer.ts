"use client";

import { useDevice } from '@/hooks/use-mobile';
import { useResponsive } from '@/hooks/use-responsive';
import { useEffect, useState } from 'react';
import { getOptimizedResourceUrl, ResourcePriority, initNetworkMonitor } from '@/services/network-optimization.service';
import { preloadResources } from '@/services/resource-cache.service';

interface UseResourceOptimizerOptions {
  // URLs de recursos a precargar
  resources?: string[];
  
  // Prioridades específicas para recursos 
  priorities?: Record<string, ResourcePriority>;
  
  // Si debe inicializar el monitor de red
  initMonitor?: boolean;
  
  // Si se ejecuta la precarga automáticamente
  autoPreload?: boolean;
  
  // Callback cuando todos los recursos se han cargado
  onLoaded?: () => void;
}

interface ResourceStatus {
  url: string;
  status: 'loading' | 'loaded' | 'error';
  optimizedUrl?: string;
}

/**
 * Hook personalizado para optimizar y gestionar recursos
 * Implementa monitoreo de red, optimización de imágenes por dispositivo y precarga inteligente
 */
export function useResourceOptimizer(options: UseResourceOptimizerOptions = {}) {
  const {
    resources = [],
    priorities = {},
    initMonitor = true,
    autoPreload = true,
    onLoaded,
  } = options;
  
  const [resourceStatuses, setResourceStatuses] = useState<ResourceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(resources.length > 0);
  const { deviceType, isPortrait } = useDevice();
  
  // Inicializar monitor de red al montar el componente
  useEffect(() => {
    if (initMonitor) {
      initNetworkMonitor();
    }
  }, [initMonitor]);
  
  // Preparar recursos con sus URLs optimizadas
  useEffect(() => {
    if (!autoPreload || resources.length === 0) {
      return;
    }
    
    // Inicializar estado para cada recurso
    const initialStatuses = resources.map(url => ({
      url,
      status: 'loading' as const,
      optimizedUrl: getOptimizedUrl(url)
    }));
    
    setResourceStatuses(initialStatuses);
    setIsLoading(true);
    
    // Precargar recursos
    const optimizedUrls = initialStatuses.map(s => s.optimizedUrl || s.url);
    preloadResources(optimizedUrls).then(() => {
      // Marcar todos como cargados
      setResourceStatuses(prev => 
        prev.map(status => ({ ...status, status: 'loaded' as const }))
      );
      setIsLoading(false);
      
      if (onLoaded) {
        onLoaded();
      }
    });
  }, [resources, autoPreload, onLoaded]);
  
  // Función para optimizar URL según el dispositivo
  const getOptimizedUrl = (url: string): string => {
    // Determinar tipo de recurso por extensión
    const isImage = /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(url);
    const isAudio = /\.(mp3|wav|ogg|m4a)$/i.test(url);
    const type = isImage ? 'image' : isAudio ? 'audio' : 'other';
    
    // Obtener información del dispositivo
    const deviceInfo = {
      deviceType: deviceType,
      width: window.innerWidth
    };
    
    // Optimizar URL según tipo de dispositivo y orientación
    return getOptimizedResourceUrl(url, type, deviceInfo.deviceType, deviceInfo.width);
  };
  
  // Función para precargar recursos específicos bajo demanda
  const preloadSpecificResources = (urls: string[]): Promise<void> => {
    const optimizedUrls = urls.map(getOptimizedUrl);
    return preloadResources(optimizedUrls);
  };
  
  // Función para verificar si todos los recursos están cargados
  const areAllResourcesLoaded = (): boolean => {
    return resourceStatuses.every(r => r.status === 'loaded');
  };
  
  return {
    isLoading,
    resourceStatuses,
    preloadSpecificResources,
    getOptimizedUrl,
    areAllResourcesLoaded
  };
}

export default useResourceOptimizer;
