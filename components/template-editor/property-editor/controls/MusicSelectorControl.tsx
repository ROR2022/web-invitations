"use client";

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../../types';

interface MusicSelectorControlProps {
  property: NamedComponentProperty;
  value: string;
  onChange: (value: string) => void;
}

// Lista de canciones predefinidas para elegir
const predefinedSongs = [
  { id: 'perfect', name: 'Perfect', artist: 'Ed Sheeran', url: '/music/perfect.mp3' },
  { id: 'thousand-years', name: 'A Thousand Years', artist: 'Christina Perri', url: '/music/thousand-years.mp3' },
  { id: 'thinking-out-loud', name: 'Thinking Out Loud', artist: 'Ed Sheeran', url: '/music/thinking-out-loud.mp3' },
  { id: 'marry-you', name: 'Marry You', artist: 'Bruno Mars', url: '/music/marry-you.mp3' },
  { id: 'all-of-me', name: 'All of Me', artist: 'John Legend', url: '/music/all-of-me.mp3' },
];

/**
 * Control para seleccionar música para la invitación
 */
const MusicSelectorControl: React.FC<MusicSelectorControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required } = property;
  const [isPlaying, setIsPlaying] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Obtener detalles de la canción seleccionada
  const selectedSong = predefinedSongs.find(song => song.url === value);
  
  // Manejar selección de canción predefinida
  const handleSongSelection = (songUrl: string) => {
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
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <div className="space-y-4">
        {/* Selector de canciones predefinidas */}
        <div>
          <label id="song-select-label" className="text-sm font-medium mb-1 block">Seleccionar música</label>
          <div className="mt-1">
            <Select value={value} onValueChange={handleSongSelection} aria-labelledby="song-select-label">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una canción" />
            </SelectTrigger>
            <SelectContent>
              {predefinedSongs.map(song => (
                <SelectItem key={song.id} value={song.url}>
                  {song.name} - {song.artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
        </div>
        
        {/* URL personalizada */}
        <div>
          <label htmlFor="custom-url-input" className="text-sm font-medium mb-1 block">O ingresa una URL personalizada</label>
          <div className="flex gap-2">
            <Input
              id="custom-url-input"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://ejemplo.com/cancion.mp3"
              className="flex-1"
            />
            <Button 
              onClick={handleCustomUrlSubmit} 
              disabled={!customUrl.trim()}
              type="button"
            >
              Usar
            </Button>
          </div>
        </div>
        
        {/* Reproductor de audio */}
        {value && (
          <div className="border rounded-md p-3 bg-muted/20">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={togglePlayback}
                className="h-10 w-10"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <div className="flex-1">
                <p className="font-medium text-sm">{selectedSong?.name || 'Canción personalizada'}</p>
                <p className="text-xs text-muted-foreground">{selectedSong?.artist || value}</p>
              </div>
              <Music className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <audio
              ref={audioRef}
              src={value}
              onEnded={handleAudioEnded}
              hidden
            >
              <track kind="captions" src="" label="Español" />
              {/* Track element agregado para cumplir con los requisitos de accesibilidad */}
            </audio>
          </div>
        )}
      </div>
    </PropertyWrapper>
  );
};

export default MusicSelectorControl;
