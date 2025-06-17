// Utilities for component rendering based on network status
import { ResourcePriority } from '@/services/network-optimization.service';
import { ComponentConfig, ComponentType } from '../types';

// Helper function to determine which components need to be optimized
export function getShouldOptimizeComponent(component: ComponentConfig, 
    networkQuality: 'slow' | 'medium' | 'fast' = 'fast',
    isLowBandwidth: boolean = false): boolean {
  // In low bandwidth mode, optimize all non-critical components
  if (isLowBandwidth && !isCriticalComponent(component)) {
    return true;
  }
  
  // On slow networks, optimize even more components
  if (networkQuality === 'slow') {
    return component.type !== ComponentType.HERO;
  }
  
  // Default optimization strategy
  return component.order > 3 && component.type !== ComponentType.HERO;
}

// Helper to identify critical components
export function isCriticalComponent(component: ComponentConfig): boolean {
  return component.type === ComponentType.HERO || 
         component.order <= 2;
}

// Helper to reduce image quality based on network conditions
export function getImageQualityForNetwork(
    networkQuality: 'slow' | 'medium' | 'fast', 
    deviceType: 'mobile' | 'tablet' | 'desktop'): number {
  // Base quality percentage
  let quality = 80;
  
  // Adjust for network
  if (networkQuality === 'slow') {
    quality -= 20;
  } else if (networkQuality === 'medium') {
    quality -= 10;
  }
  
  // Adjust for device
  if (deviceType === 'mobile') {
    quality -= 5;
  }
  
  // Ensure quality remains in reasonable range
  return Math.min(90, Math.max(40, quality));
}
