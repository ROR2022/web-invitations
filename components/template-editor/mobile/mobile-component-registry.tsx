// Component registry for mobile components
import React from 'react';
import { ComponentType } from '../types';

// Default placeholder component
const DefaultComponent: React.FC = () => <div>Component not implemented</div>;

// Map component types to their implementations
// This should be populated with actual component implementations
const componentRegistry: Record<ComponentType, React.ComponentType<any>> = {
  [ComponentType.HERO]: DefaultComponent,
  [ComponentType.EVENT_DETAILS]: DefaultComponent,
  [ComponentType.COUNTDOWN]: DefaultComponent,
  [ComponentType.GALLERY]: DefaultComponent,
  [ComponentType.ATTENDANCE]: DefaultComponent,
  [ComponentType.MUSIC_PLAYER]: DefaultComponent,
  [ComponentType.THANK_YOU]: DefaultComponent,
  [ComponentType.ACCOMMODATION]: DefaultComponent,
  [ComponentType.ITINERARY]: DefaultComponent,
  [ComponentType.GIFT_OPTIONS]: DefaultComponent,
};

/**
 * Get the mobile component implementation for a given component type
 */
export function getMobileComponentByType(type: ComponentType): React.ComponentType<any> {
  return componentRegistry[type] || DefaultComponent;
}

// Register a component implementation
export function registerMobileComponent(type: ComponentType, component: React.ComponentType<any>): void {
  componentRegistry[type] = component;
}
