"use client";

import React, { useState, useEffect, useRef } from 'react';

interface UseConditionalRenderOptions {
  threshold?: number;       // Valor entre 0 y 1 para el umbral de visibilidad
  rootMargin?: string;      // Margen para el área de detección
  triggerOnce?: boolean;    // Si solo debe activarse una vez
  skip?: boolean;           // Para deshabilitar el observador
}

/**
 * Hook personalizado para renderizado condicional basado en visibilidad
 * Utiliza Intersection Observer API para determinar si un elemento está visible
 */
export function useConditionalRender(options: UseConditionalRenderOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    skip = false,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Efecto para configurar y limpiar el observador
  useEffect(() => {
    if (skip || (triggerOnce && hasBeenVisible)) {
      return;
    }

    const currentRef = ref.current;
    if (!currentRef) return;

    // Destruir observador existente
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Crear nuevo observador
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const newIsVisible = entry.isIntersecting;
        
        setIsVisible(newIsVisible);
        
        if (newIsVisible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
        
        // Desconectar después de la primera detección si triggerOnce es true
        if (newIsVisible && triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, skip, hasBeenVisible]);

  // Retornar el estado y la referencia
  return {
    ref,                     // Referencia para adjuntar al elemento a observar
    isVisible,               // Si el elemento está actualmente visible
    hasBeenVisible,          // Si el elemento ha sido visible alguna vez
    setVisibilityManually: setIsVisible  // Para controlar manualmente la visibilidad
  };
}

/**
 * Componente de orden superior (HOC) para renderizado condicional
 */
export function withConditionalRender<P extends object>(
  Component: React.ComponentType<P>,
  options: UseConditionalRenderOptions = {}
) {
  return function ConditionalComponent(props: P) {
    const { ref, isVisible, hasBeenVisible } = useConditionalRender(options);
    
    // Si triggerOnce es true, renderizar si ha sido visible alguna vez
    // De lo contrario, renderizar solo si está actualmente visible
    const shouldRender = options.triggerOnce ? hasBeenVisible : isVisible;
    
    // Placeholder mientras no es visible
    const Placeholder = () => (
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          height: '100px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
        }}
      >
        <div className="lazy-loading-placeholder"></div>
      </div>
    );
    
    if (!shouldRender) {
      return <Placeholder />;
    }
    
    return <Component {...props} />;
  };
}

/**
 * Hook para lazy loading de imágenes y recursos
 */
export function useLazyResource<T>(
  loader: () => Promise<T>,
  dependencies: any[] = []
) {
  const [resource, setResource] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { ref, isVisible, hasBeenVisible } = useConditionalRender({ triggerOnce: true });
  
  useEffect(() => {
    if (!hasBeenVisible) return;
    
    let isMounted = true;
    setIsLoading(true);
    
    loader()
      .then((result) => {
        if (isMounted) {
          setResource(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, [hasBeenVisible, ...dependencies]);
  
  return {
    ref,
    resource,
    isLoading,
    error,
    hasLoaded: !!resource
  };
}

export default {
  useConditionalRender,
  withConditionalRender,
  useLazyResource
};
