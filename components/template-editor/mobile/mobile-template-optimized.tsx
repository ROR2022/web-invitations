// Mobile Template Editor with Phase 5 Optimizations
"use client";

import React, { useState, useEffect } from 'react';
import MobileTemplateEditor from './MobileTemplateEditor';
import { useMobileEditor } from './MobileEditorContext';
import { useDevice } from '@/hooks/use-mobile';
import { useProgressiveSaving } from '@/hooks/use-progressive-saving';
import { Invitation } from '@/types/invitation';
import { ComponentType } from '../types';
import { WifiOff } from 'lucide-react';

// Phase 5 Optimizations
import { ResourcePriority, initNetworkMonitor, preloadResourcesWithPriority } from '@/services/network-optimization.service';
import { extractResourcesFromConfig } from './mobile-resource-optimization';
import { updateRenderEditableComponents } from './render-component-utils';
import NetworkErrorHandler from '@/components/ui/network-error-handler';
import NetworkAwareContainer from '@/components/ui/network-aware-container';
import useResourceOptimizer from '@/hooks/use-resource-optimizer';

/**
 * Wrapper around MobileTemplateEditor that adds Phase 5 optimizations
 */
interface MobileTemplateEditorProps {
  invitation: Invitation;
  onSave: (config: any) => Promise<void>;
  isSaving?: boolean;
}

export const OptimizedMobileTemplateEditor: React.FC<MobileTemplateEditorProps> = ({
  invitation,
  onSave,
  isSaving: externalIsSaving = false
}) => {
  // Mobile Editor Context
  const {
    isEditMode,
    activeComponentId,
    pendingChanges,
    setActiveComponentId
  } = useMobileEditor();

  // Local state
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);
  const [networkQuality, setNetworkQuality] = useState<'slow' | 'medium' | 'fast'>('fast');

  // Device info
  const { deviceType, isMobile, isTablet } = useDevice();

  // Get default components based on package type
  // Simplified placeholder version
  const getDefaultComponents = React.useCallback((packageType: any) => {
    const baseComponents = [
      {
        id: 'hero-1',
        type: ComponentType.HERO,
        order: 1,
        visible: true,
        properties: {
          title: invitation?.config?.title || 'Nuestra Celebración',
          subtitle: 'Te invitamos a compartir este momento especial',
          backgroundImage: '',
        }
      }
    ];
    
    return baseComponents;
  }, [invitation?.config]);

  // Initialize config
  const initialConfig = React.useMemo(() => {
    if (invitation && invitation.config) {
      return {
        id: invitation.id,
        name: invitation.config.title || 'Invitación sin título',
        components: getDefaultComponents(invitation.packageType) as any,
        theme: {
          name: invitation.config.title,
          colors: {
            primary: invitation.config.theme?.primaryColor || '#9333ea',
            secondary: invitation.config.theme?.secondaryColor || '#6b21a8',
            background: '#ffffff',
            text: '#333333',
            accent: '#ffd700',
          },
          fonts: {
            heading: invitation.config.theme?.fontFamily || 'Playfair Display',
            body: 'Montserrat',
            accent: 'Dancing Script',
          }
        }
      };
    }
    return null;
  }, [invitation, getDefaultComponents]); // Add getDefaultComponents to dependency array

  // Progressive saving hook
  const {
    config,
    hasPendingChanges,
    isSaving: isInternalSaving
  } = useProgressiveSaving({
    invitationId: invitation.id,
    initialConfig,
    onSave
  });

  // Combined saving state
  const isSaving = externalIsSaving || isInternalSaving;

  // This declaration has been moved above the React.useMemo call

  // Initialize network monitor and resource preloading
  useEffect(() => {
    // Initialize network monitoring
    initNetworkMonitor();
    
    // Listen for network quality changes
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

  // Resource optimization with our hook
  const { isLoading: resourcesLoading } = useResourceOptimizer({
    resources: config ? extractResourcesFromConfig(config).map(item => item.url || String(item)) : [],
    autoPreload: true,
    initMonitor: true,
    onLoaded: () => setIsResourcesLoading(false)
  });

  // Update resource loading state
  useEffect(() => {
    if (resourcesLoading) {
      setIsResourcesLoading(true);
      // Set a maximum wait time for better UX
      const timer = setTimeout(() => {
        setIsResourcesLoading(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setIsResourcesLoading(false);
    }
  }, [resourcesLoading]);

  // Optimized rendering function that uses our utility
  const renderEditableComponents = () => {
    return updateRenderEditableComponents(
      config,
      isEditMode,
      activeComponentId,
      pendingChanges,
      isResourcesLoading,
      setActiveComponentId,
      networkQuality
    );
  };

  // Loading state
  if (!config) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin text-primary">Cargando...</div>
      </div>
    );
  }

  // Main render
  return (
    <div className="mobile-template-editor mobile-optimized">
      {/* Preview section with network error handling */}
      <div className="preview-section mobile-preview">
        <NetworkAwareContainer
          fallback={
            <div className="network-error-fallback">
              <WifiOff size={40} />
              <h3>Problemas de conexión</h3>
              <p>No se pudieron cargar algunos recursos. Verifica tu conexión.</p>
            </div>
          }
          errorHandlingLevel="comprehensive"
          lowBandwidthMode={networkQuality === 'slow'}
        >
          {isResourcesLoading ? (
            <div className="network-loading">
              <div className="spinner" />
              <p>Cargando recursos optimizados...</p>
            </div>
          ) : (
            <NetworkErrorHandler
              onRetry={() => {
                setIsResourcesLoading(true);
                if (config) {
                  const resources = extractResourcesFromConfig(config);
                  preloadResourcesWithPriority(resources);
                }
                setTimeout(() => setIsResourcesLoading(false), 1500);
              }}
            >
              {renderEditableComponents()}
            </NetworkErrorHandler>
          )}
        </NetworkAwareContainer>
      </div>
      
      {/* Resource loading indicator */}
      {isResourcesLoading && (
        <div className="resource-loading-indicator mobile-loading">
          <div className="spinner small" />
          <span className="loading-text">Optimizando recursos...</span>
        </div>
      )}
      
      {/* Network quality indicator */}
      {!isResourcesLoading && (
        <div className={`network-quality-indicator ${networkQuality}`}>
          <div className="network-dots">
            <span className="dot dot-1"></span>
            <span className="dot dot-2"></span>
            <span className={`dot dot-3 ${networkQuality !== 'slow' ? 'active' : ''}`}></span>
            <span className={`dot dot-4 ${networkQuality === 'fast' ? 'active' : ''}`}></span>
          </div>
          <span className="quality-text">
            {networkQuality === 'fast' ? 'Conexión rápida' : 
             networkQuality === 'medium' ? 'Conexión media' : 'Conexión lenta'}
          </span>
        </div>
      )}
    </div>
  );
};

export default OptimizedMobileTemplateEditor;
