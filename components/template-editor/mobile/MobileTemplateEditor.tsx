"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitation } from '@/types/invitation';
import { TemplateConfig, ComponentType } from '../types';
//import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X, Check, History, RotateCcw, RotateCw, WifiOff } from 'lucide-react';

// Componentes internos
import MobileEditModal from './MobileEditModal';
import MobileHistoryPanel from './MobileHistoryPanel';
import { withMobileEditing } from './withMobileEditing';
import MobileEditorProvider, { useMobileEditor } from './MobileEditorContext';
import MobileComponentWrapper, { EditableMobileComponent } from './MobileComponentWrapper';

// Servicios y hooks para guardado progresivo
import { useProgressiveSaving } from '@/hooks/use-progressive-saving';
import { preloadResources } from '@/services/resource-cache.service';
import { useImageOptimizer } from '@/hooks/use-image-optimizer';

// Componentes optimizados de la Fase 5
import { useConditionalRender } from '@/hooks/use-conditional-render';
import { useDevice } from '@/hooks/use-mobile';
import LazyRender from '@/components/ui/lazy-render';
import OptimizedTransition from '@/components/ui/optimized-transition';
import ResponsiveRender from '@/components/ui/responsive-render';
import OptimizedResponsiveRenderer from '@/components/ui/optimized-responsive-renderer';
import NetworkAwareContainer from '@/components/ui/network-aware-container';
import NetworkErrorHandler from '@/components/ui/network-error-handler';
import useResourceOptimizer from '@/hooks/use-resource-optimizer';
import { preloadResourcesWithPriority, ResourcePriority, initNetworkMonitor } from '@/services/network-optimization.service';
import { extractResourcesFromConfig, shouldLazyLoadComponent, ResourceItem } from './mobile-resource-optimization';
import { getShouldOptimizeComponent } from './network-render-utils';
import { updateRenderEditableComponents } from './render-component-utils';

// Estilos
import './mobile-history.css';
import './mobile-optimized.css';

// Tipos
interface MobileTemplateEditorProps {
  invitation: Invitation;
  onSave: (config: any) => Promise<void>;
  isSaving?: boolean;
}

/**
 * Componente interno que usa el contexto
 */
const MobileTemplateEditorInner: React.FC<MobileTemplateEditorProps> = ({
  invitation,
  onSave,
  isSaving: externalIsSaving = false
}) => {
  // Obtener el estado del contexto
  const {
    isEditMode,
    activeComponentId,
    pendingChanges,
    setIsEditMode,
    setActiveComponentId,
    updatePendingChange,
    clearPendingChangesForComponent,
    hasPendingChanges: hasComponentChanges
  } = useMobileEditor();

  // Estados locales
  const [searchString, setSearchString] = useState('');
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<'slow' | 'medium' | 'fast'>('medium');
  
  // Custom hook para optimización de imágenes
  const { optimizeComponentImages } = useImageOptimizer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Obtener los componentes predeterminados según el tipo de paquete
  // Esta función debería ser exactamente igual a la del TemplateEditor normal
  // para mantener la compatibilidad
  const getDefaultComponents = React.useCallback((packageType: any) => {
    // Importar la lógica existente del TemplateEditor principal
    // Por simplicidad, aquí solo incluimos un esqueleto
    const baseComponents = [
      {
        id: 'hero-1',
        type: ComponentType.HERO,
        order: 1,
        visible: true,
        properties: {
          title: invitation?.config?.title || 'Nuestra Celebración',
          subtitle: 'Te invitamos a compartir este momento especial',
          backgroundImage: '',
        }
      },
      // Aquí irían el resto de componentes
    ];
    
    return baseComponents;
  }, [invitation?.config?.title]);

  // Inicializar configuración y usar el hook de guardado progresivo
  const initialConfig = React.useMemo(() => {
    if (invitation && invitation.config) {
      // Usar la misma lógica que el TemplateEditor para construir la configuración inicial
      return {
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
    }
    return null;
  }, [invitation, getDefaultComponents]);

  // Usar el hook de guardado progresivo
  const {
    config,
    setConfig,
    hasPendingChanges,
    isSaving: isInternalSaving,
    saveChanges,
    saveAllChanges,
    undoChange,
    redoChange,
    history,
    canUndo,
    canRedo,
    restoreVersion,
    discardChanges
  } = useProgressiveSaving({
    invitationId: invitation.id,
    initialConfig,
    onSave
  });

  // Combinar estado de guardado interno y externo
  const isSaving = externalIsSaving || isInternalSaving;
  
  // Estado para detectar dispositivo
  const { isMobile, isTablet, deviceType } = useDevice();
  
  // Estado para controlar la carga de recursos
  const [resourcesStatus, setResourcesStatus] = useState<{[key: string]: 'loading' | 'loaded' | 'error'}>({});
  
  // Función de utilidad para gestionar recursos
  const handleResourceLoad = (resourceUrl: string, status: 'loading' | 'loaded' | 'error') => {
    setResourcesStatus(prev => ({
      ...prev,
      [resourceUrl]: status
    }));
  };

  // Inicializar monitor de red y precarga de recursos optimizada
  useEffect(() => {
    // Inicializar monitor de red
    initNetworkMonitor();
    
    // Precargar recursos críticos cuando config esté disponible
    if (config) {
      const resources = extractResourcesFromConfig(config);
      
      // Filtrar solo recursos críticos para carga inicial
      const criticalResources = resources.filter(
        resource => resource.priority === ResourcePriority.CRITICAL
      );
      
      // Precargar con prioridades
      preloadResourcesWithPriority(criticalResources);
      
      // Simular finalización de carga después de un tiempo
      const timer = setTimeout(() => {
        setIsResourcesLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      // La limpieza se maneja internamente en el servicio
    };
  }, [config]);
  
  // Usar el optimizador de recursos
  const { isLoading: resourcesLoading } = useResourceOptimizer({
    resources: config ? extractResourcesFromConfig(config).map(item => item.url) : [],
    autoPreload: true,
    initMonitor: true,
    onLoaded: () => setIsResourcesLoading(false)
  });
  
  // Actualizar el estado de carga de recursos
  useEffect(() => {
    // Establecer un tiempo máximo de carga para mejorar UX
    if (resourcesLoading) {
      setIsResourcesLoading(true);
      const timer = setTimeout(() => {
        setIsResourcesLoading(false);
      }, 3000); // Tiempo máximo de espera
      
      return () => clearTimeout(timer);
    } else {
      setIsResourcesLoading(false);
    }
  }, [resourcesLoading]);
  
  // Estado para la calidad de red ya definido anteriormente
  
  // Actualizar calidad de red basado en mediciones
  useEffect(() => {
    const handleNetworkQualityChange = (quality: 'slow' | 'medium' | 'fast') => {
      setNetworkQuality(quality);
    };
    
    // Registrar listener para cambios de calidad de red
    window.addEventListener('network-quality-change', ((event: CustomEvent) => {
      handleNetworkQualityChange(event.detail.quality);
    }) as EventListener);
    
    return () => {
      window.removeEventListener('network-quality-change', ((event: CustomEvent) => {
        handleNetworkQualityChange(event.detail.quality);
      }) as EventListener);
    };
  }, []);

  // Usar efecto para cargar recursos al montar el componente
  useEffect(() => {
    if (config) {
      setIsResourcesLoading(true);
      
      // Recopilar recursos con prioridades según la Fase 5
      const criticalResources: Array<{url: string, type: 'image' | 'audio' | 'other', priority: ResourcePriority}> = [];
      const highResources: Array<{url: string, type: 'image' | 'audio' | 'other', priority: ResourcePriority}> = [];
      const mediumResources: Array<{url: string, type: 'image' | 'audio' | 'other', priority: ResourcePriority}> = [];
      const lowResources: Array<{url: string, type: 'image' | 'audio' | 'other', priority: ResourcePriority}> = [];
      
      // Extraer URLs de imágenes con prioridades
      config.components.forEach((component, index) => {
        const props = component.properties;
        const isHero = component.type === ComponentType.HERO;
        const isAboveFold = index < 2; // Primeros dos componentes
        
        // Determinar prioridad basada en posición y tipo
        let priority = ResourcePriority.MEDIUM;
        if (isHero) {
          priority = ResourcePriority.CRITICAL;
        } else if (isAboveFold) {
          priority = ResourcePriority.HIGH;
        } else if (index < 4) {
          priority = ResourcePriority.MEDIUM;
        } else {
          priority = ResourcePriority.LOW;
        }
        
        // Procesar diferentes tipos de recursos
        if (typeof props.backgroundImage === 'string' && props.backgroundImage) {
          const resource = { url: props.backgroundImage, type: 'image' as const, priority };
          if (priority === ResourcePriority.CRITICAL) criticalResources.push(resource);
          else if (priority === ResourcePriority.HIGH) highResources.push(resource);
          else if (priority === ResourcePriority.MEDIUM) mediumResources.push(resource);
          else lowResources.push(resource);
        }
        
        if (typeof props.image === 'string' && props.image) {
          const resource = { url: props.image, type: 'image' as const, priority };
          if (priority === ResourcePriority.CRITICAL) criticalResources.push(resource);
          else if (priority === ResourcePriority.HIGH) highResources.push(resource);
          else if (priority === ResourcePriority.MEDIUM) mediumResources.push(resource);
          else lowResources.push(resource);
        }
        
        // Audio con prioridad baja por defecto
        if (typeof props.audioUrl === 'string' && props.audioUrl) {
          const audioResource = { url: props.audioUrl, type: 'audio' as const, priority: ResourcePriority.LOW };
          lowResources.push(audioResource);
        }
        
        if (props.images && Array.isArray(props.images)) {
          props.images.forEach((img: string) => {
            if (typeof img === 'string' && img) {
              const resource = { url: img, type: 'image' as const, priority: ResourcePriority.LAZY };
              lowResources.push(resource);
            }
          });
        }
        
        if (props.backgroundImages && Array.isArray(props.backgroundImages)) {
          props.backgroundImages.forEach((img: string) => {
            if (typeof img === 'string' && img) {
              const resource = { url: img, type: 'image' as const, priority: ResourcePriority.LAZY };
              lowResources.push(resource);
            }
          });
        }
      });
      
      // Precargar recursos usando el sistema de prioridades de la Fase 5
      const allResources = [...criticalResources, ...highResources, ...mediumResources, ...lowResources];
      
      if (allResources.length > 0) {
        // Usar el sistema optimizado de carga con prioridades
        preloadResourcesWithPriority(allResources);
        
        // También usar el sistema legacy para compatibilidad
        const resourceUrls = allResources.map(r => r.url);
        preloadResources(resourceUrls)
          .then(async () => {
            console.log(`${allResources.length} recursos precargados con prioridades`);
            
            // Optimizar imágenes para cada componente
            if (config) {
              try {
                const optimizedComponents = await Promise.all(
                  config.components.map(component => optimizeComponentImages(component))
                );
                
                // Actualizar la configuración con las imágenes optimizadas
                setConfig({
                  ...config,
                  components: optimizedComponents
                });
              } catch (error) {
                console.error('Error al optimizar imágenes:', error);
              }
            }
            
            setIsResourcesLoading(false);
          })
          .catch(error => {
            console.error('Error al precargar recursos:', error);
            setIsResourcesLoading(false);
          });
      } else {
        setIsResourcesLoading(false);
      }
    }
  }, [config, optimizeComponentImages, setConfig]); // Added missing dependencies

  // Las funciones de optimización de imágenes ahora se importan desde el hook useImageOptimizer

  // Manejadores de eventos
  // Restaurar versión y actualizar el índice del historial
  const handleRestoreVersion = (index: number) => {
    restoreVersion(index);
    setHistoryIndex(index);
  };
  
  // Manejadores para deshacer/rehacer
  const handleUndo = () => {
    if (!canUndo || !history) return;
    
    // Primero ejecutar la acción de deshacer
    undoChange();
    
    // Luego actualizar el índice del historial
    const newIndex = historyIndex + 1;
    if (newIndex < history.length) {
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (!canRedo || !history) return;
    
    // Primero ejecutar la acción de rehacer
    redoChange();
    
    // Luego actualizar el índice del historial
    const newIndex = historyIndex - 1;
    if (newIndex >= 0) {
      setHistoryIndex(newIndex);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    
    // Si se está saliendo del modo edición, cerrar cualquier modal abierto
    if (isEditMode) {
      setIsModalOpen(false);
      setActiveComponentId(null);
    }
  };

  const handleComponentClick = (componentId: string) => {
    if (isEditMode) {
      setActiveComponentId(componentId);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveComponentId(null);
  };

  // Aplicar los cambios pendientes al componente actual
  const handleSaveChanges = () => {
    if (!config || !activeComponentId) return;
    
    // Obtener los cambios pendientes para el componente activo
    const componentChanges = pendingChanges[activeComponentId] || {};
    
    // Si no hay cambios pendientes, simplemente cerrar el modal
    if (Object.keys(componentChanges).length === 0) {
      setIsModalOpen(false);
      setActiveComponentId(null);
      return;
    }
    
    setConfig(prevConfig => {
      if (!prevConfig) return prevConfig;
      
      const updatedComponents = prevConfig.components.map(component => {
        if (component.id === activeComponentId) {
          return {
            ...component,
            properties: {
              ...component.properties,
              ...componentChanges
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
    
    // Limpiar los cambios pendientes para este componente
    clearPendingChangesForComponent(activeComponentId);
    
    // Guardar cambios localmente usando el hook
    saveChanges();
    
    // Cerrar el modal
    setIsModalOpen(false);
    setActiveComponentId(null);
    
    // Mostrar indicador de éxito
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Guardar todos los cambios en el servidor
  const handleSaveAll = async () => {
    if (!config) return;
    
    try {
      // Convertir la configuración del editor al formato esperado por la API
      // Usar la misma lógica que el TemplateEditor original
      const updatedConfig = {
        title: config.name,
        eventDate: config.components.find(c => c.type === ComponentType.EVENT_DETAILS)?.properties.date || '',
        eventTime: config.components.find(c => c.type === ComponentType.EVENT_DETAILS)?.properties.time || '',
        location: config.components.find(c => c.type === ComponentType.EVENT_DETAILS)?.properties.location || '',
        eventType: invitation.config.eventType,
        hostNames: [config.components.find(c => c.type === ComponentType.THANK_YOU)?.properties.signature || ''],
        rsvpEnabled: config.components.find(c => c.type === ComponentType.ATTENDANCE)?.visible || true,
        theme: {
          primaryColor: config.theme.colors.primary,
          secondaryColor: config.theme.colors.secondary,
          fontFamily: config.theme.fonts ? config.theme.fonts.heading : 'Playfair Display',
        },
        components: {
          countdown: config.components.find(c => c.type === ComponentType.COUNTDOWN)?.visible || false,
          map: config.components.find(c => c.type === ComponentType.EVENT_DETAILS)?.properties.showMap || false,
          gallery: config.components.find(c => c.type === ComponentType.GALLERY)?.visible || false,
          music: config.components.find(c => c.type === ComponentType.MUSIC_PLAYER)?.visible || false,
          gifts: true, // Siempre habilitado por ahora
          itinerary: config.components.find(c => c.type === ComponentType.ITINERARY)?.visible || false,
          accommodation: config.components.find(c => c.type === ComponentType.ACCOMMODATION)?.visible || false,
        },
        templateId: invitation.config.templateId,
        editorConfig: config, // Guardar la configuración completa del editor para futura edición
      };
      
      // Desactivar el modo edición mientras se guarda
      setIsEditMode(false);
      
      // Usar saveAllChanges del hook para guardar en servidor y actualizar localStorage
      await saveAllChanges();
      
      // Mostrar indicador de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error al guardar la invitación:', error);
      // Aquí podríamos mostrar un mensaje de error al usuario
    }
  };

  // Renderizar componentes editables con optimizaciones de rendimiento
  const renderEditableComponents = () => {
    // Use our optimized rendering utility
    return updateRenderEditableComponents(
      config,
      isEditMode,
      activeComponentId,
      pendingChanges,
      isResourcesLoading,
      setActiveComponentId,
      networkQuality
    );
  };

  // Obtener el nombre de visualización de un tipo de componente
  const getComponentDisplayName = (type: ComponentType): string => {
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
      [ComponentType.INVITATION]: 'Invitación Formal',
      [ComponentType.COUPLE]: 'Pareja',
    };
    
    return displayNames[type] || String(type);
  };

  // Si no hay configuración, mostrar un estado de carga
  if (!config) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin text-primary">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <ResponsiveRender
        mobile={
          <div className="mobile-template-editor mobile-optimized">
            {/* Sección de vista previa optimizada para móvil */}
            <div className="preview-section mobile-preview">
              <NetworkErrorHandler
                onRetry={() => {
                  setIsResourcesLoading(true);
                  if (config) {
                    const resources = extractResourcesFromConfig(config);
                    preloadResourcesWithPriority(resources);
                  }
                  setTimeout(() => setIsResourcesLoading(false), 1500);
                }}
                fallbackContent={
                  <div className="network-error-fallback">
                    <WifiOff size={40} />
                    <h3>Problemas de conexión</h3>
                    <p>No se pudieron cargar algunos recursos. Verifica tu conexión.</p>
                  </div>
                }
              >
                {renderEditableComponents()}
              </NetworkErrorHandler>
            </div>
            
            {/* Controles optimizados para móvil */}
            <div className="mobile-controls">
              {/* Botón de modo edición */}
              <button 
                className="edit-mode-toggle mobile-button"
                onClick={toggleEditMode}
                aria-label={isEditMode ? "Salir del modo edición" : "Activar modo edición"}
              >
                {isEditMode ? <X size={20} /> : <Pencil size={20} />}
              </button>
              
              {/* Botón de historial */}
              {history && history.length > 0 && (
                <button 
                  className="history-toggle mobile-button"
                  onClick={() => setIsHistoryOpen(true)}
                  aria-label="Ver historial de cambios"
                >
                  <History size={20} />
                </button>
              )}
            </div>
            
            {/* Indicador de carga optimizado para móvil */}
            <AnimatePresence>
              {isResourcesLoading && (
                <OptimizedTransition
                  isVisible={isResourcesLoading}
                  type="fade"
                  duration={0.2}
                >
                  <div className="resource-loading-indicator mobile-loading">
                    <div className="spinner small" />
                    <span className="loading-text">Optimizando recursos...</span>
                  </div>
                </OptimizedTransition>
              )}
            </AnimatePresence>
          </div>
        }
        tablet={
          <div className="mobile-template-editor tablet-optimized">
            {/* Vista optimizada para tablet */}
            <div className="preview-section tablet-preview">
              {renderEditableComponents()}
            </div>
            
            <div className="tablet-controls">
              <button 
                className="edit-mode-toggle tablet-button"
                onClick={toggleEditMode}
                aria-label={isEditMode ? "Salir del modo edición" : "Activar modo edición"}
              >
                {isEditMode ? <X size={22} /> : <Pencil size={22} />}
              </button>
              
              {history && history.length > 0 && (
                <button 
                  className="history-toggle tablet-button"
                  onClick={() => setIsHistoryOpen(true)}
                  aria-label="Ver historial de cambios"
                >
                  <History size={22} />
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {isResourcesLoading && (
                <OptimizedTransition
                  isVisible={isResourcesLoading}
                  type="slide-fade"
                  duration={0.3}
                >
                  <div className="resource-loading-indicator tablet-loading">
                    <div className="spinner" />
                    <span>Cargando recursos...</span>
                  </div>
                </OptimizedTransition>
              )}
            </AnimatePresence>
          </div>
        }
      >
        {/* Vista por defecto (escritorio) */}
        <div className="mobile-template-editor">
          {/* Sección de vista previa */}
          <div className="preview-section">
            {renderEditableComponents()}
          </div>
          
          {/* Botón de modo edición */}
          <button 
            className="edit-mode-toggle"
            onClick={toggleEditMode}
            aria-label={isEditMode ? "Salir del modo edición" : "Activar modo edición"}
          >
            {isEditMode ? <X size={24} /> : <Pencil size={24} />}
          </button>
          
          {/* Botón de historial (siempre visible) */}
          {history && history.length > 0 && (
            <button 
              className="history-toggle"
              onClick={() => setIsHistoryOpen(true)}
              aria-label="Ver historial de cambios"
            >
              <History size={24} />
            </button>
          )}
          
          {/* Indicador de carga de recursos */}
          <AnimatePresence>
            {isResourcesLoading && (
              <motion.div 
                className="resource-loading-indicator"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="spinner" />
                <span>Cargando recursos...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ResponsiveRender>

      {/* Barra de herramientas (visible solo en modo edición) */}
      {isEditMode && (
        <div className="editor-toolbar">
          <button 
            className="button-outline"
            onClick={toggleEditMode}
          >
            Cancelar
          </button>
          
          <button 
            className="button-primary"
            onClick={handleSaveAll}
            disabled={isSaving || !hasPendingChanges}
          >
            {isSaving ? (
              <>
                <span className="loading-spinner mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Guardar
              </>
            )}
          </button>
        </div>
      )}

      {/* Modal de edición */}
      {isModalOpen && activeComponentId && (
        <>
          <div 
            className="modal-backdrop" 
            onClick={handleCloseModal}
            onKeyDown={(e) => e.key === 'Escape' && handleCloseModal()}
            tabIndex={-1}
            role="presentation"
            aria-hidden="true"
          ></div>
          
          <MobileEditModal
            isOpen={isModalOpen}
            component={config.components.find(c => c.id === activeComponentId) || null}
            onClose={handleCloseModal}
            onSave={handleSaveChanges}
            onChange={updatePendingChange}
            pendingChanges={pendingChanges[activeComponentId] || {}}
          />
        </>
      )}
      
      {/* Indicador de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="success-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Check size={18} />
            <span>Cambios guardados correctamente</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Panel de historial */}
      <MobileHistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        currentIndex={historyIndex}
        onRestore={handleRestoreVersion}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </>
  );
};

/**
 * Editor de plantillas optimizado para dispositivos móviles
 * Permite editar componentes a través de modales contextuales
 */
const MobileTemplateEditor: React.FC<MobileTemplateEditorProps> = (props) => {
  // Usar ResourceItems tipados para la precarga
  const extractResources = (invitation: Invitation): ResourceItem[] => {
    if (!invitation?.config) return [];
    
    // Usar nuestra utilidad para extraer recursos optimizados
    return extractResourcesFromConfig(invitation.config);
  };
  
  // Extraer recursos tipados para precarga
  const resourceItems = props.invitation ? extractResources(props.invitation) : [];
  
  // Convertir a strings para NetworkAwareContainer
  const resourceUrls = resourceItems.map(item => item.url);
  
  return (
    <MobileEditorProvider>
      <NetworkAwareContainer
        resources={resourceUrls}
        showConnectionStatus={true}
        fallback={
          <div className="mobile-editor-loading">
            <div className="loading-spinner"></div>
            <p>Cargando editor optimizado...</p>
          </div>
        }
        offlineFallback={
          <div className="mobile-editor-offline">
            <WifiOff size={32} />
            <p>Sin conexión. Algunas funciones pueden no estar disponibles.</p>
          </div>
        }
        lowBandwidthMode={true}
      >
        <MobileTemplateEditorInner {...props} />
      </NetworkAwareContainer>
    </MobileEditorProvider>
  );
};

export default MobileTemplateEditor;
