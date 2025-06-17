// Phase 5 integration for MobileTemplateEditor
"use client";

import React, { useEffect } from 'react';
import { ResourcePriority, initNetworkMonitor, preloadResourcesWithPriority } from '@/services/network-optimization.service';
import { extractResourcesFromConfig } from './mobile-resource-optimization';
import { updateRenderEditableComponents } from './render-component-utils';
import useResourceOptimizer from '@/hooks/use-resource-optimizer';
import NetworkAwareContainer from '@/components/ui/network-aware-container';
import NetworkErrorHandler from '@/components/ui/network-error-handler';
import { WifiOff } from 'lucide-react';

/**
 * Integration module for Phase 5 optimizations
 * This provides functions to enhance MobileTemplateEditor without modifying it directly
 */

/**
 * Initialize network monitoring and resource optimization
 */
export function useNetworkOptimization(config: any) {
  // Initialize network monitor on mount
  useEffect(() => {
    initNetworkMonitor();
    return () => {
      // Cleanup handled internally by the service
    };
  }, []);

  // Use resource optimizer with type conversion for compatibility
  return useResourceOptimizer({
    resources: config ? extractResourcesFromConfig(config).map(item => item.url) : [], 
    autoPreload: true,
    initMonitor: true,
  });
}

/**
 * Optimized renderer component that wraps content with network-aware components
 */
export const OptimizedRenderer: React.FC<{
  children: React.ReactNode;
  isLoading: boolean;
  onRetry: () => void;
  config?: any;
}> = ({ children, isLoading, onRetry, config }) => {
  return (
    <NetworkAwareContainer
      fallback={
        isLoading ? (
          <div className="network-loading">
            <div className="spinner" />
            <p>Cargando recursos optimizados...</p>
          </div>
        ) : (
          <div className="network-error-fallback">
            <WifiOff size={40} />
            <h3>Problemas de conexión</h3>
            <p>No se pudieron cargar algunos recursos. Verifica tu conexión.</p>
          </div>
        )
      }
    >
      <NetworkErrorHandler
        onRetry={() => {
          if (config) {
            const resources = extractResourcesFromConfig(config);
            preloadResourcesWithPriority(resources);
          }
          onRetry();
        }}
      >
        {children}
      </NetworkErrorHandler>
    </NetworkAwareContainer>
  );
};

/**
 * Integration function for rendering components with optimizations
 */
export function useOptimizedRendering() {
  const [networkQuality, setNetworkQuality] = React.useState<'slow' | 'medium' | 'fast'>('fast');
  
  // Listen for network quality changes
  useEffect(() => {
    const handleNetworkQualityChange = (event: CustomEvent) => {
      setNetworkQuality(event.detail.quality);
    };
    
    window.addEventListener('network-quality-change', 
      handleNetworkQualityChange as EventListener);
    
    return () => {
      window.removeEventListener('network-quality-change', 
        handleNetworkQualityChange as EventListener);
    };
  }, []);
  
  return {
    networkQuality,
    renderOptimizedComponents: (
      config: any,
      isEditMode: boolean,
      activeComponentId: string | null,
      pendingChanges: Record<string, any>,
      isResourcesLoading: boolean,
      setActiveComponentId: (id: string | null) => void
    ) => {
      return updateRenderEditableComponents(
        config,
        isEditMode,
        activeComponentId,
        pendingChanges,
        isResourcesLoading,
        setActiveComponentId,
        networkQuality
      );
    }
  };
}

/**
 * Network quality indicator component
 */
export const NetworkQualityIndicator: React.FC<{
  quality: 'slow' | 'medium' | 'fast';
}> = ({ quality }) => {
  return (
    <div className={`network-quality-indicator ${quality}`}>
      <div className="network-dots">
        <span className="dot dot-1 active"></span>
        <span className={`dot dot-2 ${quality !== 'slow' ? 'active' : ''}`}></span>
        <span className={`dot dot-3 ${quality === 'fast' ? 'active' : ''}`}></span>
      </div>
      <span className="quality-text">
        {quality === 'fast' ? 'Conexión rápida' : 
         quality === 'medium' ? 'Conexión media' : 'Conexión lenta'}
      </span>
    </div>
  );
};
