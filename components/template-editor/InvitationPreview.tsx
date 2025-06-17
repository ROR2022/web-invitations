"use client";

import React from 'react';
import PropTypes from 'prop-types';
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
import ConfigurableInvitation from './configurable/components/ConfigurableInvitation';
import ConfigurableCouple from './configurable/components/ConfigurableCouple';

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
import type {
  InvitationProps
} from './configurable/components/ConfigurableInvitation';
import type {
  CoupleProps
} from './configurable/components/ConfigurableCouple';

// Definir tipos de enumeración explícitamente
const heightValues = ['fullscreen', 'large', 'medium', 'small'] as const;
const animationValues = ['fade', 'slide', 'zoom', 'none'] as const;
const styleValues = ['simple', 'boxes', 'circles', 'flip'] as const;
const layoutValues = ['grid', 'carousel', 'masonry', 'slideshow'] as const;
const imageStyleValues = ['rounded', 'circle', 'square', 'polaroid'] as const;
const buttonStyleValues = ['minimal', 'rounded', 'square'] as const;
const buttonPositionValues = ['topRight', 'topLeft', 'bottomRight', 'bottomLeft', 'floating'] as const;

type HeroHeight = typeof heightValues[number];
type HeroAnimation = typeof animationValues[number];
type CountdownStyle = typeof styleValues[number];
type GalleryLayout = typeof layoutValues[number];
type GalleryImageStyle = typeof imageStyleValues[number];
type MusicPlayerButtonStyle = typeof buttonStyleValues[number];
type MusicPlayerButtonPosition = typeof buttonPositionValues[number];

type InvitationPreviewProps = {
  config: TemplateConfig;
  isEditing?: boolean;
  onComponentSelect?: (componentId: string) => void;
  onPropertyChange?: (componentId: string, property: string, value: any) => void;
};

// Funciones helper tipadas para conversiones explícitas
function safeString(value: ComponentConfig['properties'][string] | undefined, defaultValue = ''): string {
  if (typeof value === 'string') return value;
  return defaultValue;
}

// Función para obtener la fecha predeterminada (34 días en el futuro)
function getDefaultEventDate(): string {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 34);
  const result = defaultDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  console.log('getDefaultEventDate() called in InvitationPreview, returning:', result);
  return result;
}

function safeBoolean(value: ComponentConfig['properties'][string] | undefined, defaultValue = false): boolean {
  if (typeof value === 'boolean') return value;
  return defaultValue;
}

function safeNumber(value: ComponentConfig['properties'][string] | undefined, defaultValue: number): number {
  if (typeof value === 'number' && !isNaN(value)) return value;
  return defaultValue;
}

function safeEnum<T extends string>(
  value: ComponentConfig['properties'][string] | undefined, 
  validValues: readonly T[], 
  defaultValue: T
): T {
  if (typeof value === 'string' && (validValues as readonly string[]).includes(value)) {
    return value as T;
  }
  return defaultValue;
}

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

    // Acceso seguro a las propiedades del componente
    const props = component.properties || {};
    
    // Renderizar componente según su tipo
    switch (component.type) {
      case 'hero': {
        // Enums para hero
        const heroProps: HeroProps = {
          ...commonProps,
          backgroundImages: Array.isArray(props.backgroundImages) ? 
            props.backgroundImages : 
            [safeString(props.backgroundImages || '/images/default-hero.jpg')],
          useCarousel: safeBoolean(props.useCarousel, true),
          carouselInterval: safeNumber(props.carouselInterval, 5000),
          carouselEffect: safeEnum(props.carouselEffect, ['fade', 'slide'] as const, 'fade'),
          backgroundOverlay: safeString(props.backgroundOverlay, 'rgba(0,0,0,0.5)'),
          title: safeString(props.title),
          subtitle: safeString(props.subtitle),
          name: safeString(props.name),
          titleFont: safeString(props.titleFont, 'serif'),
          subtitleFont: safeString(props.subtitleFont, 'sans-serif'),
          nameFont: safeString(props.nameFont, 'Great Vibes'),
          textColor: safeString(props.textColor, '#ffffff'),
          height: safeEnum<HeroHeight>(props.height, heightValues, 'medium'),
          animation: safeEnum<HeroAnimation>(props.animation, animationValues, 'none'),
        };
        return <ConfigurableHero key={component.id} {...heroProps} />;
      }
      
      case 'countdown': {
        // Enums para countdown
        const eventDateOriginal = props.eventDate;
        const eventDateDefault = getDefaultEventDate();
        
        console.log('InvitationPreview - Countdown component props:', {
          componentId: component.id,
          eventDateOriginal,
          eventDateDefault,
          usingDefault: !eventDateOriginal,
          propsKeys: Object.keys(props)
        });
        
        const countdownProps: CountdownProps = {
          ...commonProps,
          eventDate: safeString(props.eventDate, getDefaultEventDate()),
          eventTime: safeString(props.eventTime, '18:00'),
          title: safeString(props.title, 'Próximamente'),
          showLabels: safeBoolean(props.showLabels, true),
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          textColor: safeString(props.textColor, '#333333'),
          accentColor: safeString(props.accentColor, '#4F46E5'),
          style: safeEnum<CountdownStyle>(props.style, styleValues, 'boxes'),
          animation: safeBoolean(props.animation, true),
        };
        return <ConfigurableCountdown key={component.id} {...countdownProps} />;
      }
      
      case 'eventDetails': {
        // Crear un tipo explícito para las ubicaciones
        type LocationType = {
          address: string;
          locationUrl?: string;
          buttonText?: string;
        };
        
        const getCeremonyLocation = (): LocationType => {
          // Verificar que sea un objeto y tenga la propiedad address
          if (
            typeof props.ceremonyLocation === 'object' && 
            props.ceremonyLocation !== null && 
            'address' in props.ceremonyLocation && 
            typeof props.ceremonyLocation.address === 'string'
          ) {
            // Crear un nuevo objeto con solo las propiedades permitidas
            const location: LocationType = {
              address: props.ceremonyLocation.address
            };
            
            // Agregar propiedades opcionales si existen y son del tipo correcto
            if ('locationUrl' in props.ceremonyLocation && typeof props.ceremonyLocation.locationUrl === 'string') {
              location.locationUrl = props.ceremonyLocation.locationUrl;
            }
            if ('buttonText' in props.ceremonyLocation && typeof props.ceremonyLocation.buttonText === 'string') {
              location.buttonText = props.ceremonyLocation.buttonText;
            }
            
            return location;
          }
          return { address: 'Dirección de la ceremonia' };
        };
        
        const getReceptionLocation = (): LocationType => {
          // Verificar que sea un objeto y tenga la propiedad address
          if (
            typeof props.receptionLocation === 'object' && 
            props.receptionLocation !== null && 
            'address' in props.receptionLocation && 
            typeof props.receptionLocation.address === 'string'
          ) {
            // Crear un nuevo objeto con solo las propiedades permitidas
            const location: LocationType = {
              address: props.receptionLocation.address
            };
            
            // Agregar propiedades opcionales si existen y son del tipo correcto
            if ('locationUrl' in props.receptionLocation && typeof props.receptionLocation.locationUrl === 'string') {
              location.locationUrl = props.receptionLocation.locationUrl;
            }
            if ('buttonText' in props.receptionLocation && typeof props.receptionLocation.buttonText === 'string') {
              location.buttonText = props.receptionLocation.buttonText;
            }
            
            return location;
          }
          return { address: 'Dirección de la recepción' };
        };
        
        const eventDetailsProps: EventDetailsProps = {
          ...commonProps,
          ceremonyTitle: safeString(props.ceremonyTitle, 'Ceremonia'),
          ceremonyDate: safeString(props.ceremonyDate, new Date().toISOString().split('T')[0]),
          ceremonyTime: safeString(props.ceremonyTime, '16:00'),
          ceremonyLocation: getCeremonyLocation(),
          ceremonyDetails: safeString(props.ceremonyDetails),
          
          receptionTitle: safeString(props.receptionTitle, 'Recepción'),
          receptionDate: safeString(props.receptionDate, new Date().toISOString().split('T')[0]),
          receptionTime: safeString(props.receptionTime, '19:00'),
          receptionLocation: getReceptionLocation(),
          receptionDetails: safeString(props.receptionDetails),
          
          sectionTitleFont: safeString(props.sectionTitleFont, 'Playfair Display'),
          eventTitleFont: safeString(props.eventTitleFont, 'Montserrat'),
          detailsFont: safeString(props.detailsFont, 'Open Sans'),
          
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          useTexture: safeBoolean(props.useTexture, false),
          texturePattern: safeString(props.texturePattern, ''),
          textureOpacity: safeNumber(props.textureOpacity, 0.3),
          textColor: safeString(props.textColor, '#333333'),
          iconColor: safeString(props.iconColor, '#4F46E5'),
          buttonColor: safeString(props.buttonColor, '#4F46E5'),
          buttonTextColor: safeString(props.buttonTextColor, '#ffffff'),
          dressCode: safeString(props.dressCode, 'Formal'),
          dressCodeDetails: safeString(props.dressCodeDetails, 'El color blanco es exclusivo de la novia. Se solicita a los caballeros usar traje.'),
        };
        return <ConfigurableEventDetails key={component.id} {...eventDetailsProps} />;
      }
      
      case 'gallery': {
        // Enums para gallery
        const galleryProps: GalleryProps = {
          ...commonProps,
          title: safeString(props.title, 'Nuestra Galería'),
          description: safeString(props.description, 'Una colección de nuestras mejores fotos'),
          layout: safeEnum<GalleryLayout>(props.layout, layoutValues, 'grid'),
          numberOfImages: safeNumber(props.numberOfImages, 6),
          
          // Imágenes
          image1: safeString(props.image1),
          image2: safeString(props.image2),
          image3: safeString(props.image3),
          image4: safeString(props.image4),
          image5: safeString(props.image5),
          image6: safeString(props.image6),
          image7: safeString(props.image7),
          image8: safeString(props.image8),
          image9: safeString(props.image9),
          image10: safeString(props.image10),
          image11: safeString(props.image11),
          image12: safeString(props.image12),
          
          // Leyendas
          caption1: safeString(props.caption1),
          caption2: safeString(props.caption2),
          caption3: safeString(props.caption3),
          caption4: safeString(props.caption4),
          caption5: safeString(props.caption5),
          caption6: safeString(props.caption6),
          caption7: safeString(props.caption7),
          caption8: safeString(props.caption8),
          caption9: safeString(props.caption9),
          caption10: safeString(props.caption10),
          caption11: safeString(props.caption11),
          caption12: safeString(props.caption12),
          
          // Estilo
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          textColor: safeString(props.textColor, '#333333'),
          showCaptions: safeBoolean(props.showCaptions, true),
          enableLightbox: safeBoolean(props.enableLightbox, true),
          imageStyle: safeEnum<GalleryImageStyle>(props.imageStyle, imageStyleValues, 'rounded'),
        };
        return <ConfigurableGallery key={component.id} {...galleryProps} />;
      }
      
      case 'attendance': {
        const attendanceProps: AttendanceProps = {
          ...commonProps,
          title: safeString(props.title, 'Confirma tu asistencia'),
          description: safeString(props.description, 'Por favor confirma tu asistencia antes de la fecha límite.'),
          rsvpDeadline: safeString(props.rsvpDeadline, new Date().toISOString().split('T')[0]),
          showAdditionalGuests: safeBoolean(props.showAdditionalGuests, true),
          maxAdditionalGuests: safeNumber(props.maxAdditionalGuests, 2),
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          textColor: safeString(props.textColor, '#333333'),
          buttonColor: safeString(props.buttonColor, '#4F46E5'),
          buttonTextColor: safeString(props.buttonTextColor, '#ffffff'),
          includeDietaryRestrictions: safeBoolean(props.includeDietaryRestrictions, true),
          includeComments: safeBoolean(props.includeComments, true)
        };
        return <ConfigurableAttendance key={component.id} {...attendanceProps} />;
      }
      
      case 'giftOptions': {
        // Manejo seguro para arrays
        const getRegistries = () => {
          if (Array.isArray(props.registries)) {
            return props.registries;
          }
          // Return fallback with string values for use with placeholder images
          return ['liverpool', 'amazon'].filter(Boolean);
        };
        
        const giftOptionsProps: GiftOptionsProps = {
          ...commonProps,
          title: safeString(props.title, 'Mesa de Regalos'),
          description: safeString(props.description, 'Si deseas obsequiarnos algo, aquí tienes algunas opciones.'),
          showCashOption: safeBoolean(props.showCashOption, true),
          cashDescription: safeString(props.cashDescription, 'También puedes ayudarnos con un regalo en efectivo.'),
          showGiftRegistries: safeBoolean(props.showGiftRegistries, true),
          registries: getRegistries(),
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          textColor: safeString(props.textColor, '#333333'),
          iconColor: safeString(props.iconColor, '#4F46E5')
        };
        return <ConfigurableGiftOptions key={component.id} {...giftOptionsProps} />;
      }
      
      case 'musicPlayer': {
        // Enums para musicPlayer
        const musicPlayerProps: MusicPlayerProps = {
          ...commonProps,
          audioUrl: safeString(props.audioUrl, ''),
          autoplay: safeBoolean(props.autoplay, false),
          loop: safeBoolean(props.loop, true),
          showControls: safeBoolean(props.showControls, true),
          buttonStyle: safeEnum<MusicPlayerButtonStyle>(props.buttonStyle, buttonStyleValues, 'rounded'),
          buttonPosition: safeEnum<MusicPlayerButtonPosition>(props.buttonPosition, buttonPositionValues, 'bottomRight'),
          buttonColor: safeString(props.buttonColor, '#4F46E5'),
          iconColor: safeString(props.iconColor, '#ffffff')
        };
        return <ConfigurableMusicPlayer key={component.id} {...musicPlayerProps} />;
      }
      
      case 'thankYou': {
        const thankYouProps: ThankYouProps = {
          ...commonProps,
          title: safeString(props.title, '¡Gracias!'),
          message: safeString(props.message, 'Gracias por acompañarnos en este día tan especial.'),
          backgroundImage: safeString(props.backgroundImage),
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          textColor: safeString(props.textColor, '#333333'),
          showSignature: safeBoolean(props.showSignature, true),
          signature: safeString(props.signature, 'Con cariño'),
          signatureFont: safeString(props.signatureFont, 'cursive')
        };
        return <ConfigurableThankYou key={component.id} {...thankYouProps} />;
      }
      
      case 'invitation': {
        const decorativeIconValues = ['heart', 'flower', 'star', 'none'] as const;
        const hostTypeValues = ['parents', 'couple', 'individual'] as const;
        
        const invitationProps: InvitationProps = {
          ...commonProps,
          introText: safeString(props.introText, 'Acompáñanos a celebrar'),
          mainEventText: safeString(props.mainEventText, 'Mis XV años'),
          formalText: safeString(props.formalText, 'con la bendición de Dios\ny mis padres:'),
          
          introTextFont: safeString(props.introTextFont, 'Playfair Display'),
          mainEventTextFont: safeString(props.mainEventTextFont, 'Great Vibes'),
          formalTextFont: safeString(props.formalTextFont, 'Playfair Display'),
          hostNamesFont: safeString(props.hostNamesFont, 'Montserrat'),
          
          showHosts: safeBoolean(props.showHosts, true),
          hostType: safeEnum(props.hostType, hostTypeValues, 'parents'),
          host1FirstName: safeString(props.host1FirstName, 'JOEL ALFONSO'),
          host1LastName: safeString(props.host1LastName, 'CANTÚ SARABIA'),
          host2FirstName: safeString(props.host2FirstName, 'MARIANA'),
          host2LastName: safeString(props.host2LastName, 'TORRES MARTÍNEZ'),
          separatorText: safeString(props.separatorText, '&'),
          
          showPadrinos: safeBoolean(props.showPadrinos, false),
          padrinosTitle: safeString(props.padrinosTitle, 'Con la bendición de nuestros padrinos'),
          numPadrinos: safeEnum(props.numPadrinos, ['one', 'two'] as const, 'one'),
          padrino1FirstName: safeString(props.padrino1FirstName, 'FAMILIA'),
          padrino1LastName: safeString(props.padrino1LastName, 'HERNÁNDEZ GONZÁLEZ'),
          padrino1Role: safeString(props.padrino1Role, 'Padrinos de Velación'),
          padrino2FirstName: safeString(props.padrino2FirstName, 'FAMILIA'),
          padrino2LastName: safeString(props.padrino2LastName, 'MARTÍNEZ LÓPEZ'),
          padrino2Role: safeString(props.padrino2Role, 'Padrinos de Arras'),
          padrinosFont: safeString(props.padrinosFont, 'Montserrat'),
          
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          useTexture: safeBoolean(props.useTexture, false),
          texturePattern: safeString(props.texturePattern, ''),
          textureOpacity: safeNumber(props.textureOpacity, 0.3),
          mainTextColor: safeString(props.mainTextColor, '#333333'),
          accentTextColor: safeString(props.accentTextColor, '#9a0045'),
          decorativeIcon: safeEnum(props.decorativeIcon, decorativeIconValues, 'heart'),
          showAnimation: safeBoolean(props.showAnimation, true),
          
          showImage: safeBoolean(props.showImage, false),
          imageUrl: safeString(props.imageUrl, '')
        };
        return <ConfigurableInvitation key={component.id} {...invitationProps} />;
      }
      
      case 'couple': {
        const coupleProps: CoupleProps = {
          ...commonProps,
          sectionTitle: safeString(props.sectionTitle, 'Nosotros'),
          
          person1Name: safeString(props.person1Name, 'Ana María'),
          person1Image: safeString(props.person1Image, '/images/novia1.jpeg'),
          person1Description: safeString(props.person1Description, 'Amante de los viajes, la fotografía y las mañanas con café.'),
          
          person2Name: safeString(props.person2Name, 'Carlos Eduardo'),
          person2Image: safeString(props.person2Image, '/images/novio1.jpeg'),
          person2Description: safeString(props.person2Description, 'Apasionado por la tecnología, la música y las tardes de cine.'),
          
          showStory: safeBoolean(props.showStory, true),
          storyTitle: safeString(props.storyTitle, 'Nuestra Historia'),
          storyText: safeString(props.storyText, 'Nos conocimos hace 5 años en una tarde de otoño...'),
          
          backgroundColor: safeString(props.backgroundColor, '#ffffff'),
          useTexture: safeBoolean(props.useTexture, false),
          texturePattern: safeString(props.texturePattern, ''),
          textureOpacity: safeNumber(props.textureOpacity, 0.3),
          textColor: safeString(props.textColor, '#333333'),
          accentColor: safeString(props.accentColor, '#9a0045'),
          decorativeIcon: safeEnum(props.decorativeIcon, ['heart', 'flower', 'star', 'rings', 'none'] as const, 'heart'),
          
          titleFont: safeString(props.titleFont, 'Playfair Display'),
          namesFont: safeString(props.namesFont, 'Great Vibes'),
          textFont: safeString(props.textFont, 'Open Sans'),
          
          showAnimation: safeBoolean(props.showAnimation, true)
        };
        return <ConfigurableCouple key={component.id} {...coupleProps} />;
      }
      
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

  // Para evitar problemas con las CSS vars, usar type assertion clara
  const customThemeVars = {
    '--primary': config.theme.colors.primary,
    '--secondary': config.theme.colors.secondary,
    '--background': config.theme.colors.background,
    '--text': config.theme.colors.text,
    '--headings': config.theme.colors.headings || config.theme.colors.primary,
  } as React.CSSProperties;

  // Aplicar estilos globales basados en el tema
  const themeStyles = {
    ...customThemeVars,
    color: config.theme.colors.text,
    backgroundColor: config.theme.colors.background,
  } as React.CSSProperties;

  return (
    <div className="invitation-preview relative" style={themeStyles}>
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

// Define PropTypes para todas las propiedades que se utilizan en el renderizado de componentes
// Esto ayuda a resolver los errores 'missing in props validation'
InvitationPreview.propTypes = {
  // Propiedades de Hero
  backgroundImages: PropTypes.arrayOf(PropTypes.string),
  useCarousel: PropTypes.bool,
  carouselInterval: PropTypes.number,
  carouselEffect: PropTypes.string,
  backgroundOverlay: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  name: PropTypes.string,
  titleFont: PropTypes.string,
  subtitleFont: PropTypes.string,
  nameFont: PropTypes.string,
  textColor: PropTypes.string,
  height: PropTypes.string,
  animation: PropTypes.string,

  // Propiedades de Countdown
  eventDate: PropTypes.string,
  eventTime: PropTypes.string,
  showLabels: PropTypes.bool,
  backgroundColor: PropTypes.string,
  accentColor: PropTypes.string,
  style: PropTypes.string,

  // Propiedades de EventDetails
  ceremonyLocation: PropTypes.shape({
    address: PropTypes.string,
    locationUrl: PropTypes.string,
    buttonText: PropTypes.string
  }),
  receptionLocation: PropTypes.shape({
    address: PropTypes.string,
    locationUrl: PropTypes.string,
    buttonText: PropTypes.string
  }),
  ceremonyTitle: PropTypes.string,
  ceremonyDate: PropTypes.string,
  ceremonyTime: PropTypes.string,
  ceremonyDetails: PropTypes.string,
  receptionTitle: PropTypes.string,
  receptionDate: PropTypes.string,
  receptionTime: PropTypes.string,
  receptionDetails: PropTypes.string,
  sectionTitleFont: PropTypes.string,
  eventTitleFont: PropTypes.string,
  detailsFont: PropTypes.string,
  useTexture: PropTypes.bool,
  texturePattern: PropTypes.string,
  textureOpacity: PropTypes.number,
  iconColor: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  dressCode: PropTypes.string,
  dressCodeDetails: PropTypes.string,

  // Propiedades de Gallery
  description: PropTypes.string,
  layout: PropTypes.string,
  numberOfImages: PropTypes.number,
  image1: PropTypes.string,
  image2: PropTypes.string,
  image3: PropTypes.string,
  image4: PropTypes.string,
  image5: PropTypes.string,
  image6: PropTypes.string,
  image7: PropTypes.string,
  image8: PropTypes.string,
  image9: PropTypes.string,
  image10: PropTypes.string,
  image11: PropTypes.string,
  image12: PropTypes.string,
  caption1: PropTypes.string,
  caption2: PropTypes.string,
  caption3: PropTypes.string,
  caption4: PropTypes.string,
  caption5: PropTypes.string,
  caption6: PropTypes.string,
  caption7: PropTypes.string,
  caption8: PropTypes.string,
  caption9: PropTypes.string,
  caption10: PropTypes.string,
  caption11: PropTypes.string,
  caption12: PropTypes.string,
  showCaptions: PropTypes.bool,
  enableLightbox: PropTypes.bool,
  imageStyle: PropTypes.string,

  // Propiedades de Attendance
  rsvpDeadline: PropTypes.string,
  showAdditionalGuests: PropTypes.bool,
  maxAdditionalGuests: PropTypes.number,
  includeDietaryRestrictions: PropTypes.bool,
  includeComments: PropTypes.bool,

  // Propiedades de GiftOptions
  showCashOption: PropTypes.bool,
  cashDescription: PropTypes.string,
  showGiftRegistries: PropTypes.bool,
  registries: PropTypes.array,

  // Propiedades de MusicPlayer
  audioUrl: PropTypes.string,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  showControls: PropTypes.bool,
  buttonStyle: PropTypes.string,
  buttonPosition: PropTypes.string,

  // Propiedades de ThankYou
  message: PropTypes.string,
  backgroundImage: PropTypes.string,
  showSignature: PropTypes.bool,
  signature: PropTypes.string,
  signatureFont: PropTypes.string,

  // Propiedades de Invitation
  introText: PropTypes.string,
  mainEventText: PropTypes.string,
  formalText: PropTypes.string,
  introTextFont: PropTypes.string,
  mainEventTextFont: PropTypes.string,
  formalTextFont: PropTypes.string,
  hostNamesFont: PropTypes.string,
  showHosts: PropTypes.bool,
  hostType: PropTypes.string,
  host1FirstName: PropTypes.string,
  host1LastName: PropTypes.string,
  host2FirstName: PropTypes.string,
  host2LastName: PropTypes.string,
  separatorText: PropTypes.string,
  showPadrinos: PropTypes.bool,
  padrinosTitle: PropTypes.string,
  numPadrinos: PropTypes.string,
  padrino1FirstName: PropTypes.string,
  padrino1LastName: PropTypes.string,
  padrino1Role: PropTypes.string,
  padrino2FirstName: PropTypes.string,
  padrino2LastName: PropTypes.string,
  padrino2Role: PropTypes.string,
  padrinosFont: PropTypes.string,
  mainTextColor: PropTypes.string,
  accentTextColor: PropTypes.string,
  decorativeIcon: PropTypes.string,
  showAnimation: PropTypes.bool,
  showImage: PropTypes.bool,
  imageUrl: PropTypes.string,

  // Propiedades de Couple
  sectionTitle: PropTypes.string,
  person1Name: PropTypes.string,
  person1Image: PropTypes.string,
  person1Description: PropTypes.string,
  person2Name: PropTypes.string,
  person2Image: PropTypes.string,
  person2Description: PropTypes.string,
  showStory: PropTypes.bool,
  storyTitle: PropTypes.string,
  storyText: PropTypes.string,
  namesFont: PropTypes.string,
  textFont: PropTypes.string,

  // Propiedades principales del componente
  config: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  onComponentSelect: PropTypes.func,
  onPropertyChange: PropTypes.func
};

export default InvitationPreview;
