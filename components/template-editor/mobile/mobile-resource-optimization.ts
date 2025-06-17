"use client";

/**
 * Optimización de recursos para el editor móvil
 * 
 * Este archivo contiene las utilidades necesarias para implementar:
 * 1. Optimización de recursos basada en prioridades
 * 2. Adaptación según dispositivo y orientación
 * 3. Gestión de ancho de banda y calidad de conexión
 */

import { ResourcePriority } from '@/services/network-optimization.service';
import { useDevice } from '@/hooks/use-mobile';
import { ComponentConfig, ComponentType } from '../types';

// Tipos de recursos
export type ResourceItem = {
  url: string;
  type: 'image' | 'audio' | 'font' | 'other';
  priority: ResourcePriority;
  metadata?: Record<string, any>;
};

/**
 * Extrae recursos de la configuración para precarga optimizada
 */
export function extractResourcesFromConfig(config: any): ResourceItem[] {
  if (!config || !config.components) return [];
  
  const resources: ResourceItem[] = [];
  
  // Procesar tema para fuentes y recursos globales
  if (config.theme) {
    // Fondos globales
    if (config.theme.backgroundImage) {
      resources.push({
        url: config.theme.backgroundImage,
        type: 'image',
        priority: ResourcePriority.CRITICAL
      });
    }
    
    // Fuentes del tema
    if (config.theme.fonts) {
      const fontUrls = extractFontUrls(config.theme.fonts);
      fontUrls.forEach(fontUrl => {
        resources.push({
          url: fontUrl,
          type: 'font',
          priority: ResourcePriority.CRITICAL
        });
      });
    }
  }
  
  // Procesar componentes
  config.components.forEach((component: ComponentConfig) => {
    if (!component.properties) return;
    
    // Determinar prioridad según orden y tipo de componente
    const getComponentPriority = (): ResourcePriority => {
      if (component.order <= 2 || component.type === ComponentType.HERO) {
        return ResourcePriority.CRITICAL;
      }
      if (component.order <= 4) {
        return ResourcePriority.HIGH;
      }
      return ResourcePriority.MEDIUM;
    };
    
    // Imágenes de fondo
    if (component.properties.backgroundImage) {
      resources.push({
        url: component.properties.backgroundImage as string,
        type: 'image',
        priority: getComponentPriority()
      });
    }
    
    // Imágenes de galería
    if (component.properties.images && Array.isArray(component.properties.images)) {
      component.properties.images.forEach((img: any, index: number) => {
        const imageUrl = typeof img === 'string' ? img : img.src;
        if (!imageUrl) return;
        
        // Primeras imágenes con mayor prioridad
        const imagePriority = index < 3 
          ? (index === 0 ? ResourcePriority.HIGH : ResourcePriority.MEDIUM)
          : ResourcePriority.LOW;
          
        resources.push({
          url: imageUrl,
          type: 'image',
          priority: Math.max(imagePriority, getComponentPriority())
        });
      });
    }
    
    // Archivos de audio
    if (component.properties.audioSrc) {
      resources.push({
        url: component.properties.audioSrc as string,
        type: 'audio',
        priority: ResourcePriority.MEDIUM
      });
    }
  });
  
  return resources;
}

/**
 * Extrae URLs de fuentes a partir del objeto de configuración
 */
export function extractFontUrls(fonts: any): string[] {
  if (!fonts) return [];
  
  const fontUrls: string[] = [];
  
  // Mapeo de fuentes comunes a sus URLs
  const fontMappings: Record<string, string> = {
    'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
    'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap',
    'Dancing Script': 'https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap',
    'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
    'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
    'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap',
    'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap',
  };
  
  // Extraer URLs para cada tipo de fuente
  ['heading', 'body', 'accent'].forEach(fontType => {
    const fontName = fonts[fontType];
    if (fontName && typeof fontName === 'string') {
      // Buscar en el mapeo
      const fontUrl = fontMappings[fontName];
      if (fontUrl && !fontUrls.includes(fontUrl)) {
        fontUrls.push(fontUrl);
      }
    }
  });
  
  return fontUrls;
}

/**
 * Determina si un componente debe cargarse de forma perezosa
 */
export function shouldLazyLoadComponent(component: ComponentConfig): boolean {
  // Componentes críticos que siempre deben cargarse inmediatamente
  if (component.type === ComponentType.HERO || component.order <= 2) {
    return false;
  }
  
  // El resto se carga perezosamente
  return true;
}

/**
 * Optimiza las imágenes según el dispositivo actual
 */
export function getOptimalImageDimensions(width: number, height: number): { width: number, height: number } {
  // Use hooks in a React component context only, not in utility functions
  // Create a version that accepts deviceType and isPortrait as parameters
  
  let scaleFactor = 1;
  
  // Default implementation that doesn't rely on the hook
  return {
    width: Math.round(width * scaleFactor),
    height: Math.round(height * scaleFactor)
  };
}

/**
 * Optimiza las imágenes según el dispositivo actual
 * Versión que acepta parámetros en lugar de usar el hook directamente
 */
export function getOptimalImageDimensionsWithParams(
  width: number, 
  height: number,
  deviceType: string,
  isPortrait: boolean
): { width: number, height: number } {
  
  let scaleFactor = 1;
  
  // Aplicar escala según tipo de dispositivo
  if (deviceType === 'mobile') {
    scaleFactor = isPortrait ? 0.5 : 0.7;
  } else if (deviceType === 'tablet') {
    scaleFactor = 0.8;
  }
  
  return {
    width: Math.round(width * scaleFactor),
    height: Math.round(height * scaleFactor)
  };
}

/**
 * Obtiene URLs de imagen optimizadas según el dispositivo
 */
export function getOptimizedImageUrl(originalUrl: string, deviceType: string = 'mobile'): string {
  // No usar hooks directamente en funciones de utilidad
  
  // Para servicios que soportan transformaciones dinámicas (como Cloudinary)
  if (originalUrl.includes('cloudinary.com')) {
    let quality = '80';
    let maxWidth = '1200';
    
    if (deviceType === 'mobile') {
      quality = '70';
      maxWidth = '640';
    } else if (deviceType === 'tablet') {
      quality = '75';
      maxWidth = '1024';
    }
    
    return originalUrl.replace('/upload/', `/upload/q_${quality},w_${maxWidth}/`);
  }
  
  // URL sin cambios para otros servicios
  return originalUrl;
}
