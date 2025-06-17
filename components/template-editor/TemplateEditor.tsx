"use client"

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateCode } from './codeGenerator';
import { Invitation, PackageType } from '@/types/invitation';
import { TemplateConfig } from './types';
import { ComponentType } from './types'; 
import PropertyEditor from './property-editor/PropertyEditor';
import { Loader2, Save, Eye } from 'lucide-react';
import './mobile/mobile-editor.css';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileTemplateEditor from './mobile/MobileTemplateEditor';
import './mobile/mobile-editor.css';

interface TemplateEditorProps {
  invitation: Invitation;
  onSave: (config: any) => Promise<void>;
  isSaving?: boolean;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  invitation,
  onSave,
  isSaving = false
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [previewCode, setPreviewCode] = useState<{ html: string; css: string; js: string } | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // Obtener los componentes predeterminados según el tipo de paquete
  // Envolverlo en useCallback para optimizar su uso en useEffect
  const getDefaultComponents = React.useCallback((packageType: PackageType) => {
    // Componentes base disponibles en todos los paquetes
    const baseComponents = [
      {
        id: 'hero-1',
        type: ComponentType.HERO,
        order: 1,
        visible: true,
        properties: {
          title: invitation.config?.title || 'Nuestra Celebración',
          subtitle: 'Te invitamos a compartir este momento especial',
          backgroundImage: '',
        }
      },
      {
        id: 'event-details-1',
        type: ComponentType.EVENT_DETAILS,
        order: 2,
        visible: true,
        properties: {
          title: 'Detalles del Evento',
          date: '31 de Diciembre, 2023',
          time: '20:00',
          location: 'Salón de Eventos',
          locationUrl: '',
        }
      }
    ];
    
    return baseComponents;
  }, [invitation.config]);
  
  // Inicializar la configuración de la plantilla a partir de la invitación
  useEffect(() => {
    if (invitation && invitation.config) {
      // Construir la configuración inicial para el editor
      const initialConfig: TemplateConfig = {
        id: invitation.id,
        name: invitation.config.title || 'Invitación sin título',
        components: getDefaultComponents(invitation.packageType) as any,
        theme: {
          name: invitation.config.title,
          colors: {
            primary: invitation.config.theme?.primaryColor || '#9333ea',
            secondary: invitation.config.theme?.secondaryColor || '#6b21a8',
            background: '#ffffff',
            text: '#333333',
            accent: '#ffd700',
          },
          fonts: {
            heading: invitation.config.theme?.fontFamily || 'Playfair Display',
            body: 'Montserrat',
            accent: 'Dancing Script',
          }
        }
      };
      
      setConfig(initialConfig);
    }
  }, [invitation, getDefaultComponents]);

  // Generar el código de previsualización cuando cambie la configuración
  useEffect(() => {
    if (config) {
      try {
        const code = generateCode(config);
        setPreviewCode(code);
      } catch (error) {
        console.error("Error generating preview code:", error);
      }
    }
  }, [config]);

  // Actualizar una propiedad específica de un componente
  const handleComponentUpdate = (componentId: string, propertyName: string, value: any) => {
    if (!config) return;
    
    setConfig((prevConfig: TemplateConfig | null) => {
      if (!prevConfig) return prevConfig;
      
      const updatedComponents = prevConfig.components.map((component: any) => {
        if (component.id === componentId) {
          return {
            ...component,
            properties: {
              ...component.properties,
              [propertyName]: value
            }
          };
        }
        return component;
      });
      
      return {
        ...prevConfig,
        components: updatedComponents
      };
    });
  };

  // Actualizar la visibilidad de un componente
  const handleComponentVisibilityChange = (componentId: string, visible: boolean) => {
    if (!config) return;
    
    setConfig((prevConfig: TemplateConfig | null) => {
      if (!prevConfig) return prevConfig;
      
      const updatedComponents = prevConfig.components.map((component: any) => {
        if (component.id === componentId) {
          return {
            ...component,
            visible
          };
        }
        return component;
      });
      
      return {
        ...prevConfig,
        components: updatedComponents
      };
    });
  };

  // Actualizar el tema de la plantilla
  const handleThemeUpdate = (property: string, value: any) => {
    if (!config) return;
    
    setConfig((prevConfig: TemplateConfig | null) => {
      if (!prevConfig) return prevConfig;
      
      // Manejar actualización de colores
      if (property.startsWith('colors.')) {
        const colorKey = property.split('.')[1];
        return {
          ...prevConfig,
          theme: {
            ...prevConfig.theme,
            colors: {
              ...prevConfig.theme.colors,
              [colorKey]: value
            }
          }
        };
      }
      
      // Manejar actualización de fuentes
      if (property.startsWith('fonts.')) {
        const fontKey = property.split('.')[1];
        // Asegurar que el objeto fonts exista y que el valor nunca sea undefined
        const currentFonts = prevConfig.theme.fonts || {
          heading: 'Playfair Display',
          body: 'Montserrat',
          accent: 'Dancing Script'
        };
        return {
          ...prevConfig,
          theme: {
            ...prevConfig.theme,
            fonts: {
              ...currentFonts,
              [fontKey]: value || 'Playfair Display' // Valor por defecto si es undefined
            }
          }
        };
      }
      
      return prevConfig;
    });
  };

  // Guardar la configuración actualizada
  const handleSave = async () => {
    if (!config) return;
    
    // Convertir la configuración del editor al formato esperado por la API
    const updatedConfig = {
      title: config.name,
      eventDate: config.components.find((c: any) => c.type === ComponentType.EVENT_DETAILS)?.properties.date || '',
      eventTime: config.components.find((c: any) => c.type === ComponentType.EVENT_DETAILS)?.properties.time || '',
      location: config.components.find((c: any) => c.type === ComponentType.EVENT_DETAILS)?.properties.location || '',
      eventType: invitation.config.eventType,
      hostNames: [config.components.find((c: any) => c.type === ComponentType.THANK_YOU)?.properties.signature || ''],
      rsvpEnabled: config.components.find((c: any) => c.type === ComponentType.ATTENDANCE)?.visible || true,
      theme: {
        primaryColor: config.theme.colors.primary,
        secondaryColor: config.theme.colors.secondary,
        fontFamily: config.theme.fonts?.heading || 'Playfair Display',
      },
      components: {
        hero: config.components.find((c: any) => c.type === ComponentType.HERO)?.visible || true,
        details: config.components.find((c: any) => c.type === ComponentType.EVENT_DETAILS)?.visible || true,
        countdown: config.components.find((c: any) => c.type === ComponentType.COUNTDOWN)?.visible || false,
        gallery: config.components.find((c: any) => c.type === ComponentType.GALLERY)?.visible || false,
        music: config.components.find((c: any) => c.type === ComponentType.MUSIC_PLAYER)?.visible || false,
        attendance: config.components.find((c: any) => c.type === ComponentType.ATTENDANCE)?.visible || true,
        gifts: true, // Siempre habilitado por ahora
        itinerary: config.components.find((c: any) => c.type === ComponentType.ITINERARY)?.visible || false,
        accommodation: config.components.find((c: any) => c.type === ComponentType.ACCOMMODATION)?.visible || false,
      },
      templateId: invitation.config.templateId,
      editorConfig: config, // Guardar la configuración completa del editor para futura edición
    };
    
    await onSave(updatedConfig);
  };

  // Alternar la vista previa
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  // Si no hay configuración, mostrar un estado de carga
  if (!config) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si es un dispositivo móvil, usar la versión móvil del editor
  if (isMobile) {
    return (
      <MobileTemplateEditor 
        invitation={invitation}
        onSave={onSave}
        isSaving={isSaving}
      />
    );
  }

  // Versión de escritorio del editor
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editor de Plantilla</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewVisible ? 'Ocultar' : 'Vista'} previa
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel de edición */}
        <div className={`lg:col-span-${previewVisible ? 1 : 3}`}>
          <Card className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="theme">Tema</TabsTrigger>
                <TabsTrigger value="components">Componentes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <PropertyEditor
                  component={{
                    id: 'general',
                    type: 'general' as any,
                    order: 0,
                    visible: true,
                    properties: {
                      name: config.name
                    }
                  }}
                  schema={{
                    name: {
                      type: 'text',
                      label: 'Título de la invitación',
                      description: 'Este será el título principal de tu invitación',
                      required: true
                    }
                  }}
                  onChange={(name, value) => {
                    setConfig(prev => prev ? { ...prev, name: value } : null);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="theme" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Personaliza el tema</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Colores</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Controles para colores */}
                      {Object.entries(config.theme.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <label className="text-sm capitalize min-w-[100px]">{key}:</label>
                          <div className="flex-1">
                            <input 
                              type="color" 
                              value={value} 
                              onChange={(e) => handleThemeUpdate(`colors.${key}`, e.target.value)}
                              className="w-full h-8 cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Fuentes</h4>
                    <div className="space-y-4">
                      {/* Controles para fuentes (simplificado por ahora) */}
                      {config.theme.fonts && Object.entries(config.theme.fonts).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <label className="text-sm capitalize min-w-[100px]">{key}:</label>
                          <select 
                            value={value || ''} 
                            onChange={(e) => handleThemeUpdate(`fonts.${key}`, e.target.value)}
                            className="flex-1 p-2 border rounded"
                          >
                            <option value="Playfair Display">Playfair Display</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Dancing Script">Dancing Script</option>
                            <option value="Lora">Lora</option>
                            <option value="Nunito">Nunito</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="components" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Administra los componentes</h3>
                
                {/* Acordeón de componentes */}
                <div className="space-y-4">
                  {config.components.map((component) => (
                    <details key={component.id} className="border rounded-lg">
                      <summary className="p-3 font-medium cursor-pointer flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={component.visible}
                            onChange={(e) => handleComponentVisibilityChange(component.id, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span>{
                            {
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
                            }[component.type] || component.type
                          }</span>
                        </div>
                      </summary>
                      <div className="p-4 border-t">
                        {component.visible ? (
                          <PropertyEditor
                            component={component}
                            onChange={handleComponentUpdate}
                          />
                        ) : (
                          <Alert>
                            <AlertDescription>
                              Este componente está desactivado. Actívalo para editar sus propiedades.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Vista previa */}
        {previewVisible && previewCode && (
          <div className="lg:col-span-2">
            <Card className="h-full overflow-hidden">
              <div className="h-[800px] overflow-hidden">
                <iframe 
                  srcDoc={`
                    ${previewCode.html}
                    <style>${previewCode.css}</style>
                    <script>${previewCode.js}</script>
                  `}
                  className="w-full h-full border-0"
                  title="Vista previa de la invitación"
                ></iframe>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateEditor;
