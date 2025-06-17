"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {createClient} from '@/utils/supabase/client';


interface ImageUploaderProps {
  bucketName?: string;
  folderPath?: string;
  onUploadComplete?: (url: string, metadata: any) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

/**
 * Componente para subir imágenes a Supabase Storage
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucketName = 'invitations-media',
  folderPath = 'images',
  onUploadComplete,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    
    const file = e.target.files[0];
    
    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      setError(`Tipo de archivo no permitido. Por favor, sube una imagen en formato: ${allowedTypes.join(', ')}`);
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    
    // Validar tamaño de archivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`La imagen excede el tamaño máximo de ${maxSizeMB}MB`);
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    
    setSelectedFile(file);
    
    // Generar vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Limpiar selección
  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Subir archivo a Supabase Storage
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Crear nombre de archivo único
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      // Configurar simulación de progreso (Supabase no provee progreso real)
      const updateProgress = () => {
        setProgress(prev => {
          const increment = Math.random() * 10;
          const newProgress = prev + increment;
          return newProgress > 95 ? 95 : newProgress;
        });
      };
      
      const progressInterval = setInterval(updateProgress, 200);
      
      // Subir el archivo
       const { data, error } = await supabase.storage
        .from('invitations-media')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
      

      clearInterval(progressInterval);
      
      if (error) {
        console.error('Error al subir la imagen: ', error);
        throw error;
      }

      if(data) {
        console.warn('Imagen subida con éxito: ', data);
      }
      
      setProgress(100);
      
      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      // Notificar al componente padre
      if (onUploadComplete) {
        onUploadComplete(publicUrl, data);
      }
      
      // Limpiar después de subir con éxito
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setUploading(false);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1500);
      
    } catch (err: any) {
      console.error('Error al subir la imagen:', err);
      setError(err.message || 'Error al subir la imagen. Intenta de nuevo.');
      setUploading(false);
      setProgress(0);
    }
  };
  
  return (
    <div className="w-full space-y-4">
      {/* Input de archivo con drag & drop */}
      <div 
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
            e.preventDefault();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        {preview ? (
          <div className="relative max-h-48 overflow-hidden rounded flex items-center justify-center">
            <Image 
              src={preview} 
              alt="Vista previa" 
              width={200}
              height={150}
              style={{ maxHeight: '12rem', objectFit: 'contain' }}
            />
            {!uploading && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSelection();
                }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <Label className="cursor-pointer">
              Arrastra y suelta una imagen o haz clic para seleccionar
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, WEBP hasta {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      
      {/* Mensaje de error */}
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
      
      {/* Barra de progreso */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 text-center">
            Subiendo... {Math.round(progress)}%
          </p>
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="flex gap-2 justify-end">
        {selectedFile && !uploading && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleUpload}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir imagen
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
