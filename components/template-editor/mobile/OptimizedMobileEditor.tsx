// Integration component for optimized mobile editor
"use client";

import React from 'react';
import { useMobileOptimizations } from './use-mobile-optimizations';
import { OptimizedRenderer, NetworkQualityIndicator } from './phase5-integration';
import { updateRenderEditableComponents } from './render-component-utils';
import { Invitation } from '@/types/invitation';

// Import styles
import './mobile-optimized.css';
import './network-optimization.css';

interface OptimizedMobileEditorProps {
  invitation: Invitation;
  onSave: (config: any) => Promise<void>;
  isSaving?: boolean;
  renderComponents: () => React.ReactNode;
  config: any;
  isEditMode: boolean;
  activeComponentId: string | null;
  pendingChanges: Record<string, any>;
  setActiveComponentId: (id: string | null) => void;
}

/**
 * Higher-order component that adds Phase 5 optimizations to the existing editor
 * This component wraps the rendering part of the MobileTemplateEditor with
 * our network-aware optimizations.
 */
const OptimizedMobileEditor: React.FC<OptimizedMobileEditorProps> = ({
  invitation,
  config,
  isEditMode,
  activeComponentId,
  pendingChanges,
  setActiveComponentId,
  renderComponents
}) => {
  // Use our optimization hook
  const { isResourcesLoading, networkQuality, retryResourceLoading } = 
    useMobileOptimizations(config);

  // Optimized rendering function
  const renderOptimizedComponents = () => {
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

  return (
    <>
      {/* Wrap original content with our optimized renderer */}
      <OptimizedRenderer
        isLoading={isResourcesLoading}
        onRetry={retryResourceLoading}
        config={config}
      >
        {/* Use either our optimized rendering or the original based on configuration */}
        {config?.enableOptimizedRendering ? renderOptimizedComponents() : renderComponents()}
      </OptimizedRenderer>

      {/* Network quality indicator */}
      <NetworkQualityIndicator quality={networkQuality} />
      
      {/* Resource loading indicator */}
      {isResourcesLoading && (
        <div className="resource-loading-indicator">
          <div className="spinner small" />
          <span className="loading-text">Optimizando recursos...</span>
        </div>
      )}
    </>
  );
};

export default OptimizedMobileEditor;
