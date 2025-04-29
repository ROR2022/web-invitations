"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';
import { ComponentProperty } from '../../types';
import { musicPlayerSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente MusicPlayer configurable para el editor de plantillas
 * Permite reproducir música de fondo en la invitación
 */

// Definir el tipo de propiedades basado en el esquema
export type MusicPlayerProps = {
  // Propiedades configurables
  audioUrl: string;
  autoplay: boolean;
  loop: boolean;
  showControls: boolean;
  buttonStyle: 'minimal' | 'rounded' | 'square';
  buttonPosition: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft' | 'floating';
  buttonColor: string;
  iconColor: string;
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

const ConfigurableMusicPlayer: React.FC<MusicPlayerProps> = ({
  audioUrl,
  autoplay,
  loop,
  showControls,
  buttonStyle,
  buttonPosition,
  buttonColor,
  iconColor,
  isEditing = false,
  onPropertyChange
}) => {
  // Referencias para el audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Estado para reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // Inicializar el reproductor de audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = loop;
      
      audioRef.current.addEventListener('canplaythrough', () => {
        setAudioLoaded(true);
        if (autoplay && !isEditing) {
          audioRef.current?.play().catch(err => {
            console.warn('Autoplay prevented by browser:', err);
          });
          setIsPlaying(true);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        if (!loop) {
          setIsPlaying(false);
        }
      });
      
      // Limpieza al desmontar
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('canplaythrough', () => {});
          audioRef.current.removeEventListener('ended', () => {});
          audioRef.current = null;
        }
      };
    }
  }, [audioUrl, loop, autoplay, isEditing]);
  
  // Cambiar URL de audio
  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl, audioLoaded]);
  
  // Cambiar estado de reproducción
  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      audioRef.current.loop = loop;
    }
  }, [loop, audioLoaded]);
  
  // Función para reproducir/pausar
  const togglePlay = () => {
    if (isEditing) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.warn('Play prevented by browser:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Determinar clases para el botón según el estilo
  const getButtonClass = () => {
    let baseClass = 'flex items-center justify-center transition-all';
    
    switch (buttonStyle) {
      case 'minimal':
        return `${baseClass} p-2`;
      case 'rounded':
        return `${baseClass} rounded-full w-12 h-12`;
      case 'square':
        return `${baseClass} rounded-md w-12 h-12`;
      default:
        return `${baseClass} rounded-full w-12 h-12`;
    }
  };
  
  // Determinar clases para la posición
  const getPositionClass = () => {
    switch (buttonPosition) {
      case 'topRight':
        return 'fixed top-4 right-4 z-50';
      case 'topLeft':
        return 'fixed top-4 left-4 z-50';
      case 'bottomRight':
        return 'fixed bottom-4 right-4 z-50';
      case 'bottomLeft':
        return 'fixed bottom-4 left-4 z-50';
      case 'floating':
        return 'fixed top-1/2 right-4 transform -translate-y-1/2 z-50';
      default:
        return 'fixed top-4 right-4 z-50';
    }
  };
  
  // Solo renderizar si se deben mostrar controles
  if (!showControls && !isEditing) {
    return null;
  }

  return (
    <>
      <motion.button
        className={`${getPositionClass()} ${getButtonClass()} ${isEditing ? 'editing-mode' : ''}`}
        style={{ backgroundColor: buttonColor }}
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-component-type="musicPlayer"
        id="music-player-button"
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? (
          <Pause size={20} style={{ color: iconColor }} />
        ) : (
          <Play size={20} style={{ color: iconColor }} />
        )}
        
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="absolute -right-2 -top-2 h-3 w-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div 
          className={`${getPositionClass()} bg-black/50 text-white text-xs px-2 py-1 rounded transform translate-y-14`}
          style={{ maxWidth: '150px' }}
        >
          <div className="flex items-center">
            <Music size={12} className="mr-1" />
            <span>Music Player</span>
          </div>
          <div className="text-xs opacity-70 mt-1">
            {buttonPosition}, {buttonStyle}
          </div>
        </div>
      )}
    </>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(musicPlayerSchema);

export default ConfigurableMusicPlayer;
