"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

// Lista de canciones predefinidas para elegir
const predefinedSongs = [
  { id: 'perfect', name: 'Perfect', artist: 'Ed Sheeran', url: '/music/perfect.mp3' },
  { id: 'thousand-years', name: 'A Thousand Years', artist: 'Christina Perri', url: '/music/thousand-years.mp3' },
  { id: 'thinking-out-loud', name: 'Thinking Out Loud', artist: 'Ed Sheeran', url: '/music/thinking-out-loud.mp3' },
  { id: 'marry-you', name: 'Marry You', artist: 'Bruno Mars', url: '/music/marry-you.mp3' },
  { id: 'all-of-me', name: 'All of Me', artist: 'John Legend', url: '/music/all-of-me.mp3' },
];

// Tipos
interface MobileMusicControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para seleccionar música en dispositivos móviles
 */
const MobileMusicControl: React.FC<MobileMusicControlProps> = ({
  label,
  value,
  onChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Obtener detalles de la canción seleccionada
  const selectedSong = predefinedSongs.find(song => song.url === value);
  
  // Detener la reproducción al desmontar el componente
  useEffect(() => {
    // Guardar una referencia al elemento de audio actual
    const audioElement = audioRef.current;
    
    return () => {
      if (audioElement && isPlaying) {
        audioElement.pause();
      }
    };
  }, [isPlaying]);

  // Manejar selección de canción predefinida
  const handleSongSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const songUrl = e.target.value;
    
    // Detener reproducción si hay algo reproduciéndose
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    onChange(songUrl);
  };
  
  // Manejar URL personalizada
  const handleCustomUrlSubmit = () => {
    if (customUrl.trim()) {
      onChange(customUrl);
      setCustomUrl('');
      
      // Detener reproducción si hay algo reproduciéndose
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  // Manejar reproducción de audio
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Manejar eventos de audio
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="space-y-4">
        {/* Selector de canciones predefinidas */}
        <div>
          <label htmlFor="song-selector" className="text-sm font-medium mb-1 block">Seleccionar música</label>
          <select 
            id="song-selector"
            value={value} 
            onChange={handleSongSelection}
            className="w-full p-3 border border-gray-300 rounded-md bg-white"
          >
            <option value="" disabled>Selecciona una canción</option>
            {predefinedSongs.map(song => (
              <option key={song.id} value={song.url}>
                {song.name} - {song.artist}
              </option>
            ))}
          </select>
        </div>
        
        {/* URL personalizada */}
        <div>
          <label htmlFor="custom-url" className="text-sm font-medium mb-1 block">O ingresa una URL personalizada</label>
          <div className="flex flex-col space-y-2">
            <input
              id="custom-url"
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://ejemplo.com/cancion.mp3"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button 
              onClick={handleCustomUrlSubmit} 
              disabled={!customUrl.trim()}
              className="p-3 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500"
            >
              Usar URL personalizada
            </button>
          </div>
        </div>
        
        {/* Reproductor de audio */}
        {value && (
          <div className="border rounded-md p-3 bg-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayback}
                className="h-12 w-12 flex items-center justify-center rounded-full border border-gray-300 bg-white"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>
              <div className="flex-1">
                <p className="font-medium">{selectedSong?.name || 'Canción personalizada'}</p>
                <p className="text-sm text-gray-500">{selectedSong?.artist || 'URL personalizada'}</p>
              </div>
              <Music className="h-5 w-5 text-gray-500" />
            </div>
            
            <audio
              ref={audioRef}
              src={value}
              onEnded={handleAudioEnded}
              hidden
            >
              <track kind="captions" src="" label="Español" />
              {/* Agregamos un elemento track para resolver el problema de accesibilidad, aunque en este caso es un player de música */}
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMusicControl;
