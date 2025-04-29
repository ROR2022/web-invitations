"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TemplateConfig, ComponentConfig, ComponentType } from './types';
import InvitationPreview from './InvitationPreview';
import PropertyEditor from './PropertyEditor';
import ThemeEditor from './ThemeEditor';
import { defaultTheme } from './themeSchemas';
import { componentDefaultProps } from './configurable/componentSchemas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Save, 
  ArrowLeft,
  Grid,
  Palette,
  Layers,
  Eye,
  EyeOff,
  PanelLeft
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DraggableComponentList from './DraggableComponentList';
import { useDebounce } from 'use-debounce';
import isEqual from 'lodash/isEqual';

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

type TemplateEditorProps = {
  initialConfig?: TemplateConfig;
  templateId?: string;
  onSave?: (config: TemplateConfig) => Promise<void>;
  onBack?: () => void;
};

/**
 * Editor de plantillas principal
 * Integra la previsualización y el editor de propiedades
 */
const TemplateEditor: React.FC<TemplateEditorProps> = ({
  initialConfig,
  templateId,
  onSave,
  onBack
}) => {
  // Configuración inicial de la plantilla
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(() => {
    if (initialConfig) {
      return { ...initialConfig };
    }
    
    // Si no hay configuración inicial, crear una plantilla básica
    return {
      id: templateId || uuidv4(),
      name: 'Nueva Plantilla',
      description: 'Descripción de la plantilla',
      theme: { ...defaultTheme },
      components: []
    };
  });
  
  // Estado para el componente seleccionado
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showComponentPanel, setShowComponentPanel] = useState(true);
  const [addComponentDialogOpen, setAddComponentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('components');
  
  // Estado para indicar el estado de guardado
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  // Referencia al último config guardado para comparación profunda
  const lastSavedConfigRef = useRef<TemplateConfig | null>(null);
  
  // Establecer la referencia inicial al cargar el componente
  useEffect(() => {
    if (initialConfig) {
      lastSavedConfigRef.current = structuredClone(initialConfig);
      console.log('[DEBUG] Initial config reference set');
    }
  }, [initialConfig]);
  
  // Debounce sobre la configuración para el guardado automático
  const [debouncedConfig] = useDebounce(templateConfig, 2000);
  
  // Effect para el guardado automático cuando cambia la configuración
  useEffect(() => {
    // Skip si no hay función de guardado
    if (!onSave) return;
    
    // Comparación profunda para verificar si realmente hay cambios
    const hasRealChanges = !isEqual(debouncedConfig, lastSavedConfigRef.current);
    
    console.log('[DEBUG] Auto-save effect triggered', {
      timestamp: new Date().toISOString(),
      hasOnSaveFunction: !!onSave,
      hasRealChanges,
      debouncedConfigId: debouncedConfig?.id,
      templateConfigId: templateConfig?.id,
      componentsCount: debouncedConfig?.components?.length || 0,
      saveStatus
    });
    
    // No hacemos nada si no hay cambios reales
    if (!hasRealChanges) {
      console.log('[DEBUG] No real changes detected, skipping auto-save');
      return;
    }
    
    // Solo cambiamos el estado visual para mantener la UI coherente
    if (saveStatus === 'saved') {
      console.log('[DEBUG] Marking as unsaved');
      setSaveStatus('unsaved');
    }
    
    // Ejecutamos el guardado automático
    const autoSave = async () => {
      try {
        // Ya se marcó como unsaved arriba, ahora lo marcamos como saving
        setSaveStatus('saving');
        await onSave(debouncedConfig);
        // Actualizamos la referencia con el config guardado
        lastSavedConfigRef.current = structuredClone(debouncedConfig);
        setSaveStatus('saved');
        console.log('[DEBUG] Auto-save completed successfully');
      } catch (error) {
        console.error('Error al guardar automáticamente:', error);
        setSaveStatus('unsaved');
      }
    };
    
    // Iniciar el guardado automático
    autoSave();
  }, [debouncedConfig, onSave, saveStatus, templateConfig?.id]);
  
  // Obtener el componente seleccionado
  const selectedComponent = selectedComponentId
    ? templateConfig.components.find(c => c.id === selectedComponentId) || null
    : null;
  
  // Limpiar la selección si el componente se elimina
  useEffect(() => {
    if (selectedComponentId && !templateConfig.components.some(c => c.id === selectedComponentId)) {
      setSelectedComponentId(null);
    }
    if (selectedComponent){
      console.warn('Componente seleccionado: ', selectedComponent);
    }
  }, [templateConfig.components, selectedComponentId, selectedComponent]);
  
  // Manejar cambios en el nombre de la plantilla
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateConfig(prev => ({
      ...prev,
      name: e.target.value
    }));
  };
  
  // Manejar selección de componente
  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
    setShowComponentPanel(true);
    setActiveTab('components');
  };
  
  // Manejar cambios en las propiedades de un componente
  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedComponentId) return;
    
    setTemplateConfig(prev => ({
      ...prev,
      components: prev.components.map(component => 
        component.id === selectedComponentId 
          ? {
              ...component,
              properties: {
                ...component.properties,
                [property]: value
              }
            }
          : component
      )
    }));
  };
  
  // Manejar cambios en la visibilidad de un componente
  const handleVisibilityToggle = (visible: boolean) => {
    if (!selectedComponentId) return;
    
    setTemplateConfig(prev => ({
      ...prev,
      components: prev.components.map(component => 
        component.id === selectedComponentId 
          ? { ...component, visible }
          : component
      )
    }));
  };
  
  // Eliminar un componente
  const handleRemoveComponent = () => {
    if (!selectedComponentId) return;
    
    setTemplateConfig(prev => ({
      ...prev,
      components: prev.components.filter(component => component.id !== selectedComponentId)
    }));
    
    setSelectedComponentId(null);
  };
  
  // Añadir un nuevo componente
  const handleAddComponent = (type: ComponentType) => {
    // Crear un nuevo componente con propiedades por defecto
    const newComponent: ComponentConfig = {
      id: uuidv4(),
      type,
      order: templateConfig.components.length,
      visible: true,
      properties: { ...componentDefaultProps[type] }
    };
    
    setTemplateConfig(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
    
    // Seleccionar el nuevo componente
    setSelectedComponentId(newComponent.id);
    setAddComponentDialogOpen(false);
    setShowComponentPanel(true);
    setActiveTab('components');
  };
  
  // Manejar cambios en el tema
  const handleThemeChange = (property: string, value: any) => {
    setTemplateConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        colors: {
          ...prev.theme.colors,
          [property]: value
        }
      }
    }));
  };
  
  // Manejar guardado manual
  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      console.log('[DEBUG] Manual save initiated');
      setSaveStatus('saving');
      await onSave(templateConfig);
      
      // Actualizamos la referencia con el config guardado tras guardado exitoso
      lastSavedConfigRef.current = structuredClone(templateConfig);
      
      console.log('[DEBUG] Manual save completed');
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error al guardar:', error);
      setSaveStatus('unsaved');
    }
  };
  
  // Reordenar componentes
  const handleMoveComponent = (componentId: string, direction: 'up' | 'down') => {
    const componentIndex = templateConfig.components.findIndex(c => c.id === componentId);
    if (componentIndex === -1) return;
    
    const newComponents = [...templateConfig.components];
    const component = newComponents[componentIndex];
    
    if (direction === 'up' && componentIndex > 0) {
      newComponents[componentIndex] = newComponents[componentIndex - 1];
      newComponents[componentIndex - 1] = component;
    } else if (direction === 'down' && componentIndex < newComponents.length - 1) {
      newComponents[componentIndex] = newComponents[componentIndex + 1];
      newComponents[componentIndex + 1] = component;
    }
    
    // Actualizar el orden de todos los componentes
    const updatedComponents = newComponents.map((c, index) => ({
      ...c,
      order: index
    }));
    
    setTemplateConfig(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Barra superior */}
      <div className="border-b bg-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={18} className="mr-1" />
            Volver
          </Button>
          <div className="h-5 border-l mx-2"></div>
          <Input
            value={templateConfig.name}
            onChange={handleNameChange}
            className="max-w-xs font-medium"
            placeholder="Nombre de la plantilla"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <EyeOff size={18} className="mr-1" />
                Edición
              </>
            ) : (
              <>
                <Eye size={18} className="mr-1" />
                Vista previa
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComponentPanel(!showComponentPanel)}
          >
            <PanelLeft size={18} className="mr-1" />
            {showComponentPanel ? 'Ocultar panel' : 'Mostrar panel'}
          </Button>
          
          <div className="text-sm text-muted-foreground mx-2">
            {saveStatus === 'saved' && (
              <span className="flex items-center text-green-600">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardado
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="flex items-center text-yellow-600">
                <svg className="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Guardando...
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="flex items-center text-amber-600">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Cambios sin guardar
              </span>
            )}
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={saveStatus === 'saving'}
            className={saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <Save size={18} className="mr-2" />
            {saveStatus === 'saving' ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel lateral */}
        {showComponentPanel && (
          <div className="w-80 border-r bg-gray-50 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b px-2 pt-2">
                <TabsList className="justify-start bg-transparent rounded-none border-0">
                  <TabsTrigger value="components" className="flex items-center">
                    <Layers size={16} className="mr-1" />
                    Componentes
                  </TabsTrigger>
                  <TabsTrigger value="theme" className="flex items-center">
                    <Palette size={16} className="mr-1" />
                    Tema
                  </TabsTrigger>
                </TabsList>
                
                <Button 
                  onClick={() => setAddComponentDialogOpen(true)} 
                  variant="default" 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              <TabsContent value="components" className="flex-1 flex flex-col p-0 m-0">
                {selectedComponent ? (
                  <PropertyEditor
                    selectedComponent={selectedComponent}
                    onPropertyChange={handlePropertyChange}
                    onVisibilityToggle={handleVisibilityToggle}
                    onRemoveComponent={handleRemoveComponent}
                    onCloseEditor={() => setSelectedComponentId(null)}
                  />
                ) : (
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium mb-4">Componentes de la invitación</h3>
                    
                    {templateConfig.components.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 flex-1 flex flex-col items-center justify-center">
                        <p className="mb-4">No hay componentes en esta plantilla</p>
                        <div className="animate-pulse">
                          <Button 
                            onClick={() => setAddComponentDialogOpen(true)} 
                            variant="default" 
                            size="lg"
                            className="bg-primary hover:bg-primary/90 shadow-lg border-2 border-primary/30 text-white font-semibold"
                          >
                            <Plus size={22} className="mr-2" />
                            Añadir Componente
                          </Button>
                        </div>
                        <p className="mt-6 text-sm">👆 Haz clic aquí para comenzar a crear tu invitación</p>
                        <p className="mt-2 text-sm text-muted-foreground">O usa el botón + en la barra superior</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 flex-1 overflow-y-auto">
                          <div className="p-2 mb-4 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700 mb-1 font-medium">🖱️ Cómo editar componentes</p>
                            <div className="flex flex-col gap-2">
                              <div className="p-2 bg-white rounded border border-blue-100">
                                <div className="flex items-center">
                                  <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2">1</div>
                                  <p className="text-xs font-medium text-blue-800">Selecciona un componente</p>
                                </div>
                                <p className="text-xs text-blue-600 mt-1 ml-7">
                                  Haz clic en un componente de la lista o directamente en el componente en la previsualización
                                </p>
                              </div>
                              
                              <div className="p-2 bg-white rounded border border-blue-100">
                                <div className="flex items-center">
                                  <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2">2</div>
                                  <p className="text-xs font-medium text-blue-800">Edita sus propiedades</p>
                                </div>
                                <p className="text-xs text-blue-600 mt-1 ml-7">
                                  Aparecerá un panel con todos los elementos que puedes personalizar
                                </p>
                              </div>
                              
                              <div className="p-2 bg-white rounded border border-blue-100">
                                <div className="flex items-center">
                                  <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2">3</div>
                                  <p className="text-xs font-medium text-blue-800">Para el componente &quot;Portada&quot;:</p>
                                </div>
                                <ul className="text-xs text-blue-600 mt-1 ml-7 space-y-1">
                                  <li><span className="font-medium">→ Imagen de fondo:</span> Busca la pestaña &quot;Apariencia&quot; y haz clic en &quot;Imagen de fondo&quot; para seleccionar una imagen</li>
                                  <li><span className="font-medium">→ Textos:</span> En la pestaña &quot;Contenido&quot;, puedes editar los campos &quot;Título&quot;, &quot;Subtítulo&quot; y &quot;Nombre&quot;</li>
                                  <li><span className="font-medium">→ Colores:</span> Dentro de la pestaña &quot;Apariencia&quot;, encontrarás &quot;Superposición&quot; y &quot;Color de texto&quot;</li>
                                </ul>
                                <p className="mt-2 text-xs text-blue-600 ml-7 italic">
                                  El editor usa pestañas para organizar las propiedades por categorías.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <DraggableComponentList
                            components={templateConfig.components}
                            selectedComponentId={selectedComponentId}
                            onSelectComponent={setSelectedComponentId}
                            onReorderComponents={(updatedComponents) => {
                              setTemplateConfig({
                                ...templateConfig,
                                components: updatedComponents
                              });
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="theme" className="flex-1 p-0 m-0">
                <ThemeEditor 
                  theme={templateConfig.theme} 
                  onThemeChange={handleThemeChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Área de previsualización */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {templateConfig.components.length === 0 && !showComponentPanel && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">¡Comienza a crear tu invitación!</h3>
                <p className="mb-6 text-gray-600">Para añadir elementos a tu invitación, haz clic en el botón de abajo. Luego, puedes editar los componentes directamente en la previsualización o en el panel de propiedades.</p>
                <Button 
                  onClick={() => {
                    setShowComponentPanel(true);
                    setActiveTab('components');
                    setTimeout(() => setAddComponentDialogOpen(true), 300);
                  }} 
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus size={20} className="mr-2" />
                  Añadir tu primer componente
                </Button>
              </div>
            </div>
          )}
          <InvitationPreview
            config={templateConfig}
            isEditing={!isPreviewMode}
            onComponentSelect={!isPreviewMode ? handleComponentSelect : undefined}
            onPropertyChange={!isPreviewMode ? (componentId, property, value) => {
              setSelectedComponentId(componentId);
              handlePropertyChange(property, value);
            } : undefined}
          />
        </div>
      </div>
      
      {/* Diálogo para añadir componentes */}
      <Dialog open={addComponentDialogOpen} onOpenChange={setAddComponentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir nuevo componente</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 py-4">
            {Object.entries(componentTypeNames).map(([type, name]) => (
              <Button
                key={type}
                variant="outline"
                className="h-20 flex flex-col justify-center items-center gap-2"
                onClick={() => handleAddComponent(type as ComponentType)}
              >
                <Plus size={18} />
                {name}
              </Button>
            ))}
          </div>
          <DialogFooter className="flex justify-between items-center gap-3 mt-2">
            <div className="text-sm text-muted-foreground">
              <p>Selecciona un componente para añadirlo a tu invitación</p>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateEditor;
