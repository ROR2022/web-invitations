import { useMemo } from 'react';
import { ComponentConfig, ComponentProperty, ComponentType } from '../../types';

// Importar las propiedades configurables de cada tipo de componente
import { configurableProperties as heroProperties } from '../../configurable/components/ConfigurableHero';
import { configurableProperties as countdownProperties } from '../../configurable/components/ConfigurableCountdown';
import { configurableProperties as eventDetailsProperties } from '../../configurable/components/ConfigurableEventDetails';
import { configurableProperties as galleryProperties } from '../../configurable/components/ConfigurableGallery';
import { configurableProperties as attendanceProperties } from '../../configurable/components/ConfigurableAttendance';
import { configurableProperties as giftOptionsProperties } from '../../configurable/components/ConfigurableGiftOptions';
import { configurableProperties as musicPlayerProperties } from '../../configurable/components/ConfigurableMusicPlayer';
import { configurableProperties as thankYouProperties } from '../../configurable/components/ConfigurableThankYou';
import { configurableProperties as invitationProperties } from '../../configurable/components/ConfigurableInvitation';
import { configurableProperties as coupleProperties } from '../../configurable/components/ConfigurableCouple';

// Tipo extendido para propiedades que incluyen su nombre
export type NamedComponentProperty = ComponentProperty & { 
  name: string;
  itemType?: string;
};

// Tipo para propiedades agrupadas por categoría
export type CategorizedProperties = Record<string, NamedComponentProperty[]>;

/**
 * Hook para obtener y organizar las propiedades de un componente específico
 */
export function useComponentProperties(componentType: string) {
  // Buscar propiedades configurables para este tipo de componente
  const configurableProperties = useMemo(() => {
    switch (componentType) {
      case 'hero': 
        return heroProperties;
      case 'countdown': 
        return countdownProperties;
      case 'eventDetails': 
        return eventDetailsProperties;
      case 'gallery': 
        return galleryProperties;
      case 'attendance': 
        return attendanceProperties;
      case 'giftOptions': 
        return giftOptionsProperties;
      case 'musicPlayer': 
        return musicPlayerProperties;
      case 'thankYou': 
        return thankYouProperties;
      case 'invitation':
        return invitationProperties;
      case 'couple':
        return coupleProperties;
      default:
        console.warn(`No se encontraron propiedades para: ${componentType}`);
        return {};
    }
  }, [componentType]);
  
  // Agrupar propiedades por categoría
  const { propertiesByCategory, categories } = useMemo(() => {
    const byCategory: CategorizedProperties = {};
    
    Object.entries(configurableProperties).forEach(([propName, propDef]) => {
      const category = propDef.category || 'General';
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      
      // Create the named property with additional props from specialized types
      const namedProp: NamedComponentProperty = {
        ...propDef,
        name: propName,
      };
      
      // If it's an array property, ensure itemType is passed through
      if (propDef.type === 'array' && 'itemType' in propDef) {
        namedProp.itemType = propDef.itemType as string;
      }
      
      byCategory[category].push(namedProp);
    });
    
    // Ordenar categorías
    const orderedCategories = Object.keys(byCategory).sort((a, b) => {
      if (a === 'Contenido') return -1;
      if (b === 'Contenido') return 1;
      if (a === 'Apariencia' || a === 'Aspecto') return -1;
      if (b === 'Apariencia' || b === 'Aspecto') return 1;
      return a.localeCompare(b);
    });
    
    return { propertiesByCategory: byCategory, categories: orderedCategories };
  }, [configurableProperties]);
  
  return { configurableProperties, propertiesByCategory, categories };
}
