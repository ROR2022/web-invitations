'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  onPropertyChange,
}) => {
  // Referencias para el audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string>(''); // Referencia para rastrear la URL actual
  const isPlayingRef = useRef<boolean>(false); // Referencia para el estado actual de reproducción
  const audioOperationInProgress = useRef<boolean>(false); // Bandera para prevenir operaciones simultáneas

  // Estado para reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Función para reproducir el audio (usando useCallback para evitar recreaciones en cada render)
  const playAudio = useCallback(() => {
    if (!audioRef.current || audioOperationInProgress.current || isPlayingRef.current || isEditing) {
      return false;
    }
    
    try {
      audioOperationInProgress.current = true;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Reproducción iniciada correctamente');
            setIsPlaying(true);
            isPlayingRef.current = true;
            setAudioError(null);
            audioOperationInProgress.current = false;
          })
          .catch(err => {
            console.warn('Error en reproducción:', err);
            setAudioError('No se pudo reproducir el audio');
            setIsPlaying(false);
            isPlayingRef.current = false;
            audioOperationInProgress.current = false;
          });
      } else {
        audioOperationInProgress.current = false;
      }
      
      return true;
    } catch (err) {
      console.error('Error al reproducir audio:', err);
      audioOperationInProgress.current = false;
      return false;
    }
  }, [isEditing]); // Incluimos isEditing como dependencia ya que se usa dentro de la función

  // Inicializar el reproductor de audio
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Crear nuevo elemento de audio
    const audio = new Audio();
    
    // Configurar eventos
    const handleCanPlayThrough = () => {
      console.log('Audio cargado completamente y listo para reproducir');
      setAudioLoaded(true);
      setAudioError(null);
      audioOperationInProgress.current = false;
      
      if (autoplay && !isEditing && !isPlaying && isInitialized) {
        playAudio();
      }
    };
    
    const handleError = (e: Event) => {
      const error = e as ErrorEvent;
      console.warn('Error loading audio:', error.message || 'Error desconocido');
      
      if (isInitialized) {
        setAudioError('No se pudo cargar el audio');
      }
      
      setAudioLoaded(false);
      setIsPlaying(false);
      isPlayingRef.current = false;
      audioOperationInProgress.current = false;
    };
    
    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };
    
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Asignar referencia
    audioRef.current = audio;

    // Limpieza al desmontar
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [autoplay, isEditing, isPlaying, loop, isInitialized, playAudio]); // Incluir todas las dependencias, incluyendo playAudio

  // Marcar como inicializado después de un corto tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Función para actualizar la URL del audio (solo cuando cambia la URL)
  const updateAudioUrl = (url: string) => {
    if (!audioRef.current || !url || url === currentUrlRef.current || audioOperationInProgress.current) {
      return false;
    }
    
    try {
      audioOperationInProgress.current = true;
      
      // Guardar la nueva URL
      currentUrlRef.current = url;
      
      // Pausar antes de cargar la nueva URL
      audioRef.current.pause();
      
      console.log('Actualizando URL de audio:', url);
      audioRef.current.src = url;
      audioRef.current.load();
      
      return true;
    } catch (err) {
      console.error('Error al actualizar URL de audio:', err);
      setAudioError('Error al cargar la URL del audio');
      audioOperationInProgress.current = false;
      return false;
    }
  };

  // Función para pausar el audio
  const pauseAudio = () => {
    if (!audioRef.current || audioOperationInProgress.current || !isPlayingRef.current) {
      return false;
    }
    
    try {
      audioOperationInProgress.current = true;
      
      audioRef.current.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
      audioOperationInProgress.current = false;
      
      return true;
    } catch (err) {
      console.error('Error al pausar audio:', err);
      audioOperationInProgress.current = false;
      return false;
    }
  };



  // Efecto para manejar cambios en la URL de audio
  useEffect(() => {
    if (!isInitialized) return;
    
    if (audioUrl && audioUrl !== currentUrlRef.current) {
      const updated = updateAudioUrl(audioUrl);
      
      // Si se actualiza la URL y está configurado autoplay, intentar reproducir
      if (updated && autoplay && !isEditing) {
        // Pequeño retraso para asegurar que el evento canplaythrough se dispare
        setTimeout(() => {
          playAudio();
        }, 100);
      }
    }
  }, [audioUrl, autoplay, isEditing, isInitialized, playAudio]);

  // Cambiar configuración de reproducción (loop)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, [loop]);

  // Mostrar el error cada vez que cambia
  useEffect(() => {
    if (audioError) {
      setShowError(true);
    }
  }, [audioError]);

  // Función para reproducir/pausar
  const togglePlay = () => {
    if (isEditing) {
      console.log('No se puede reproducir en modo edición');
      return;
    }

    if (!audioRef.current) {
      console.warn('No hay referencia al elemento de audio');
      return;
    }

    if (!audioUrl) {
      console.warn('No hay URL de audio configurada');
      setAudioError('No hay archivo de audio seleccionado');
      return;
    }

    // Asegurar que la URL esté cargada
    if (audioUrl !== currentUrlRef.current) {
      updateAudioUrl(audioUrl);
      // Dar tiempo para que el audio se cargue antes de intentar reproducir
      setTimeout(() => {
        playAudio();
      }, 100);
      return;
    }

    // Alternar entre reproducir y pausar
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
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
        return 'absolute top-4 right-4 z-50';
      case 'topLeft':
        return 'absolute top-4 left-4 z-50';
      case 'bottomRight':
        return 'absolute bottom-4 right-4 z-50';
      case 'bottomLeft':
        return 'absolute bottom-4 left-4 z-50';
      case 'floating':
        return 'absolute top-1/2 right-4 transform -translate-y-1/2 z-50';
      default:
        return 'absolute top-4 right-4 z-50';
    }
  };

  // Solo renderizar si se deben mostrar controles
  if (!showControls && !isEditing) {
    return null;
  }

  // Si no hay URL de audio y estamos en modo edición, mostrar mensaje
  if (!audioUrl && isEditing) {
    return (
      <div
        className={`${getPositionClass()} ${getButtonClass()} ${isEditing ? 'editing-mode bg-gray-200' : ''}`}
        style={{ backgroundColor: buttonColor || '#e5e7eb' }}
        onClick={togglePlay}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            togglePlay();
            e.preventDefault();
          }
        }}
        role="button"
        tabIndex={0}
        data-component-type="musicPlayer"
        aria-label="Reproductor de música"
      >
        <Music size={20} style={{ color: iconColor || '#666' }} />
        <div className="absolute -bottom-16 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Selecciona una canción en propiedades
        </div>
      </div>
    );
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
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
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

        {/* Indicador de error con botón para cerrar */}
        <AnimatePresence>
          {audioError && showError && isInitialized && (
            <motion.div
              className="absolute -left-48 top-0 bg-red-100 border border-red-200 text-red-700 px-2 py-1 rounded shadow-sm flex items-center space-x-1 text-xs whitespace-nowrap z-50"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <span>{audioError}</span>
              {/* Usar div en lugar de button para evitar button dentro de button */}
              <div
                role="button"
                tabIndex={0}
                className="text-red-500 hover:text-red-700 ml-1 focus:outline-none cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  setShowError(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    setShowError(false);
                  }
                }}
                aria-label="Cerrar mensaje de error"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
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
          {audioUrl ? (
            <div className="text-xs opacity-70 mt-1 truncate">{audioUrl.split('/').pop()}</div>
          ) : (
            <div className="text-xs text-amber-300 mt-1">Sin audio seleccionado</div>
          )}
        </div>
      )}
    </>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(musicPlayerSchema);

export default ConfigurableMusicPlayer;
