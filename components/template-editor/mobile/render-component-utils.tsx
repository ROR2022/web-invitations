import React from 'react';
import { withMobileEditing } from './withMobileEditing';
import { shouldLazyLoadComponent } from './mobile-resource-optimization';
import { getShouldOptimizeComponent } from './network-render-utils';
import LazyRender from '@/components/ui/lazy-render';
import OptimizedTransition from '@/components/ui/optimized-transition';
import { EditableMobileComponent } from './MobileComponentWrapper';
import { ReactElement } from 'react';

// Helper function to update renderEditableComponents to use the new network optimization
export function updateRenderEditableComponents(config: any, isEditMode: boolean, activeComponentId: string | null, 
    pendingChanges: Record<string, any>, isResourcesLoading: boolean, 
    setActiveComponentId: (id: string | null) => void, 
    networkQuality: 'slow' | 'medium' | 'fast' = 'fast'): ReactElement | null {
  
  if (!config || !config.components || config.components.length === 0) {
    return null;
  }
  
  // Sort components by order
  const sortedComponents = [...config.components].sort((a: any, b: any) => a.order - b.order);
  
  return (
    <>
      {sortedComponents.map((component: any) => {
        if (!component.visible) return null;
        
        // Determine if component should be lazy loaded using our optimized helper
        const shouldLazyLoad = shouldLazyLoadComponent(component);
        const shouldOptimize = getShouldOptimizeComponent(
          component, 
          networkQuality,
          networkQuality === 'slow' // Enable low bandwidth mode on slow connections
        );
        
        // Create editable component with necessary optimizations
        const componentElement = (
          <EditableMobileComponent
            key={`component-content-${component.id}`}
            id={component.id}
            component={component}
            isEditMode={isEditMode}
            isSelected={activeComponentId === component.id}
            onSelect={() => setActiveComponentId(component.id)}
            pendingChanges={pendingChanges[component.id] || {}}
          />
        );
        
        // Apply different rendering strategies based on criticality
        if (!shouldLazyLoad) {
          // Critical components render immediately
          return (
            <div key={component.id} className="editable-component-wrapper">
              {componentElement}
            </div>
          );
        } else {
          // Non-critical components use lazy loading
          return (
            <LazyRender 
              key={component.id}
              height="300px"
              threshold={0.1}
              rootMargin="200px 0px"
              triggerOnce={true}
            >
              <OptimizedTransition
                isVisible={!isResourcesLoading}
                type="fade"
                duration={0.3}
                delay={0.1}
              >
                {componentElement}
              </OptimizedTransition>
            </LazyRender>
          );
        }
      })}
    </>
  );
}
