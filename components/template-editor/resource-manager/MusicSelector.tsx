"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';

type MusicFile = {
  name: string;
  fileName: string;
  url: string;
  size: string;
  lastModified: string;
};

type MusicSelectorProps = {
  value: string;
  onChange: (url: string) => void;
};

const MusicSelector: React.FC<MusicSelectorProps> = ({ value, onChange }) => {
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchMusicFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/music');
        
        if (!response.ok) {
          throw new Error('Error al cargar archivos de música');
        }
        
        const data = await response.json();
        const files = data.music || [];
        setMusicFiles(files);
        
        // Si hay archivos disponibles y no hay ningún valor seleccionado aún,
        // seleccionar automáticamente el primer archivo
        if (files.length > 0 && !value) {
          console.log('Seleccionando automáticamente el primer archivo:', files[0].url);
          onChange(files[0].url);
        }
      } catch (err) {
        console.error('Error al cargar archivos de música:', err);
        setError('No se pudieron cargar los archivos de música');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMusicFiles();
  }, [value, onChange]);

  useEffect(() => {
    const audio = new Audio();
    
    // Configurar eventos del audio
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    });
    
    audio.addEventListener('error', () => {
      setError('Error al reproducir el archivo de audio');
      setIsPlaying(false);
    });
    
    // Guardar referencia
    audioRef.current = audio;
    
    // Cleanup al desmontar
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      if (audio) {
        audio.pause();
        audio.src = '';
        
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', () => {});
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    // Al cambiar el error, si hay uno nuevo, mostrarlo
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Manejar reproducción/pausa
  const togglePlayback = (url: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // Si es una URL diferente, cargamos el nuevo audio
      if (previewUrl !== url) {
        audio.src = url;
        audio.load();
        setCurrentTime(0);
        setPreviewUrl(url);
        
        // Iniciar reproducción
        audio.play().then(() => {
          setIsPlaying(true);
          startProgressTracking();
        }).catch(err => {
          console.error('Error al reproducir:', err);
          setIsPlaying(false);
        });
      } else {
        // Alternar reproducción/pausa
        if (isPlaying) {
          audio.pause();
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        } else {
          audio.play().catch(err => {
            console.error('Error al reanudar reproducción:', err);
          });
          startProgressTracking();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      console.error('Error en togglePlayback:', err);
    }
  };

  // Iniciar el seguimiento del progreso
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 1000);
  };

  // Cambiar posición en la canción
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Formatear tiempo en MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Manejar cambios en el volumen
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  // Alternar silencio
  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleSelectChange = (newValue: string) => {
    try {
      // Detener reproducción actual
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
      
      // Cambiar valor seleccionado
      onChange(newValue);
    } catch (err) {
      console.error('Error al cambiar selección:', err);
      onChange(newValue);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  // Crear el mensaje de error con el botón para cerrarlo
  const errorMessage = error && showError ? (
    <div className="text-red-500 text-xs mt-1 mb-2 flex items-center justify-between bg-red-50 p-2 rounded">
      <span>{error}</span>
      <button 
        type="button" 
        className="text-red-500 hover:text-red-700 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowError(false);
        }}
        aria-label="Cerrar mensaje de error"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  ) : null;

  if (musicFiles.length === 0) {
    return <div className="text-amber-600 text-sm">No hay archivos de música disponibles</div>;
  }

  return (
    <div className="space-y-4">
      {errorMessage}
      <Select 
        value={value} 
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona una canción" />
        </SelectTrigger>
        <SelectContent>
          {musicFiles.map((file) => (
            <SelectItem 
              key={file.url} 
              value={file.url} 
              className="flex justify-between py-3 cursor-pointer hover:bg-muted"
            >
              <div className="flex items-center justify-between w-full pr-2">
                <span className="mr-2">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 ml-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePlayback(file.url);
                  }}
                >
                  {isPlaying && previewUrl === file.url ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} />
                  )}
                </Button>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Reproductor de previsualización */}
      {previewUrl && (
        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              {musicFiles.find(f => f.url === previewUrl)?.name || 'Previsualización'}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => togglePlayback(previewUrl)}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
          </div>
          
          {/* Barra de progreso */}
          <div className="space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              disabled={!previewUrl}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Control de volumen */}
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={toggleMute}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </Button>
            
            <Slider
              value={[muted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      )}
      
      {/* Información sobre canción seleccionada */}
      {value && !previewUrl && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Music size={12} className="mr-1" />
          <span>
            {musicFiles.find(f => f.url === value)?.name || 'Canción seleccionada'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MusicSelector;
