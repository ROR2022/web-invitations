"use client";

import React from 'react';
import { TemplateConfig, ComponentConfig } from './types';

// Importar los componentes configurables
import ConfigurableHero from './configurable/components/ConfigurableHero';
import ConfigurableCountdown from './configurable/components/ConfigurableCountdown';
import ConfigurableEventDetails from './configurable/components/ConfigurableEventDetails';
import ConfigurableGallery from './configurable/components/ConfigurableGallery';
import ConfigurableAttendance from './configurable/components/ConfigurableAttendance';
import ConfigurableGiftOptions from './configurable/components/ConfigurableGiftOptions';
import ConfigurableMusicPlayer from './configurable/components/ConfigurableMusicPlayer';
import ConfigurableThankYou from './configurable/components/ConfigurableThankYou';

// Importar los tipos de props para cada componente
import type { 
  HeroProps 
} from './configurable/components/ConfigurableHero';
import type {
  CountdownProps
} from './configurable/components/ConfigurableCountdown';
import type {
  EventDetailsProps
} from './configurable/components/ConfigurableEventDetails';
import type {
  GalleryProps
} from './configurable/components/ConfigurableGallery';
import type {
  AttendanceProps
} from './configurable/components/ConfigurableAttendance';
import type {
  GiftOptionsProps
} from './configurable/components/ConfigurableGiftOptions';
import type {
  MusicPlayerProps
} from './configurable/components/ConfigurableMusicPlayer';
import type {
  ThankYouProps
} from './configurable/components/ConfigurableThankYou';

type InvitationPreviewProps = {
  config: TemplateConfig;
  isEditing?: boolean;
  onComponentSelect?: (componentId: string) => void;
  onPropertyChange?: (componentId: string, property: string, value: any) => void;
};

/**
 * Componente que renderiza una vista previa completa de la invitación
 * basada en la configuración JSON
 */
const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  config,
  isEditing = false,
  onComponentSelect,
  onPropertyChange
}) => {
  // Ordenar componentes por el orden especificado
  const sortedComponents = [...config.components].sort((a, b) => a.order - b.order);
  
  // Función auxiliar para manejar cambios de propiedad
  const handlePropertyChange = (componentId: string) => (property: string, value: any) => {
    onPropertyChange?.(componentId, property, value);
  };
  
  // Renderizar componente según su tipo
  const renderComponent = (component: ComponentConfig) => {
    // Si el componente no está visible, no renderizarlo
    if (!component.visible && !isEditing) {
      return null;
    }
    
    // Props comunes para todos los componentes
    const commonProps = {
      isEditing,
      onPropertyChange: handlePropertyChange(component.id),
      onClick: isEditing ? () => onComponentSelect?.(component.id) : undefined,
      className: isEditing ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-primary' : '',
    };
    
    // Renderizar componente según su tipo
    switch (component.type) {
      case 'hero':
        const heroProps: HeroProps = {
          ...commonProps,
          backgroundImage: component.properties.backgroundImage || '',
          backgroundOverlay: component.properties.backgroundOverlay || 'rgba(0,0,0,0.5)',
          title: component.properties.title || '',
          subtitle: component.properties.subtitle || '',
          name: component.properties.name || '',
          titleFont: component.properties.titleFont || 'serif',
          subtitleFont: component.properties.subtitleFont || 'sans-serif',
          textColor: component.properties.textColor || '#ffffff',
          height: component.properties.height || 'medium',
          animation: component.properties.animation || 'none',
        };
        return <ConfigurableHero key={component.id} {...heroProps} />;
      
      case 'countdown':
        const countdownProps: CountdownProps = {
          ...commonProps,
          eventDate: component.properties.eventDate || new Date().toISOString().split('T')[0],
          eventTime: component.properties.eventTime || '18:00',
          title: component.properties.title || 'Próximamente',
          showLabels: component.properties.showLabels ?? true,
          backgroundColor: component.properties.backgroundColor || '#ffffff',
          textColor: component.properties.textColor || '#333333',
          accentColor: component.properties.accentColor || '#4F46E5',
          style: component.properties.style || 'simple',
          animation: component.properties.animation ?? true,
        };
        return <ConfigurableCountdown key={component.id} {...countdownProps} />;
      
      case 'eventDetails':
        const eventDetailsProps: EventDetailsProps = {
          ...commonProps,
          ceremonyTitle: component.properties.ceremonyTitle || 'Ceremonia',
          ceremonyDate: component.properties.ceremonyDate || new Date().toISOString().split('T')[0],
          ceremonyTime: component.properties.ceremonyTime || '16:00',
          ceremonyLocation: component.properties.ceremonyLocation || { address: 'Dirección de la ceremonia' },
          ceremonyDetails: component.properties.ceremonyDetails || '',
          
          receptionTitle: component.properties.receptionTitle || 'Recepción',
          receptionDate: component.properties.receptionDate || new Date().toISOString().split('T')[0],
          receptionTime: component.properties.receptionTime || '19:00',
          receptionLocation: component.properties.receptionLocation || { address: 'Dirección de la recepción' },
          receptionDetails: component.properties.receptionDetails || '',
          
          showMap: component.properties.showMap ?? true,
          backgroundColor: component.properties.backgroundColor || '#ffffff',
          textColor: component.properties.textColor || '#333333',
          iconColor: component.properties.iconColor || '#4F46E5',
          dressCode: component.properties.dressCode || 'Formal',
        };
        return <ConfigurableEventDetails key={component.id} {...eventDetailsProps} />;
      
      case 'gallery':
        const galleryProps: GalleryProps = {
          ...commonProps,
          title: component.properties.title || 'Nuestra Galería',
          description: component.properties.description || 'Una colección de nuestras mejores fotos',
          layout: component.properties.layout || 'grid',
          numberOfImages: component.properties.numberOfImages || 6,
          
          // Imágenes
          image1: component.properties.image1 || '',
          image2: component.properties.image2 || '',
          image3: component.properties.image3 || '',
          image4: component.properties.image4 || '',
          image5: component.properties.image5 || '',
          image6: component.properties.image6 || '',
          image7: component.properties.image7 || '',
          image8: component.properties.image8 || '',
          image9: component.properties.image9 || '',
          image10: component.properties.image10 || '',
          image11: component.properties.image11 || '',
          image12: component.properties.image12 || '',
          
          // Leyendas
          caption1: component.properties.caption1 || '',
          caption2: component.properties.caption2 || '',
          caption3: component.properties.caption3 || '',
          caption4: component.properties.caption4 || '',
          caption5: component.properties.caption5 || '',
          caption6: component.properties.caption6 || '',
          caption7: component.properties.caption7 || '',
          caption8: component.properties.caption8 || '',
          caption9: component.properties.caption9 || '',
          caption10: component.properties.caption10 || '',
          caption11: component.properties.caption11 || '',
          caption12: component.properties.caption12 || '',
          
          // Estilo
          backgroundColor: component.properties.backgroundColor || '#ffffff',
          textColor: component.properties.textColor || '#333333',
          showCaptions: component.properties.showCaptions ?? true,
          enableLightbox: component.properties.enableLightbox ?? true,
          imageStyle: component.properties.imageStyle || 'rounded',
        };
        return <ConfigurableGallery key={component.id} {...galleryProps} />;
      
      case 'attendance':
        const attendanceProps: AttendanceProps = {
          ...commonProps,
          title: component.properties.title || 'Confirma tu asistencia',
          description: component.properties.description || 'Por favor confirma tu asistencia antes de la fecha límite.',
          rsvpDeadline: component.properties.rsvpDeadline || new Date().toISOString().split('T')[0],
          showAdditionalGuests: component.properties.showAdditionalGuests ?? true,
          maxAdditionalGuests: component.properties.maxAdditionalGuests || 2,
          backgroundColor: component.properties.backgroundColor || '#ffffff',
          textColor: component.properties.textColor || '#333333',
          buttonColor: component.properties.buttonColor || '#4F46E5',
          buttonTextColor: component.properties.buttonTextColor || '#ffffff',
          includeDietaryRestrictions: component.properties.includeDietaryRestrictions ?? true,
          includeComments: component.properties.includeComments ?? true
        };
        return <ConfigurableAttendance key={component.id} {...attendanceProps} />;
      
      case 'giftOptions':
        const giftOptionsProps: GiftOptionsProps = {
          ...commonProps,
          title: component.properties.title || 'Mesa de Regalos',
          description: component.properties.description || 'Si deseas obsequiarnos algo, aquí tienes algunas opciones.',
          showCashOption: component.properties.showCashOption ?? true,
          cashDescription: component.properties.cashDescription || 'También puedes ayudarnos con un regalo en efectivo.',
          showGiftRegistries: component.properties.showGiftRegistries ?? true,
          registries: component.properties.registries || ['liverpool', 'amazon'],
          backgroundColor: component.properties.backgroundColor || '#ffffff',
          textColor: component.properties.textColor || '#333333',
          iconColor: component.properties.iconColor || '#4F46E5'
        };
        return <ConfigurableGiftOptions key={component.id} {...giftOptionsProps} />;
      
      case 'musicPlayer':
        const musicPlayerProps: MusicPlayerProps = {
          ...commonProps,
          audioUrl: component.properties.audioUrl || '',
          autoplay: component.properties.autoplay ?? false,
          loop: component.properties.loop ?? true,
          showControls: component.properties.showControls ?? true,
          buttonStyle: component.properties.buttonStyle || 'rounded',
          buttonPosition: component.properties.buttonPosition || 'bottomRight',
          buttonColor: component.properties.buttonColor || '#4F46E5',
          iconColor: component.properties.iconColor || '#ffffff'
        };
        return <ConfigurableMusicPlayer key={component.id} {...musicPlayerProps} />;
      
      case 'thankYou':
        const thankYouProps: ThankYouProps = {
          ...commonProps,
          title: component.properties.title || '¡Gracias!',
          message: component.properties.message || 'Gracias por acompañarnos en este día tan especial.',
          backgroundImage: component.properties.backgroundImage,
          backgroundColor: component.properties.backgroundColor || '#ffffff',
          textColor: component.properties.textColor || '#333333',
          showSignature: component.properties.showSignature ?? true,
          signature: component.properties.signature || 'Con cariño',
          signatureFont: component.properties.signatureFont || 'cursive'
        };
        return <ConfigurableThankYou key={component.id} {...thankYouProps} />;
      
      default:
        // Para tipos desconocidos, mostrar un placeholder en modo edición
        if (isEditing) {
          return (
            <div 
              key={component.id}
              className="p-8 bg-gray-200 text-center text-gray-500 border border-dashed border-gray-400 rounded-md"
              onClick={() => onComponentSelect?.(component.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onComponentSelect?.(component.id);
                  e.preventDefault();
                }
              }}
              role="button"
              tabIndex={0}
            >
              Componente desconocido: {component.type}
            </div>
          );
        }
        return null;
    }
  };

  // Aplicar estilos globales basados en el tema
  const themeStyles: React.CSSProperties = {
    // Definir variables CSS para los colores del tema
    '--primary': config.theme.colors.primary,
    '--secondary': config.theme.colors.secondary,
    '--background': config.theme.colors.background,
    '--text': config.theme.colors.text,
    '--headings': config.theme.colors.headings || config.theme.colors.primary,
    // Propiedad para tipado de CSS
    color: config.theme.colors.text,
    backgroundColor: config.theme.colors.background,
  } as React.CSSProperties;

  return (
    <div className="invitation-preview" style={themeStyles}>
      {/* Panel de indicación de edición */}
      {isEditing && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white py-2 px-4 rounded-full z-50 text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Modo edición
        </div>
      )}
      
      {/* Renderizar todos los componentes */}
      {sortedComponents.map(renderComponent)}
    </div>
  );
};

export default InvitationPreview;
