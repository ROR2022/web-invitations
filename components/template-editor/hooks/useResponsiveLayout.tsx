import { useState, useEffect } from "react";

export type DisplayMode = "mobile" | "tablet" | "desktop" | "wide";
export type PreviewMode = "mobile" | "tablet" | "desktop";
export type EditorSection = "components" | "preview" | "properties";

export function useResponsiveLayout() {
  // Estado para manejo de visualización responsive
  const [displayMode, setDisplayMode] = useState<DisplayMode>("desktop");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [activeSection, setActiveSection] = useState<EditorSection>("preview");
  const [showComponentPanel, setShowComponentPanel] = useState(true);
  
  // Detectar el tamaño de pantalla para ajustar el modo de visualización
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDisplayMode("mobile");
      } else if (window.innerWidth < 1024) {
        setDisplayMode("tablet");
      } else if (window.innerWidth < 1280) {
        setDisplayMode("desktop");
      } else {
        setDisplayMode("wide");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Inicializar

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determinar si se debe mostrar un panel en particular según el modo
  const shouldShowPanel = (panel: EditorSection) => {
    if (displayMode === "mobile") {
      return activeSection === panel;
    }

    if (displayMode === "tablet") {
      // En modo tablet, combinar componentes y propiedades en una columna
      if (panel === "components" || panel === "properties") {
        return activeSection === panel || activeSection === "preview";
      }
      return true; // Mostrar siempre la vista previa
    }

    return true; // En desktop/wide mostrar todos los paneles
  };

  // Obtener clases para el contenedor de la vista previa según el modo de previsualización
  const getPreviewContainerClasses = () => {
    switch (previewMode) {
      case "mobile":
        return "max-w-[375px] mx-auto h-full";
      case "tablet":
        return "max-w-[768px] mx-auto h-full";
      default:
        return "w-full h-full";
    }
  };

  // Obtener clases CSS para el layout basado en el modo de visualización
  const getLayoutClasses = () => {
    switch (displayMode) {
      case "mobile":
        return "flex flex-col h-full";
      case "tablet":
        return "grid grid-cols-8 gap-2 h-full";
      default:
        return "grid grid-cols-12 gap-2 h-full";
    }
  };

  return {
    displayMode,
    previewMode,
    activeSection,
    showComponentPanel,
    setPreviewMode,
    setActiveSection,
    setShowComponentPanel,
    shouldShowPanel,
    getPreviewContainerClasses,
    getLayoutClasses,
  };
}
