import { useCallback } from 'react';
import { optimizeImageForMobile } from '@/services/resource-cache.service';

/**
 * Custom hook for optimizing images in template components
 * Returns functions to optimize individual images and entire components
 */
export function useImageOptimizer() {
  /**
   * Optimize a single image URL for mobile devices
   */
  const optimizeImage = useCallback(async (imageUrl: string): Promise<string> => {
    if (!imageUrl) return '';
    
    try {
      // Solo optimizar si es una URL de imagen
      if (imageUrl.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i)) {
        // Determinar el ancho máximo según el tipo de dispositivo
        const maxWidth = 800; // Para móviles
        
        // Optimizar y retornar la URL optimizada
        return await optimizeImageForMobile(imageUrl, maxWidth);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error al optimizar imagen:', error);
      return imageUrl;
    }
  }, []);

  /**
   * Optimize all images within a component
   */
  const optimizeComponentImages = useCallback(async (component: any) => {
    const props = component.properties;
    const optimizedProps: any = { ...props };
    
    // Optimizar imagen de fondo
    if (props.backgroundImage) {
      optimizedProps.backgroundImage = await optimizeImage(props.backgroundImage);
    }
    
    // Optimizar imagen principal
    if (props.image) {
      optimizedProps.image = await optimizeImage(props.image);
    }
    
    // Optimizar galerías de imágenes
    if (props.images && Array.isArray(props.images)) {
      optimizedProps.images = await Promise.all(
        props.images.map((img: string) => optimizeImage(img))
      );
    }
    
    // Optimizar galerías de imágenes de fondo
    if (props.backgroundImages && Array.isArray(props.backgroundImages)) {
      optimizedProps.backgroundImages = await Promise.all(
        props.backgroundImages.map((img: string) => optimizeImage(img))
      );
    }
    
    return {
      ...component,
      properties: optimizedProps
    };
  }, [optimizeImage]);

  return {
    optimizeImage,
    optimizeComponentImages
  };
}
