import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DisplayMode, EditorSection } from "../hooks/useResponsiveLayout";

type EditorLayoutProps = {
  children: ReactNode;
  displayMode: DisplayMode;
  activeSection: EditorSection;
  setActiveSection: (section: EditorSection) => void;
};

type SectionButtonProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

const SectionButton: React.FC<SectionButtonProps> = ({ active, onClick, children }) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className="flex-1"
  >
    {children}
  </Button>
);

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  displayMode,
  activeSection,
  setActiveSection,
}) => {
  // En móvil, mostrar botones de navegación entre secciones
  const renderSectionNavigation = () => {
    if (displayMode !== "mobile") return null;

    return (
      <div className="flex gap-1 p-2 bg-gray-100 border-b">
        <SectionButton
          active={activeSection === "components"}
          onClick={() => setActiveSection("components")}
        >
          Componentes
        </SectionButton>
        <SectionButton
          active={activeSection === "preview"}
          onClick={() => setActiveSection("preview")}
        >
          Vista Previa
        </SectionButton>
        <SectionButton
          active={activeSection === "properties"}
          onClick={() => setActiveSection("properties")}
        >
          Propiedades
        </SectionButton>
      </div>
    );
  };

  // Clases para el layout principal según el modo de visualización
  const getLayoutClasses = () => {
    switch (displayMode) {
      case "mobile":
        return "flex flex-col flex-1 h-full";
      case "tablet":
        return "grid grid-cols-8 gap-2 flex-1 p-4";
      default:
        return "grid grid-cols-12 gap-4 flex-1 p-4";
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {renderSectionNavigation()}
      <div className={getLayoutClasses()}>
        {children}
      </div>
    </div>
  );
};

export default EditorLayout;
