// Mobile optimization feature flag and integration module
"use client";

import { useEffect, useState } from 'react';

// Constants
export const MOBILE_OPTIMIZATION_VERSION = 'v5.0.0';
export const MOBILE_OPTIMIZATION_FEATURES = {
  NETWORK_AWARE: 'network_aware',
  RESOURCE_OPTIMIZATION: 'resource_optimization',
  RESPONSIVE_ADAPTATION: 'responsive_adaptation',
  LAZY_LOADING: 'lazy_loading',
  PERFORMANCE_MONITORING: 'performance_monitoring'
};

// Default config
const DEFAULT_FEATURES = {
  [MOBILE_OPTIMIZATION_FEATURES.NETWORK_AWARE]: true,
  [MOBILE_OPTIMIZATION_FEATURES.RESOURCE_OPTIMIZATION]: true, 
  [MOBILE_OPTIMIZATION_FEATURES.RESPONSIVE_ADAPTATION]: true,
  [MOBILE_OPTIMIZATION_FEATURES.LAZY_LOADING]: true,
  [MOBILE_OPTIMIZATION_FEATURES.PERFORMANCE_MONITORING]: true
};

/**
 * Feature flag system for mobile optimization features
 */
export function useMobileOptimizationFeatures() {
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [isEnabled, setIsEnabled] = useState(true);

  // Load feature configuration on mount
  useEffect(() => {
    try {
      // Check for saved configuration in localStorage
      const savedConfig = localStorage.getItem('mobile_optimization_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setFeatures(parsedConfig.features || DEFAULT_FEATURES);
        setIsEnabled(parsedConfig.enabled !== false); // Default to true if not specified
      }
    } catch (error) {
      console.error('Error loading mobile optimization config:', error);
    }
  }, []);

  // Function to enable/disable specific features
  const toggleFeature = (featureName: string, enabled: boolean) => {
    const updatedFeatures = { ...features, [featureName]: enabled };
    setFeatures(updatedFeatures);
    
    // Save to localStorage
    try {
      localStorage.setItem('mobile_optimization_config', JSON.stringify({
        version: MOBILE_OPTIMIZATION_VERSION,
        enabled: isEnabled,
        features: updatedFeatures
      }));
    } catch (error) {
      console.error('Error saving mobile optimization config:', error);
    }
  };

  // Function to enable/disable all optimizations
  const toggleOptimizations = (enabled: boolean) => {
    setIsEnabled(enabled);
    
    // Save to localStorage
    try {
      localStorage.setItem('mobile_optimization_config', JSON.stringify({
        version: MOBILE_OPTIMIZATION_VERSION,
        enabled,
        features
      }));
    } catch (error) {
      console.error('Error saving mobile optimization config:', error);
    }
  };

  // Check if a specific feature is enabled
  const isFeatureEnabled = (featureName: string) => {
    return isEnabled && features[featureName] === true;
  };

  return {
    isEnabled,
    features,
    toggleFeature,
    toggleOptimizations,
    isFeatureEnabled
  };
}
