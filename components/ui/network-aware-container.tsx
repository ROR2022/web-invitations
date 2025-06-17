"use client";

import React, { useEffect, useState } from 'react';
import { useDevice } from '@/hooks/use-mobile';
import useResourceOptimizer from '@/hooks/use-resource-optimizer';
import { AnimatePresence, motion } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import NetworkErrorHandler from './network-error-handler';

interface NetworkAwareContainerProps {
  children: React.ReactNode;
  resources?: string[];
  showConnectionStatus?: boolean;
  fallback?: React.ReactNode;
  offlineFallback?: React.ReactNode;
  lowBandwidthMode?: boolean;
  errorHandlingLevel?: 'basic' | 'comprehensive';
}

/**
 * Componente contenedor consciente de la red que optimiza la carga
 * de recursos y proporciona retroalimentación sobre el estado de la conexión
 */
const NetworkAwareContainer: React.FC<NetworkAwareContainerProps> = ({
  children,
  resources = [],
  showConnectionStatus = true,
  fallback,
  offlineFallback,
  lowBandwidthMode = false,
  errorHandlingLevel = 'basic',
}) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'slow' | 'medium' | 'fast'>('fast');
  const { deviceType, isPortrait } = useDevice();
  
  const { isLoading, areAllResourcesLoaded, preloadSpecificResources } = useResourceOptimizer({
    resources,
    autoPreload: true,
    initMonitor: true
  });
  
  // Retry loading resources
  const handleRetry = () => {
    if (resources.length > 0) {
      preloadSpecificResources(resources);
    }
  };
  
  // Monitorear estado de la conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Monitorear cambios en la conexión
    if (typeof navigator !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Obtener tipo de conexión si está disponible
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        setConnectionType(conn?.effectiveType || null);
        
        // Determinar calidad de conexión
        if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') {
          setConnectionQuality('slow');
        } else if (conn?.effectiveType === '3g') {
          setConnectionQuality('medium');
        } else {
          setConnectionQuality('fast');
        }
        
        // Monitorear cambios en el tipo de conexión
        const handleConnectionChange = () => {
          setConnectionType(conn?.effectiveType || null);
          
          // Actualizar calidad de conexión
          if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') {
            setConnectionQuality('slow');
          } else if (conn?.effectiveType === '3g') {
            setConnectionQuality('medium');
          } else {
            setConnectionQuality('fast');
          }
        };
        
        conn?.addEventListener('change', handleConnectionChange);
        return () => {
          conn?.removeEventListener('change', handleConnectionChange);
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Determinar si estamos en conexión lenta
  const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g';
  
  // Aplicar manejo de errores avanzado si se solicita
  if (errorHandlingLevel === 'comprehensive') {
    return (
      <NetworkErrorHandler
        resourceUrls={resources}
        onRetry={handleRetry}
        fallbackContent={offlineFallback}
      >
        {isLoading && fallback ? fallback : children}
      </NetworkErrorHandler>
    );
  }
  
  // Renderizar según estado de conexión y carga (manejo básico)
  if (!isOnline && offlineFallback) {
    return (
      <>
        {offlineFallback}
        {showConnectionStatus && (
          <div className="network-status-indicator offline">
            <WifiOff size={16} />
            <span>Sin conexión</span>
          </div>
        )}
      </>
    );
  }
  
  // Mostrar fallback durante la carga
  if (isLoading && fallback) {
    return (
      <>
        {fallback}
        {showConnectionStatus && isSlowConnection && (
          <div className="network-status-indicator slow">
            <AlertTriangle size={16} />
            <span>Conexión lenta</span>
          </div>
        )}
      </>
    );
  }
  
  // Renderizar contenido principal con indicador de conexión si es necesario
  return (
    <>
      {children}
      
      {showConnectionStatus && (
        <AnimatePresence>
          {isSlowConnection && (
            <motion.div 
              className="network-status-indicator slow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <AlertTriangle size={16} />
              <span>Conexión lenta - Modo de bajo ancho de banda activo</span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default NetworkAwareContainer;
