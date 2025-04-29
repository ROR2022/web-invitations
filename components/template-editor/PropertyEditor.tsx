"use client";

import React, { useState, useMemo } from 'react';
import { 
  ComponentConfig,
  ComponentProperty,
  PropertyValue,
  PropertyType
} from './types';

// Importar correctamente los componentes UI individuales
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  X, 
  Eye, 
  EyeOff,
  Settings,
  Paintbrush,
  Type,
  Code,
  HelpCircle,
  RefreshCw,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { es } from 'date-fns/locale';
import ResourceSelector from './resource-manager/ResourceSelector';

// Importar todos los esquemas de componentes
import { configurableProperties as heroProperties } from './configurable/components/ConfigurableHero';
import { configurableProperties as countdownProperties } from './configurable/components/ConfigurableCountdown';
import { configurableProperties as eventDetailsProperties } from './configurable/components/ConfigurableEventDetails';
import { configurableProperties as galleryProperties } from './configurable/components/ConfigurableGallery';
import { configurableProperties as attendanceProperties } from './configurable/components/ConfigurableAttendance';
import { configurableProperties as giftOptionsProperties } from './configurable/components/ConfigurableGiftOptions';
import { configurableProperties as musicPlayerProperties } from './configurable/components/ConfigurableMusicPlayer';
import { configurableProperties as thankYouProperties } from './configurable/components/ConfigurableThankYou';

/* console.warn('heroProperties:', heroProperties);
console.warn('countdownProperties:', countdownProperties);
console.warn('eventDetailsProperties:', eventDetailsProperties);
console.warn('galleryProperties:', galleryProperties);
console.warn('attendanceProperties:', attendanceProperties);
console.warn('giftOptionsProperties:', giftOptionsProperties);
console.warn('musicPlayerProperties:', musicPlayerProperties);
console.warn('thankYouProperties:', thankYouProperties);
 */

// Mapa de propiedades por tipo de componente
const componentPropertiesMap: Record<string, Record<string, ComponentProperty>> = {
  hero: heroProperties,
  countdown: countdownProperties,
  eventDetails: eventDetailsProperties,
  gallery: galleryProperties,
  attendance: attendanceProperties,
  giftOptions: giftOptionsProperties,
  musicPlayer: musicPlayerProperties,
  thankYou: thankYouProperties,
};



// Nombres amigables para los tipos de componentes
const componentTypeNames: Record<string, string> = {
  hero: 'Portada',
  countdown: 'Cuenta Regresiva',
  eventDetails: 'Detalles del Evento',
  gallery: 'Galería',
  attendance: 'Asistencia',
  giftOptions: 'Mesa de Regalos',
  musicPlayer: 'Reproductor de Música',
  thankYou: 'Agradecimiento',
};

// Sistema de grupos con metadatos
const PROPERTY_GROUPS = {
  'Básicas': {
    icon: Settings,
    priority: 1,
    description: 'Configuración general del componente'
  },
  'Apariencia': {
    icon: Paintbrush, 
    priority: 2,
    description: 'Personalización visual'
  },
  'Contenido': {
    icon: Type,
    priority: 3,
    description: 'Texto e imágenes'
  },
  'Avanzadas': {
    icon: Code,
    priority: 4,
    description: 'Opciones adicionales'
  }
};

// Tipos específicos para contexto de invitaciones digitales
const EVENT_TYPE_OPTIONS = [
  { value: 'wedding', label: 'Boda' },
  { value: 'xv', label: 'XV años' },
  { value: 'baptism', label: 'Bautizo' },
  { value: 'corporate', label: 'Evento Corporativo' }
];

// Paletas de colores predefinidas por tipo de evento
const EVENT_COLOR_PALETTES = {
  wedding: {
    name: 'Romántica',
    primary: '#D8B4E2',
    secondary: '#9D65C9', 
    accent: '#5D54A4',
    background: '#F9F7FC',
    text: '#2A2A2A'
  },
  xv: {
    name: 'Elegante',
    primary: '#F6C6EA',
    secondary: '#C490D1', 
    accent: '#ACACDE',
    background: '#FCFAFC',
    text: '#2A2A2A'
  },
  baptism: {
    name: 'Tierna',
    primary: '#A5E1AD',
    secondary: '#75C2F6', 
    accent: '#5499C7',
    background: '#F7FBFA',
    text: '#2A2A2A'
  },
  corporate: {
    name: 'Profesional',
    primary: '#7FB3D5',
    secondary: '#5499C7', 
    accent: '#2874A6',
    background: '#F5F9FC',
    text: '#2A2A2A'
  }
};

type PropertyEditorProps = {
  selectedComponent: ComponentConfig | null;
  onPropertyChange: (property: string, value: any) => void;
  onVisibilityToggle: (visible: boolean) => void;
  onRemoveComponent: () => void;
  onCloseEditor: () => void;
};

/**
 * Componente que muestra y permite editar las propiedades de un componente seleccionado
 */
const PropertyEditor: React.FC<PropertyEditorProps> = ({
  selectedComponent,
  onPropertyChange,
  onVisibilityToggle,
  onRemoveComponent,
  onCloseEditor
}) => {
  // Estado para la pestaña activa
  const [activeGroup, setActiveGroup] = useState<string>('Básicas');
  const [showColorPopover, setShowColorPopover] = useState<string | null>(null);

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        Selecciona un componente para editar sus propiedades
      </div>
    );
  }

  // Obtener propiedades del tipo de componente seleccionado
  const componentProperties = componentPropertiesMap[selectedComponent.type] || {};
  
  // Agrupar propiedades por categoría
  const propertyGroups: Record<string, Record<string, ComponentProperty>> = {
    'Básicas': {},
    'Apariencia': {},
    'Contenido': {},
    'Avanzadas': {}
  };
  
  // Clasificar propiedades en grupos
  Object.entries(componentProperties).forEach(([name, property]) => {
    const group = property.group || 'Básicas';
    if (!propertyGroups[group]) {
      propertyGroups[group] = {};
    }
    propertyGroups[group][name] = property;
  });

  // Obtener grupos que tienen propiedades para mostrar
  const availableGroups = Object.entries(propertyGroups)
    .filter(([_, props]) => Object.keys(props).length > 0)
    .map(([groupName]) => groupName);

  // Si no hay propiedades en el grupo activo pero hay en otros, cambiar al primer grupo disponible
  if (availableGroups.length > 0 && Object.keys(propertyGroups[activeGroup] || {}).length === 0) {
    if (!availableGroups.includes(activeGroup)) {
      setActiveGroup(availableGroups[0]);
    }
  }

  const handleToggleVisibility = () => {
    onVisibilityToggle(!selectedComponent.visible);
  };
  
  // Función auxiliar para renderizar el editor adecuado según el tipo de propiedad
  const renderPropertyEditor = (propertyName: string, propertyDef: ComponentProperty) => {
    // Valor actual de la propiedad
    const value = selectedComponent.properties[propertyName];
    const label = propertyDef.label || propertyName;
    const description = propertyDef.description || "";
    
    // Renderizar control específico según el tipo
    let control: React.ReactNode = null;
    
    switch (propertyDef.type) {
      case 'text':
        if (propertyDef.multiline) {
          control = (
            <Textarea 
              id={`prop-${propertyName}`}
              value={value as string || ''} 
              onChange={(e) => onPropertyChange(propertyName, e.target.value)}
              placeholder={propertyDef.placeholder}
              className="w-full"
              rows={4}
            />
          );
        } else {
          control = (
            <Input 
              id={`prop-${propertyName}`}
              type="text" 
              value={value as string || ''} 
              onChange={(e) => onPropertyChange(propertyName, e.target.value)}
              placeholder={propertyDef.placeholder}
              className="w-full"
            />
          );
        }
        break;
      
      case 'number':
        // Si tiene min y max definidos y es apropiado para slider
        if (propertyDef.min !== undefined && propertyDef.max !== undefined && 
            (propertyDef.max - propertyDef.min <= 100)) {
          control = (
            <div className="w-full flex flex-col gap-2">
              <Slider 
                id={`prop-${propertyName}`}
                value={[value as number || propertyDef.default || propertyDef.min || 0]} 
                min={propertyDef.min} 
                max={propertyDef.max}
                step={propertyDef.step || 1}
                onValueChange={(val) => onPropertyChange(propertyName, val[0])}
                className="w-full"
              />
              <div className="text-right text-sm text-gray-500">
                {value as number || propertyDef.default || 0}{propertyDef.unit}
              </div>
            </div>
          );
        } else {
          control = (
            <Input 
              id={`prop-${propertyName}`}
              type="number" 
              value={value as number || 0} 
              onChange={(e) => onPropertyChange(propertyName, parseFloat(e.target.value) || 0)}
              min={propertyDef.min}
              max={propertyDef.max}
              step={propertyDef.step || 1}
              className="w-full"
            />
          );
        }
        break;
      
      case 'boolean':
        control = (
          <div className="flex items-center space-x-2">
            <Switch 
              id={`prop-${propertyName}`}
              checked={!!value} 
              onCheckedChange={(checked) => onPropertyChange(propertyName, checked)}
            />
            <Label htmlFor={`prop-${propertyName}`} className="cursor-pointer">
              {value ? 'Activado' : 'Desactivado'}
            </Label>
          </div>
        );
        break;
      
      case PropertyType.COLOR:
        control = (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <div 
                className="w-10 h-6 rounded border border-gray-300 cursor-pointer relative"
                style={{ backgroundColor: value }}
                onClick={() => setShowColorPopover(propertyName)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowColorPopover(propertyName);
                    e.preventDefault();
                  }
                }}
                role="button"
                tabIndex={0}
              />
              <Input
                type="text" 
                id={`prop-${propertyName}`}
                value={value}
                onChange={(e) => onPropertyChange(propertyName, e.target.value)}
                className="flex-1"
              />
            </div>
            
            {/* Color Palettes */}
            {showColorPopover === propertyName && (
              <div className="bg-white rounded-md border border-gray-200 p-2 shadow-lg absolute z-50 mt-1 w-64">
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-700">Paletas para eventos</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {Object.entries(EVENT_COLOR_PALETTES).map(([eventType, palette]) => (
                      <div 
                        key={eventType}
                        className="flex flex-col items-center border border-gray-200 rounded p-1 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          onPropertyChange(propertyName, palette[propertyName.toLowerCase() as keyof typeof palette] || palette.primary);
                          setShowColorPopover(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onPropertyChange(propertyName, palette[propertyName.toLowerCase() as keyof typeof palette] || palette.primary);
                            setShowColorPopover(null);
                            e.preventDefault();
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.primary }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.secondary }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.accent }} />
                        </div>
                        <span className="text-xs">{palette.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="text-xs text-gray-500 w-full text-center mt-1"
                  onClick={() => setShowColorPopover(null)}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        );
        break;
      
      case 'date':
        control = (
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? 
                    format(new Date(value as string), 'P', { locale: es }) : 
                    <span>Seleccionar fecha</span>
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value as string) : undefined}
                  onSelect={(date) => date && onPropertyChange(propertyName, date.toISOString())}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        );
        break;
      
      case 'select':
        control = (
          <Select
            value={value as string || ''}
            onValueChange={(val) => onPropertyChange(propertyName, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar opción" />
            </SelectTrigger>
            <SelectContent>
              {propertyDef.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;
        
      case 'image':
        control = (
          <div className="space-y-2">
            <ResourceSelector 
              value={value as string || ''}
              onChange={(val: string) => onPropertyChange(propertyName, val)}
              label={label}
              aspectRatio={propertyDef.aspectRatio}
            />
          </div>
        );
        break;
        
      default:
        control = (
          <div className="text-sm text-gray-500">
            Tipo de propiedad no soportado: {propertyDef.type}
          </div>
        );
    }
    
    // Envolver en un contenedor con etiqueta y descripción
    return (
      <div key={propertyName} className="space-y-1.5 mb-4">
        <Label htmlFor={`prop-${propertyName}`} className="text-sm font-medium">
          {label}
          {propertyDef.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {control}
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Cabecera */}
      <div className="p-4 border-b flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Badge variant={selectedComponent.visible ? "default" : "secondary"}>
            {componentTypeNames[selectedComponent.type] || selectedComponent.type}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggleVisibility}
            title={selectedComponent.visible ? "Ocultar" : "Mostrar"}
          >
            {selectedComponent.visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onRemoveComponent}
          >
            Cerrar
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onCloseEditor}
          >
            <X size={18} />
          </Button>
        </div>
      </div>
      
      {/* Contenedor principal */}
      <div className="h-[calc(100vh-240px)] overflow-auto">
        {/* Panel de navegación de grupos */}
        <div className="sticky top-0 z-10 bg-white border-b p-2 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-2 ml-2">Editar propiedades:</h3>
          <div className="flex overflow-x-auto gap-1 pb-2">
            {availableGroups.map(groupName => {
              const groupInfo = PROPERTY_GROUPS[groupName as keyof typeof PROPERTY_GROUPS];
              const isActive = activeGroup === groupName;
              const Icon = groupInfo?.icon || Settings;
              const IconComponent = Icon;
              
              return (
                <div 
                  key={groupName}
                  onClick={() => setActiveGroup(groupName)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveGroup(groupName);
                      e.preventDefault();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`
                    flex-shrink-0 cursor-pointer px-3 py-2 rounded-md flex items-center gap-2 min-w-[120px]
                    ${isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                  `}
                >
                  <IconComponent size={18} />
                  <span className="text-sm font-medium">{groupName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contenido principal - Propiedades agrupadas */}
        <div className="p-4">
          {availableGroups.length === 0 ? (
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-center">
              <HelpCircle className="mx-auto mb-2" size={24} />
              <p>Este componente no tiene propiedades configurables</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Mostrar solo el grupo activo */}
              {Object.entries(propertyGroups)
                .filter(([groupName]) => groupName === activeGroup)
                .map(([groupName, properties]) => (
                  <Card key={groupName} className="shadow-sm border-gray-200">
                    <CardHeader className="bg-gray-50 pb-3 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const IconComponent = PROPERTY_GROUPS[groupName as keyof typeof PROPERTY_GROUPS]?.icon;
                            return IconComponent ? <IconComponent className="text-primary" size={18} /> : null;
                          })()}
                          <CardTitle className="text-base">{groupName}</CardTitle>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Restablecer valores predeterminados"
                          >
                            <RefreshCw size={14} className="mr-1" />
                            Restablecer
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="text-xs text-gray-500 mt-1">
                        {PROPERTY_GROUPS[groupName as keyof typeof PROPERTY_GROUPS]?.description || ""}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-4 space-y-5">
                      {Object.entries(properties).map(([propName, propDef]) => (
                        <div key={propName} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label 
                              htmlFor={`prop-${propName}`} 
                              className="font-medium text-sm"
                            >
                              {propDef.label || propName}
                            </Label>
                            
                            {propDef.description && (
                              <span 
                                className="text-gray-400 cursor-help text-xs flex items-center hover:text-gray-600"
                                title={propDef.description}
                              >
                                <HelpCircle size={14} />
                              </span>
                            )}
                          </div>
                          
                          <div className="relative">
                            {renderPropertyEditor(propName, propDef)}
                            
                            {/* Previsualización para propiedades de color */}
                            {propDef.type === PropertyType.COLOR && selectedComponent.properties[propName] && (
                              <div 
                                className="absolute right-0 top-0 h-full flex items-center pr-3"
                                title="Color actual"
                              >
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300" 
                                  style={{ backgroundColor: selectedComponent.properties[propName] as string }}
                                />
                              </div>
                            )}
                          </div>
                          
                          {propDef.description && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              {propDef.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyEditor;
