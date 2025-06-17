"use client";

import React from 'react';
import { ComponentConfig, ComponentType } from '../types';
import { withMobileEditing } from './withMobileEditing';

// Define component property interfaces for each component type
interface HeroProperties {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

interface EventDetailsProperties {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
}

interface CountdownProperties {
  title?: string;
  date?: string;
}

interface GalleryProperties {
  title?: string;
  images?: string[];
}

interface MusicPlayerProperties {
  title?: string;
  audioUrl?: string;
}

interface ThankYouProperties {
  title?: string;
  message?: string;
  signature?: string;
}

// Union type for all possible component properties
type ComponentProperties =
  | HeroProperties
  | EventDetailsProperties
  | CountdownProperties
  | GalleryProperties
  | MusicPlayerProperties
  | ThankYouProperties;

// Extend ComponentConfig to include properly typed properties
interface TypedComponentConfig extends Omit<ComponentConfig, 'properties'> {
  properties: ComponentProperties;
  type: ComponentType;
}

// Interface for component props
interface MobileComponentWrapperProps {
  component: TypedComponentConfig;
  pendingChanges?: Partial<ComponentProperties>;
}

/**
 * Componente que actúa como puente entre los componentes configurables
 * y el sistema de edición móvil. En el futuro, este componente se
 * conectará con los componentes reales para mostrarlos correctamente.
 */
const MobileComponentWrapper: React.FC<MobileComponentWrapperProps> = ({
  component,
  pendingChanges = {}
}) => {
  // Combinar propiedades originales con cambios pendientes
  const effectiveProps = {
    ...component.properties,
    ...pendingChanges
  };

  // Función auxiliar para obtener un nombre amigable del componente
  const getComponentDisplayName = (type: ComponentType) => {
    const displayNames: Record<ComponentType, string> = {
      [ComponentType.HERO]: 'Portada',
      [ComponentType.EVENT_DETAILS]: 'Detalles del Evento',
      [ComponentType.COUNTDOWN]: 'Cuenta Regresiva',
      [ComponentType.GALLERY]: 'Galería',
      [ComponentType.ATTENDANCE]: 'Asistencia',
      [ComponentType.MUSIC_PLAYER]: 'Reproductor de Música',
      [ComponentType.THANK_YOU]: 'Agradecimiento',
      [ComponentType.ACCOMMODATION]: 'Alojamiento',
      [ComponentType.ITINERARY]: 'Itinerario',
      [ComponentType.GIFT_OPTIONS]: 'Mesa de Regalos',
      [ComponentType.INVITATION]: 'Invitación',
      [ComponentType.COUPLE]: 'Pareja',
    };
    
    return displayNames[type as ComponentType] || String(type);
  };

  // Función de ayuda para type narrowing
  const isHeroProps = (props: ComponentProperties): props is HeroProperties => {
    return component.type === ComponentType.HERO;
  };

  const isEventDetailsProps = (props: ComponentProperties): props is EventDetailsProperties => {
    return component.type === ComponentType.EVENT_DETAILS;
  };

  const isCountdownProps = (props: ComponentProperties): props is CountdownProperties => {
    return component.type === ComponentType.COUNTDOWN;
  };

  const isGalleryProps = (props: ComponentProperties): props is GalleryProperties => {
    return component.type === ComponentType.GALLERY;
  };

  const isMusicPlayerProps = (props: ComponentProperties): props is MusicPlayerProperties => {
    return component.type === ComponentType.MUSIC_PLAYER;
  };

  const isThankYouProps = (props: ComponentProperties): props is ThankYouProperties => {
    return component.type === ComponentType.THANK_YOU;
  };

  // Renderizado según el tipo de componente
  const renderComponentByType = () => {
    const componentType = component.type;
    const props = effectiveProps as ComponentProperties;

    // Renderizado básico por tipo (a ampliar en el futuro)
    switch (componentType) {
      case ComponentType.HERO:
        if (isHeroProps(props)) {
          return (
            <div className="mobile-preview-hero">
              <h2>{props.title || 'Título de la Invitación'}</h2>
              <p>{props.subtitle || 'Subtítulo'}</p>
            </div>
          );
        }
        break;
        
      case ComponentType.EVENT_DETAILS:
        if (isEventDetailsProps(props)) {
          return (
            <div className="mobile-preview-details">
              <h3>{props.title || 'Detalles del Evento'}</h3>
              <p><strong>Fecha:</strong> {props.date || 'No especificada'}</p>
              <p><strong>Hora:</strong> {props.time || 'No especificada'}</p>
              <p><strong>Lugar:</strong> {props.location || 'No especificado'}</p>
            </div>
          );
        }
        break;
        
      case ComponentType.COUNTDOWN:
        if (isCountdownProps(props)) {
          return (
            <div className="mobile-preview-countdown">
              <h3>{props.title || 'Cuenta Regresiva'}</h3>
              <div className="countdown-placeholder">
                <span>15d</span> : <span>12h</span> : <span>30m</span> : <span>22s</span>
              </div>
            </div>
          );
        }
        break;
        
      // Para otros tipos, mostrar un placeholder por ahora
      default:
        return (
          <div className="mobile-preview-generic">
            <h3>{getComponentDisplayName(componentType)}</h3>
            <p>Vista previa simplificada</p>
          </div>
        );
    }
  };

  return (
    <div className="mobile-component-wrapper">
      {renderComponentByType()}
    </div>
  );
};

// Exportar el componente y una versión editable del mismo
export default MobileComponentWrapper;

// Versión editable del componente para usar directamente
export const EditableMobileComponent = withMobileEditing(MobileComponentWrapper);
