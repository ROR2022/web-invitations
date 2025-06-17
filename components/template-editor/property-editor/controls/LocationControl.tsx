"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Link } from 'lucide-react';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../hooks/useComponentProperties';

interface LocationControlProps {
  property: NamedComponentProperty & {
    default?: {
      address: string;
      locationUrl?: string;
      buttonText?: string;
    };
  };
  value: {
    address: string;
    locationUrl?: string;
    buttonText?: string;
  };
  onChange: (value: {
    address: string;
    locationUrl?: string;
    buttonText?: string;
  }) => void;
}

/**
 * Control para propiedades de tipo location (ubicación)
 */
const LocationControl: React.FC<LocationControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required } = property;
  const [address, setAddress] = useState(value?.address || '');
  const [locationUrl, setLocationUrl] = useState(value?.locationUrl || '');
  const [buttonText, setButtonText] = useState(value?.buttonText || 'Ver ubicación');
  
  // Función para actualizar tanto el estado local como el valor del parent
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setLocationUrl(newUrl);
  };

  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setButtonText(newText);
  };

  // Actualizar el valor cuando el usuario termina de editar
  const handleAddressBlur = () => {
    onChange({
      ...value,
      address
    });
  };

  const handleUrlBlur = () => {
    onChange({
      ...value,
      locationUrl
    });
  };

  const handleButtonTextBlur = () => {
    onChange({
      ...value,
      buttonText
    });
  };
  
  // Generar enlace de Google Maps
  const generateMapsLink = () => {
    if (!address) return;
    
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    setLocationUrl(mapsUrl);
    
    // Actualizar el valor completo
    onChange({
      ...value,
      address,
      locationUrl: mapsUrl
    });
  };
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <div className="space-y-2 w-full">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <Input
            id={`prop-${name}-address`}
            placeholder="Ingresa la dirección"
            value={address}
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <Link className="h-4 w-4 text-gray-500" />
            <Input
              id={`prop-${name}-url`}
              placeholder="URL del mapa (Google Maps, Waze, etc.)"
              value={locationUrl}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
            className="flex-1"
          />
          </div>
          <Button 
            type="button" 
            size="sm" 
            onClick={generateMapsLink} 
            disabled={!address}
            title="Generar enlace de Google Maps automáticamente"
          >
            <MapPin className="h-4 w-4 mr-1" /> Generar
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="h-4 w-4"></div> {/* Spacer para alineación */}
          <Input
            id={`prop-${name}-button`}
            placeholder="Texto del botón"
            value={buttonText}
            onChange={handleButtonTextChange}
            onBlur={handleButtonTextBlur}
            className="flex-1"
          />
        </div>
      </div>
    </PropertyWrapper>
  );
};

export default LocationControl;
