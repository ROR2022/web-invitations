"use client";

import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';

// Tipos
interface MobileImageControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para seleccionar imágenes en móviles
 */
const MobileImageControl: React.FC<MobileImageControlProps> = ({
  label,
  value,
  onChange
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Simular la carga de una imagen (en una implementación real, se conectaría con el backend)
  const handleImageSelect = () => {
    // Simulación de carga de imagen
    setIsUploading(true);
    
    // En una implementación real, aquí se abriría un selector de archivos
    // y se cargaría la imagen seleccionada al servidor
    
    // Por ahora, simplemente simulamos una carga exitosa después de 1 segundo
    setTimeout(() => {
      // URL de ejemplo para simular una imagen cargada
      const newImageUrl = 'https://via.placeholder.com/400x300';
      onChange(newImageUrl);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="image-control">
        {/* Vista previa de la imagen */}
        {value ? (
          <div 
            className="image-preview"
            style={{ backgroundImage: `url(${value})` }}
          />
        ) : (
          <div className="image-preview bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
        
        {/* Botón para seleccionar una imagen */}
        <button 
          className="image-select-button flex items-center justify-center gap-2"
          onClick={handleImageSelect}
          disabled={isUploading}
        >
          {isUploading ? (
            <span>Cargando...</span>
          ) : (
            <>
              <Upload size={16} />
              <span>Seleccionar imagen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileImageControl;
