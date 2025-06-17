"use client";

/**
 * Servicio para gestionar recursos (imágenes, audio, etc.) con optimización para móviles
 */

// Constantes para cache
const RESOURCE_CACHE_PREFIX = 'resource_cache_';
const IMAGE_CACHE_PREFIX = 'image_cache_';
const AUDIO_CACHE_PREFIX = 'audio_cache_';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB en bytes (límite aproximado)

// Tipos
interface ResourceMetadata {
  url: string;
  type: 'image' | 'audio' | 'other';
  timestamp: number;
  size: number;
  localUrl?: string;
}

/**
 * Inicializar el sistema de caché
 */
export const initResourceCache = async (): Promise<void> => {
  try {
    if ('caches' in window) {
      await caches.open('resource-cache');
      console.log('Cache de recursos inicializado');
    }
  } catch (error) {
    console.error('Error al inicializar cache:', error);
  }
};

/**
 * Guardar un recurso en caché
 */
export const cacheResource = async (url: string, type: 'image' | 'audio' | 'other'): Promise<string | null> => {
  try {
    if (!url) return null;
    
    // Usar Cache API si está disponible
    if ('caches' in window) {
      const cache = await caches.open('resource-cache');
      const response = await fetch(url, { mode: 'no-cors' });
      await cache.put(url, response.clone());
      
      // Guardar metadata
      const contentLength = response.headers.get('content-length');
      const size = contentLength ? parseInt(contentLength, 10) : 0;
      
      const metadata: ResourceMetadata = {
        url,
        type,
        timestamp: Date.now(),
        size,
      };
      
      const prefix = type === 'image' ? IMAGE_CACHE_PREFIX : 
                    type === 'audio' ? AUDIO_CACHE_PREFIX : 
                    RESOURCE_CACHE_PREFIX;
      
      localStorage.setItem(`${prefix}${btoa(url)}`, JSON.stringify(metadata));
      
      return url;
    }
    
    // Fallback para navegadores sin Cache API
    return url;
  } catch (error) {
    console.error('Error al cachear recurso:', error);
    return url; // Devolver URL original en caso de error
  }
};

/**
 * Obtener un recurso desde la caché
 */
export const getResourceFromCache = async (url: string): Promise<Response | null> => {
  try {
    if (!url || !('caches' in window)) return null;
    
    const cache = await caches.open('resource-cache');
    const cachedResponse = await cache.match(url);
    
    return cachedResponse || null;
  } catch (error) {
    console.error('Error al obtener recurso de caché:', error);
    return null;
  }
};

/**
 * Precargar una lista de recursos
 */
export const preloadResources = async (urls: string[]): Promise<void> => {
  try {
    const imageUrls = urls.filter(url => 
      url.endsWith('.jpg') || url.endsWith('.jpeg') || 
      url.endsWith('.png') || url.endsWith('.webp') ||
      url.endsWith('.gif') || url.endsWith('.svg')
    );
    
    const audioUrls = urls.filter(url => 
      url.endsWith('.mp3') || url.endsWith('.wav') || 
      url.endsWith('.ogg') || url.endsWith('.m4a')
    );
    
    const otherUrls = urls.filter(url => 
      !imageUrls.includes(url) && !audioUrls.includes(url)
    );
    
    // Precargar imágenes
    const imagePromises = imageUrls.map(url => cacheResource(url, 'image'));
    
    // Precargar audio
    const audioPromises = audioUrls.map(url => cacheResource(url, 'audio'));
    
    // Precargar otros recursos
    const otherPromises = otherUrls.map(url => cacheResource(url, 'other'));
    
    // Esperar a que todas las precargas se completen
    await Promise.all([...imagePromises, ...audioPromises, ...otherPromises]);
    
    console.log(`Precargados: ${imageUrls.length} imágenes, ${audioUrls.length} audios, ${otherUrls.length} otros`);
  } catch (error) {
    console.error('Error al precargar recursos:', error);
  }
};

/**
 * Limpiar caché de recursos antiguos o excesivos
 */
export const cleanResourceCache = async (): Promise<void> => {
  try {
    // Obtener todos los metadatos de caché
    const allMetadata: ResourceMetadata[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith(IMAGE_CACHE_PREFIX) || 
        key.startsWith(AUDIO_CACHE_PREFIX) || 
        key.startsWith(RESOURCE_CACHE_PREFIX)
      )) {
        try {
          const metadata = JSON.parse(localStorage.getItem(key) || '{}') as ResourceMetadata;
          allMetadata.push(metadata);
        } catch (e) {
          console.error('Error al parsear metadata:', e);
        }
      }
    }
    
    // Ordenar por antigüedad (más antiguos primero)
    allMetadata.sort((a, b) => a.timestamp - b.timestamp);
    
    // Calcular tamaño total
    const totalSize = allMetadata.reduce((sum, item) => sum + item.size, 0);
    
    // Si excedemos el tamaño máximo o hay recursos muy antiguos, eliminarlos
    if (totalSize > MAX_CACHE_SIZE) {
      const cache = await caches.open('resource-cache');
      
      let sizeToFree = totalSize - MAX_CACHE_SIZE;
      let freedSize = 0;
      
      for (const metadata of allMetadata) {
        if (freedSize >= sizeToFree && 
            Date.now() - metadata.timestamp < MAX_CACHE_AGE) {
          break;
        }
        
        // Eliminar de Cache API
        await cache.delete(metadata.url);
        
        // Eliminar metadata
        const prefix = metadata.type === 'image' ? IMAGE_CACHE_PREFIX : 
                      metadata.type === 'audio' ? AUDIO_CACHE_PREFIX : 
                      RESOURCE_CACHE_PREFIX;
        
        localStorage.removeItem(`${prefix}${btoa(metadata.url)}`);
        
        freedSize += metadata.size;
      }
      
      console.log(`Caché limpiado: ${freedSize} bytes liberados`);
    }
  } catch (error) {
    console.error('Error al limpiar caché:', error);
  }
};

/**
 * Optimizar una imagen para móviles
 */
export const optimizeImageForMobile = async (imageUrl: string, maxWidth: number = 800): Promise<string> => {
  try {
    // Verificar si la imagen ya está en caché
    const cachedResponse = await getResourceFromCache(imageUrl);
    if (cachedResponse) {
      return imageUrl;
    }
    
    // Si estamos en un entorno que soporta fetch y Canvas
    if (typeof window !== 'undefined' && 'fetch' in window && 'HTMLCanvasElement' in window) {
      // Obtener la imagen
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Crear una imagen para obtener dimensiones
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          // Si la imagen ya es pequeña, no optimizar
          if (img.width <= maxWidth) {
            resolve(imageUrl);
            return;
          }
          
          // Calcular nueva altura manteniendo la proporción
          const ratio = img.height / img.width;
          const newWidth = maxWidth;
          const newHeight = Math.round(newWidth * ratio);
          
          // Crear canvas para redimensionar
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Dibujar imagen redimensionada
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(imageUrl);
            return;
          }
          
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Convertir a WebP si es posible, o JPG con calidad reducida
          const optimizedUrl = canvas.toDataURL('image/webp', 0.8) || 
                              canvas.toDataURL('image/jpeg', 0.8);
          
          // Guardar en caché
          cacheResource(optimizedUrl, 'image');
          
          resolve(optimizedUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Error al cargar la imagen para optimizar'));
        };
        
        img.src = URL.createObjectURL(blob);
      });
    }
    
    // Fallback si no podemos optimizar
    return imageUrl;
  } catch (error) {
    console.error('Error al optimizar imagen:', error);
    return imageUrl;
  }
};

// Inicializar el sistema de caché cuando se importa el módulo
if (typeof window !== 'undefined') {
  initResourceCache().then(() => {
    // Limpiar caché antigua al iniciar
    cleanResourceCache();
  });
}
