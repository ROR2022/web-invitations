"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Link } from 'lucide-react';

// Tipos
interface MobileLocationControlProps {
  label: string;
  value: {
    address: string;
    locationUrl?: string;
    buttonText?: string;
  } | string;
  onChange: (value: {
    address: string;
    locationUrl?: string;
    buttonText?: string;
  }) => void;
}

/**
 * Control para seleccionar ubicaciones en dispositivos móviles
 */
const MobileLocationControl: React.FC<MobileLocationControlProps> = ({
  label,
  value,
  onChange
}) => {
  // Inicializar el estado con el valor proporcionado
  const [address, setAddress] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [buttonText, setButtonText] = useState('Ver ubicación');

  // Actualizar el estado cuando cambia el valor de las props
  useEffect(() => {
    if (typeof value === 'string') {
      // Si el valor es solo una cadena, asumimos que es la dirección
      setAddress(value);
    } else if (value && typeof value === 'object') {
      setAddress(value.address || '');
      setLocationUrl(value.locationUrl || '');
      setButtonText(value.buttonText || 'Ver ubicación');
    }
  }, [value]);

  // Manejar cambios en la dirección
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    onChange({
      address: newAddress,
      locationUrl,
      buttonText
    });
  };

  // Manejar cambios en la URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setLocationUrl(newUrl);
    
    onChange({
      address,
      locationUrl: newUrl,
      buttonText
    });
  };

  // Manejar cambios en el texto del botón
  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setButtonText(newText);
    
    onChange({
      address,
      locationUrl,
      buttonText: newText
    });
  };

  // Generar enlace de Google Maps
  const generateMapsLink = () => {
    if (!address) return;
    
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    setLocationUrl(mapsUrl);
    
    onChange({
      address,
      locationUrl: mapsUrl,
      buttonText
    });
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Ingresa la dirección"
            value={address}
            onChange={handleAddressChange}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Link className="h-4 w-4 text-gray-500" />
          <input
            type="url"
            placeholder="URL del mapa"
            value={locationUrl}
            onChange={handleUrlChange}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button 
          onClick={generateMapsLink} 
          disabled={!address}
          className="flex items-center justify-center w-full p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500"
        >
          <MapPin className="h-4 w-4 mr-1" /> Generar enlace de Google Maps
        </button>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Texto del botón"
            value={buttonText}
            onChange={handleButtonTextChange}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileLocationControl;
