"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
  onRetry?: () => void;
  resourceUrls?: string[];
  fallbackContent?: React.ReactNode;
}

/**
 * Comprehensive error handling component for network issues
 * Provides fallback UI and recovery mechanisms for network errors
 */
const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({
  children,
  onRetry,
  resourceUrls = [],
  fallbackContent
}) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [failedResources, setFailedResources] = useState<Record<string, string>>({});
  const [hasRecoveryAttempted, setHasRecoveryAttempted] = useState(false);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  
  // Handle retry action - wrapped in useCallback to fix dependency issues
  const handleRetry = useCallback(() => {
    setHasRecoveryAttempted(true);
    setFailedResources({});
    
    // Call custom retry handler if provided
    if (onRetry) {
      onRetry();
    }
    
    // Force refresh of failed resources
    resourceUrls.forEach(url => {
      const timestamp = new Date().getTime();
      const cacheBuster = `${url}${url.includes('?') ? '&' : '?'}_cb=${timestamp}`;
      const img = new Image();
      img.src = cacheBuster;
    });
  }, [onRetry, resourceUrls]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto retry when coming back online
      if (Object.keys(failedResources).length > 0) {
        handleRetry();
      }
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection type if available
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setConnectionType(conn?.effectiveType || null);
      
      const handleConnectionChange = () => {
        setConnectionType(conn?.effectiveType || null);
      };
      
      conn?.addEventListener('change', handleConnectionChange);
      return () => {
        conn?.removeEventListener('change', handleConnectionChange);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [failedResources, handleRetry]);

  // Track failed resource loads
  useEffect(() => {
    const trackResourceErrors = () => {
      resourceUrls.forEach(url => {
        const img = new Image();
        img.onerror = () => {
          setFailedResources(prev => ({
            ...prev,
            [url]: 'Failed to load'
          }));
        };
        img.src = url;
      });
    };
    
    if (isOnline && resourceUrls.length > 0) {
      trackResourceErrors();
    }
  }, [resourceUrls, isOnline]);

  const hasNetworkIssues = !isOnline || Object.keys(failedResources).length > 0;
  const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g';

  if (hasNetworkIssues) {
    return (
      <div className="network-error-container">
        <div className="network-error-content">
          {!isOnline ? (
            <>
              <WifiOff className="network-error-icon" />
              <h3>Sin conexión</h3>
              <p>No se pudo conectar al servidor. Verifica tu conexión a internet.</p>
            </>
          ) : (
            <>
              <AlertTriangle className="network-error-icon" />
              <h3>Problema de red</h3>
              <p>Algunos recursos no pudieron cargarse correctamente.</p>
              <div className="failed-resources-info">
                {Object.keys(failedResources).length > 3 ? (
                  <p>No se pudieron cargar {Object.keys(failedResources).length} recursos</p>
                ) : (
                  <ul>
                    {Object.keys(failedResources).map(url => (
                      <li key={url}>{url.split('/').pop()}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
          
          <button 
            onClick={handleRetry} 
            className="retry-button"
            disabled={!isOnline}
          >
            <RefreshCw className="mr-2" size={16} />
            Reintentar
          </button>
          
          {fallbackContent && hasRecoveryAttempted && (
            <div className="fallback-content-container">
              {fallbackContent}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show warning for slow connections
  if (isSlowConnection) {
    return (
      <>
        {children}
        <div className="slow-connection-warning">
          <AlertTriangle size={16} />
          <span>Conexión lenta detectada. El rendimiento puede verse afectado.</span>
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default NetworkErrorHandler;
