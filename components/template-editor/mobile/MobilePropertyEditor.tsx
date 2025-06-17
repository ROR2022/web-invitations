"use client";

import React from 'react';
import { ComponentConfig, ComponentType } from '../types';
import MobileStringControl from './controls/MobileStringControl';
import MobileColorControl from './controls/MobileColorControl';
import MobileBooleanControl from './controls/MobileBooleanControl';
import MobileDateControl from './controls/MobileDateControl';
import MobileImageControl from './controls/MobileImageControl';
import MobileTimeControl from './controls/MobileTimeControl';
import MobileLocationControl from './controls/MobileLocationControl';
import MobileMusicControl from './controls/MobileMusicControl';
import MobileFontControl from './controls/MobileFontControl';
import MobileRichTextControl from './controls/MobileRichTextControl';

// Tipos
interface MobilePropertyEditorProps {
  component: ComponentConfig;
  onChange: (propertyName: string, value: any) => void;
  pendingChanges: Record<string, any>;
}

/**
 * Editor de propiedades optimizado para móviles
 * Muestra solo las propiedades esenciales de cada componente
 */
const MobilePropertyEditor: React.FC<MobilePropertyEditorProps> = ({
  component,
  onChange,
  pendingChanges
}) => {
  // Obtener las propiedades esenciales según el tipo de componente
  const getEssentialProperties = (componentType: ComponentType): Array<{name: string, type: string}> => {
    switch (componentType) {
      case ComponentType.HERO:
        return [
          { name: 'title', type: 'string' },
          { name: 'subtitle', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'backgroundImages', type: 'image' },
          { name: 'textColor', type: 'color' },
          { name: 'font', type: 'font' }
        ];
      
      case ComponentType.EVENT_DETAILS:
        return [
          { name: 'title', type: 'string' },
          { name: 'date', type: 'date' },
          { name: 'time', type: 'time' },
          { name: 'location', type: 'location' },
          { name: 'showMap', type: 'boolean' }
        ];
      
      case ComponentType.COUNTDOWN:
        return [
          { name: 'title', type: 'string' },
          { name: 'eventDate', type: 'date' },
          { name: 'eventTime', type: 'time' }
        ];
      
      case ComponentType.GALLERY:
        return [
          { name: 'title', type: 'string' },
          { name: 'layout', type: 'enum' }
        ];
      
      case ComponentType.ATTENDANCE:
        return [
          { name: 'title', type: 'string' },
          { name: 'description', type: 'richtext' },
          { name: 'buttonText', type: 'string' }
        ];
      
      case ComponentType.MUSIC_PLAYER:
        return [
          { name: 'title', type: 'string' },
          { name: 'audioUrl', type: 'music' },
          { name: 'songTitle', type: 'string' },
          { name: 'songArtist', type: 'string' }
        ];
      
      case ComponentType.THANK_YOU:
        return [
          { name: 'title', type: 'string' },
          { name: 'message', type: 'richtext' },
          { name: 'signature', type: 'string' }
        ];
      
      default:
        // Para otros tipos de componentes, mostrar al menos el título
        return [
          { name: 'title', type: 'string' }
        ];
    }
  };

  // Obtener las propiedades esenciales del componente actual
  const essentialProperties = getEssentialProperties(component.type as ComponentType);

  // Renderizar el control adecuado según el tipo de propiedad
  const renderPropertyControl = (propertyName: string, propertyType: string) => {
    // Obtener el valor actual (considerando cambios pendientes)
    const currentValue = pendingChanges[propertyName] !== undefined 
      ? pendingChanges[propertyName] 
      : component.properties[propertyName];

    // Generar una etiqueta amigable para la propiedad
    const label = propertyName.charAt(0).toUpperCase() + propertyName.slice(1).replace(/([A-Z])/g, ' $1');

    // Renderizar el control apropiado según el tipo
    switch (propertyType) {
      case 'string':
        return (
          <MobileStringControl
            key={propertyName}
            label={label}
            value={currentValue || ''}
            onChange={(value: string) => onChange(propertyName, value)}
          />
        );
      
      case 'color':
        return (
          <MobileColorControl
            key={propertyName}
            label={label}
            value={currentValue || '#000000'}
            onChange={(value: string) => onChange(propertyName, value)}
          />
        );
      
      case 'boolean':
        return (
          <MobileBooleanControl
            key={propertyName}
            label={label}
            value={!!currentValue}
            onChange={(value: boolean) => onChange(propertyName, value)}
          />
        );
      
      case 'date':
        return (
          <MobileDateControl
            key={propertyName}
            label={label}
            value={currentValue || ''}
            onChange={(value: string) => onChange(propertyName, value)}
          />
        );
      
      case 'time':
        return (
          <MobileTimeControl
            key={propertyName}
            label={label}
            value={currentValue || ''}
            onChange={(value: string) => onChange(propertyName, value)}
          />
        );
      
      case 'image':
        return (
          <MobileImageControl
            key={propertyName}
            label={label}
            value={currentValue || ''}
            onChange={(value: string) => onChange(propertyName, value)}
          />
        );
      
      case 'location':
        return (
          <MobileLocationControl
            key={propertyName}
            label={label}
            value={currentValue || { address: '', locationUrl: '', buttonText: 'Ver ubicación' }}
            onChange={(value: any) => onChange(propertyName, value)}
          />
        );
      
      case 'music':
        return (
          <MobileMusicControl
            key={propertyName}
            label={label}
            value={currentValue || ''}
            onChange={(value: string) => onChange(propertyName, value)}
          />
        );
      
      case 'font':
        return (
          <MobileFontControl
            key={propertyName}
            label={label}
            value={currentValue || ''}
            onChange={(value: string) => onChange(propertyName, value)}
            sampleText="Texto de muestra"
          />
        );
      
      case 'richtext':
        return (
          <MobileRichTextControl
            key={propertyName}
            label={label}
            value={currentValue || ''}
            onChange={(value: string) => onChange(propertyName, value)}
            multiline={true}
          />
        );
      
      default:
        // Para tipos no soportados, mostrar un mensaje
        return (
          <div key={propertyName} className="property-control">
            <div className="property-label">{label}</div>
            <div className="text-sm text-muted-foreground p-2 border rounded-md">
              Tipo de propiedad no soportado en móvil: {propertyType}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mobile-property-editor">
      {essentialProperties.map(prop => 
        renderPropertyControl(prop.name, prop.type)
      )}
    </div>
  );
};

export default MobilePropertyEditor;
