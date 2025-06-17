"use client";

import { getResourceFromCache, cacheResource } from './resource-cache.service';
import { mapResourceTypeForCache } from './resource-type-mapper';

/**
 * Servicio para optimización de red y carga progresiva
 */

// Prioridades para diferentes tipos de recursos
enum ResourcePriority {
  CRITICAL = 1,    // Recursos esenciales (vista inicial, fuentes críticas)
  HIGH = 2,        // Recursos importantes (imágenes principales)
  MEDIUM = 3,      // Recursos secundarios (imágenes de segundo nivel)
  LOW = 4,         // Recursos opcionales (contenido adicional)
  LAZY = 5         // Recursos que pueden cargarse muy tarde
}

// Tipos de recursos
interface Resource {
  url: string;
  type: 'image' | 'audio' | 'font' | 'json' | 'other';
  priority: ResourcePriority;
  metadata?: Record<string, any>;
}

// Cola de recursos por prioridad
const resourceQueue: Map<ResourcePriority, Resource[]> = new Map();

// Estado de la conexión
let isOnline = true;
let connectionType: string | null = null;
let effectiveBandwidth: number | null = null;

/**
 * Inicializar el monitor de conexión
 */
export const initNetworkMonitor = (): void => {
  if (typeof navigator === 'undefined') return;
  
  // Verificar el estado de la conexión
  isOnline = navigator.onLine;
  
  // Obtener información sobre el tipo de conexión si está disponible
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    connectionType = conn?.effectiveType || null;
    effectiveBandwidth = conn?.downlink || null;
    
    // Suscribirse a cambios en la conexión
    conn?.addEventListener('change', updateConnectionInfo);
  }
  
  // Suscribirse a eventos de conexión
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
};

/**
 * Limpiar el monitor de conexión
 */
export const cleanupNetworkMonitor = (): void => {
  if (typeof navigator === 'undefined') return;
  
  // Limpiar suscripciones
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    conn?.removeEventListener('change', updateConnectionInfo);
  }
  
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
};

/**
 * Actualizar información de conexión
 */
const updateConnectionInfo = () => {
  if (typeof navigator === 'undefined') return;
  
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    connectionType = conn?.effectiveType || null;
    effectiveBandwidth = conn?.downlink || null;
    
    // Ajustar estrategia de carga según tipo de conexión
    adjustLoadingStrategy();
  }
};

/**
 * Manejar evento de conexión
 */
const handleOnline = () => {
  isOnline = true;
  
  // Continuar cargando recursos en cola
  processPendingResources();
};

/**
 * Manejar evento de desconexión
 */
const handleOffline = () => {
  isOnline = false;
};

/**
 * Ajustar estrategia de carga según condiciones de red
 */
const adjustLoadingStrategy = () => {
  if (!connectionType) return;
  
  // Definir estrategia según tipo de conexión
  switch (connectionType) {
    case 'slow-2g':
    case '2g':
      // Conexión muy lenta, cargar solo recursos críticos
      setMaxConcurrentLoads(1);
      break;
    case '3g':
      // Conexión moderada, cargar recursos críticos y de alta prioridad
      setMaxConcurrentLoads(2);
      break;
    case '4g':
    default:
      // Buena conexión, cargar normalmente
      setMaxConcurrentLoads(4);
      break;
  }
};

// Configuración de carga
let maxConcurrentLoads = 3;
let currentLoads = 0;

/**
 * Establecer máximo de cargas concurrentes
 */
const setMaxConcurrentLoads = (max: number): void => {
  maxConcurrentLoads = max;
};

/**
 * Agregar recurso a la cola de carga
 */
export const queueResource = (resource: Resource): void => {
  // Obtener la cola para esta prioridad o crear una nueva
  const priorityQueue = resourceQueue.get(resource.priority) || [];
  
  // Verificar si el recurso ya está en la cola
  const exists = priorityQueue.some(r => r.url === resource.url);
  if (!exists) {
    priorityQueue.push(resource);
    resourceQueue.set(resource.priority, priorityQueue);
  }
  
  // Procesar recursos si es posible
  processPendingResources();
};

/**
 * Procesar recursos pendientes
 */
const processPendingResources = async (): Promise<void> => {
  if (!isOnline || currentLoads >= maxConcurrentLoads) return;
  
  // Obtener recursos por orden de prioridad
  for (let priority = ResourcePriority.CRITICAL; priority <= ResourcePriority.LAZY; priority++) {
    const resources = resourceQueue.get(priority);
    
    if (resources && resources.length > 0) {
      // Obtener el próximo recurso
      const resource = resources.shift();
      resourceQueue.set(priority, resources);
      
      if (resource) {
        // Incrementar contador de cargas
        currentLoads++;
        
        try {
          // Verificar si ya está en caché
          const cachedResource = await getResourceFromCache(resource.url);
          
          if (!cachedResource) {
            // Cargar y cachear el recurso
            await cacheResource(resource.url, mapResourceTypeForCache(resource.type));
          }
        } catch (error) {
          console.error(`Error al cargar recurso ${resource.url}:`, error);
        } finally {
          // Decrementar contador y procesar más recursos
          currentLoads--;
          processPendingResources();
        }
      }
    }
  }
};

/**
 * Precargar recursos con prioridades
 */
export const preloadResourcesWithPriority = (resources: Resource[]): void => {
  // Agregar cada recurso a la cola con su prioridad
  resources.forEach(resource => {
    queueResource(resource);
  });
};

/**
 * Optimizar tamaño de transferencia adaptando recursos según el dispositivo
 */
export const getOptimizedResourceUrl = (
  originalUrl: string, 
  type: 'image' | 'audio' | 'other',
  deviceType?: string,
  deviceWidth?: number
): string => {
  // Si no hay URL o no estamos en el cliente, devolver la original
  if (!originalUrl || typeof window === 'undefined') return originalUrl;
  
  // Para imágenes, adaptar según el dispositivo
  if (type === 'image') {
    // Determinar el tipo de dispositivo si no se proporcionó
    let currentDeviceType = deviceType;
    let currentWidth = deviceWidth;
    
    if (!currentDeviceType || !currentWidth) {
      // Valores por defecto basados en el ancho de la ventana
      currentWidth = window.innerWidth;
      if (currentWidth < 640) {
        currentDeviceType = 'mobile';
      } else if (currentWidth < 1024) {
        currentDeviceType = 'tablet';
      } else {
        currentDeviceType = 'desktop';
      }
    }
    
    // Si es una URL de imagen de un CDN que soporta parámetros de tamaño
    if (originalUrl.includes('cloudinary.com')) {
      // Ancho óptimo según dispositivo
      let optimalWidth = 1200; // Valor por defecto para escritorio
      
      if (currentDeviceType === 'mobile') {
        optimalWidth = 640;
      } else if (currentDeviceType === 'tablet') {
        optimalWidth = 1024;
      }
      
      // Insertar parámetros de transformación para Cloudinary
      return originalUrl.replace('/upload/', `/upload/w_${optimalWidth},q_auto,f_auto/`);
    }
    
    // Para otros CDNs o servidores de imágenes, implementar lógica similar
  }
  
  // Para audio, podríamos adaptar la calidad según el dispositivo
  if (type === 'audio') {
    // Implementar lógica para optimizar audio si es necesario
  }
  
  // Por defecto, devolver la URL original
  return originalUrl;
};

// Inicializar el monitor de red al cargar este módulo
if (typeof window !== 'undefined') {
  initNetworkMonitor();
}

// Exportar tipos para uso externo
export type { Resource };
export { ResourcePriority };
