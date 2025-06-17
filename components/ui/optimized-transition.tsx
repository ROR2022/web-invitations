"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';

interface OptimizedTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  type?: 'fade' | 'slide' | 'scale' | 'slide-fade';
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  motionProps?: MotionProps;
  disableWhileInvisible?: boolean;
}

/**
 * Componente para optimizar transiciones y animaciones en dispositivos móviles
 */
const OptimizedTransition: React.FC<OptimizedTransitionProps> = ({
  children,
  isVisible,
  type = 'fade',
  duration = 0.3,
  delay = 0,
  className = '',
  style,
  motionProps = {},
  disableWhileInvisible = true,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const [width, setWidth] = useState<number | 'auto'>('auto');
  const [shouldRender, setShouldRender] = useState(isVisible);

  // Medir las dimensiones del contenido para evitar saltos durante animaciones
  useEffect(() => {
    if (contentRef.current && isVisible) {
      setHeight(contentRef.current.offsetHeight);
      setWidth(contentRef.current.offsetWidth);
    }
  }, [isVisible, children]);

  // Controlar si se debe renderizar el contenido
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else if (disableWhileInvisible) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, disableWhileInvisible, duration]);

  // Configurar variantes de animación según el tipo
  const variants = {
    fade: {
      visible: { opacity: 1, transition: { duration, delay } },
      hidden: { opacity: 0, transition: { duration } }
    },
    slide: {
      visible: { x: 0, transition: { duration, delay } },
      hidden: { x: -20, transition: { duration } }
    },
    scale: {
      visible: { scale: 1, opacity: 1, transition: { duration, delay } },
      hidden: { scale: 0.95, opacity: 0, transition: { duration } }
    },
    'slide-fade': {
      visible: { x: 0, opacity: 1, transition: { duration, delay } },
      hidden: { x: -20, opacity: 0, transition: { duration } }
    }
  };

  return (
    <AnimatePresence>
      {(shouldRender || !disableWhileInvisible) && (
        <motion.div
          className={`optimized-transition ${className}`}
          style={{
            height: type === 'scale' ? height : 'auto',
            width: type === 'scale' ? width : 'auto',
            ...style
          }}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          exit="hidden"
          variants={variants[type]}
          layoutRoot
          {...motionProps}
        >
          <div ref={contentRef}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptimizedTransition;
