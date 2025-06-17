import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import isEqual from "lodash/isEqual";
import { useDebounce } from "use-debounce";
import type { TemplateConfig, ComponentConfig, ComponentType } from "../types";
import { defaultTheme } from "../themeSchemas";
import { componentDefaultProps } from "../configurable/componentSchemas";

type UseTemplateStateProps = {
  initialConfig?: TemplateConfig;
  templateId?: string;
  onSave?: (config: TemplateConfig) => Promise<void>;
};

export function useTemplateState({ initialConfig, templateId, onSave }: UseTemplateStateProps) {
  // Configuración inicial de la plantilla
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(() => {
    if (initialConfig) {
      return { ...initialConfig };
    }

    // Si no hay configuración inicial, crear una plantilla básica
    return {
      id: templateId || uuidv4(),
      name: "Nueva Plantilla",
      description: "Descripción de la plantilla",
      theme: { ...defaultTheme },
      components: [],
      eventType: "otro"
    };
  });

  // Estado para el componente seleccionado
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Estado para indicar el estado de guardado
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  // Referencia al último config guardado para comparación profunda
  const lastSavedConfigRef = useRef<TemplateConfig | null>(null);

  // Establecer la referencia inicial al cargar el componente
  useEffect(() => {
    if (initialConfig) {
      lastSavedConfigRef.current = structuredClone(initialConfig);
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

    // No hacemos nada si no hay cambios reales
    if (!hasRealChanges) {
      return;
    }

    // Solo cambiamos el estado visual para mantener la UI coherente
    if (saveStatus === "saved") {
      setSaveStatus("unsaved");
    }
  }, [debouncedConfig, onSave, saveStatus, templateConfig?.id]);

  // Obtener el componente seleccionado
  const selectedComponent = selectedComponentId
    ? templateConfig.components.find((c) => c.id === selectedComponentId) || null
    : null;

  // Limpiar la selección si el componente se elimina
  useEffect(() => {
    if (selectedComponentId && !templateConfig.components.some((c) => c.id === selectedComponentId)) {
      setSelectedComponentId(null);
    }
  }, [templateConfig.components, selectedComponentId]);

  // Manejar cambios en el nombre de la plantilla
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateConfig((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  // Manejar selección de componente
  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
  };

  // Manejar cambios en las propiedades de un componente
  const handlePropertyChange = (componentId: string, property: string, value: any) => {
    if (!componentId) return;

    setTemplateConfig((prev) => ({
      ...prev,
      components: prev.components.map((component) =>
        component.id === componentId
          ? {
              ...component,
              properties: {
                ...component.properties,
                [property]: value,
              },
            }
          : component
      ),
    }));
  };

  // Manejar cambios en el tema
  const handleThemeChange = (updatedTheme: any) => {
    setTemplateConfig((prev) => ({
      ...prev,
      theme: updatedTheme,
    }));
  };

  // Manejar la visibilidad de un componente
  const handleVisibilityToggle = (visible: boolean) => {
    if (!selectedComponentId) return;

    setTemplateConfig((prev) => ({
      ...prev,
      components: prev.components.map((component) =>
        component.id === selectedComponentId ? { ...component, visible } : component
      ),
    }));
  };

  // Manejar la eliminación de un componente
  const handleRemoveComponent = () => {
    if (!selectedComponentId) return;

    setTemplateConfig((prev) => ({
      ...prev,
      components: prev.components.filter((component) => component.id !== selectedComponentId),
    }));

    setSelectedComponentId(null);
  };

  // Manejar la adición de un nuevo componente
  const handleAddComponent = (type: ComponentType) => {
    // Crear un nuevo ID para el componente
    const newComponentId = uuidv4();

    // Obtener propiedades predeterminadas para este tipo de componente
    const defaultProps = componentDefaultProps[type] || {};
    
    // Debug para componentes de tipo countdown
    if (type === 'countdown') {
      // Asegurarnos de que la fecha predeterminada es correcta
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 34);
      const defaultEventDate = defaultDate.toISOString().split('T')[0];
      
      console.log('Creating new countdown component with default props:', {
        defaultProps,
        defaultEventDate,
        currentDate: new Date().toISOString().split('T')[0]
      });
      
      // Forzar fecha a 34 días adelante
      defaultProps.eventDate = defaultEventDate;
    }

    // Crear el nuevo componente
    const newComponent: ComponentConfig = {
      id: newComponentId,
      type,
      order: templateConfig.components.length,
      visible: true,
      properties: { ...defaultProps },
    };

    // Actualizar la configuración de la plantilla
    setTemplateConfig((prev) => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));

    // Seleccionar el nuevo componente
    setTimeout(() => {
      setSelectedComponentId(newComponentId);
    }, 100);
  };

  // Manejar el reordenamiento de componentes
  const handleReorderComponents = (newComponents: ComponentConfig[]) => {
    setTemplateConfig((prev) => ({
      ...prev,
      components: newComponents.map((component, index) => ({
        ...component,
        order: index,
      })),
    }));
  };

  // Manejar el guardado de la plantilla
  const handleSave = async () => {
    if (!onSave) return;

    try {
      setSaveStatus("saving");
      await onSave(templateConfig);
      setSaveStatus("saved");
      lastSavedConfigRef.current = structuredClone(templateConfig);
    } catch (error) {
      console.error("Error al guardar la plantilla:", error);
      setSaveStatus("unsaved");
    }
  };

  // Update template basic settings (name, description, category, etc.)
  const handleSettingsChange = (updatedConfig: TemplateConfig) => {
    setTemplateConfig((prevConfig) => ({
      ...prevConfig,
      name: updatedConfig.name,
      description: updatedConfig.description,
      category: updatedConfig.category,
      eventType: updatedConfig.eventType
    }));
    setSaveStatus('unsaved');
  };

  return {
    config: templateConfig,
    selectedComponentId,
    selectedComponent,
    saveStatus,
    handleNameChange,
    handleComponentSelect,
    handlePropertyChange,
    handleThemeChange,
    handleVisibilityToggle,
    handleRemoveComponent,
    handleAddComponent,
    handleReorderComponents,
    handleSave,
    handleSettingsChange
  };
}
