// Integration hook for Phase 5 optimizations
"use client";

import { useEffect, useState } from 'react';
import { extractResourcesFromConfig } from './mobile-resource-optimization';
import { initNetworkMonitor, preloadResourcesWithPriority, ResourcePriority } from '@/services/network-optimization.service';

/**
 * Hook to integrate Phase 5 optimizations with existing components
 */
export function useMobileOptimizations(config: any) {
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);
  const [networkQuality, setNetworkQuality] = useState<'slow' | 'medium' | 'fast'>('fast');
  const [isMonitorInitialized, setIsMonitorInitialized] = useState(false);

  // Initialize network monitor once
  useEffect(() => {
    if (!isMonitorInitialized) {
      initNetworkMonitor();
      setIsMonitorInitialized(true);
    }
  }, [isMonitorInitialized]);

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

  // Preload resources when config changes
  useEffect(() => {
    if (config) {
      setIsResourcesLoading(true);
      
      // Extract resources from config
      const resources = extractResourcesFromConfig(config);
      
      // Preload critical resources first
      const criticalResources = resources.filter(r => r.priority === ResourcePriority.CRITICAL);
      
      // Preload with priority
      preloadResourcesWithPriority(criticalResources);
      
      // Set a maximum loading time for better UX
      const timer = setTimeout(() => {
        setIsResourcesLoading(false);
      }, networkQuality === 'slow' ? 4000 : networkQuality === 'medium' ? 2500 : 1500);
      
      return () => clearTimeout(timer);
    }
  }, [config, networkQuality]);

  // Function to retry loading resources
  const retryResourceLoading = () => {
    if (config) {
      setIsResourcesLoading(true);
      const resources = extractResourcesFromConfig(config);
      preloadResourcesWithPriority(resources);
      
      // Set a maximum loading time
      setTimeout(() => setIsResourcesLoading(false), 2000);
    }
  };

  return {
    isResourcesLoading,
    networkQuality,
    retryResourceLoading
  };
}
