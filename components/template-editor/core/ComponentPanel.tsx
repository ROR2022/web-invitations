import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ComponentConfig, ComponentType } from "../types";
import DraggableComponentList from "../DraggableComponentList";
import AddComponentDialog from "../ui/AddComponentDialog";
import { componentTypeNames } from "../utils/componentUtils";
import { useMediaQuery } from "usehooks-ts";

type ComponentPanelProps = {
  visible: boolean;
  components: ComponentConfig[];
  selectedComponentId?: string | null;
  onAddComponent: (type: ComponentType) => void;
  onSelectComponent: (id: string) => void;
  onReorderComponents?: (components: ComponentConfig[]) => void;
};

export const ComponentPanel: React.FC<ComponentPanelProps> = ({
  visible,
  components,
  selectedComponentId,
  onAddComponent,
  onSelectComponent,
  onReorderComponents,
}) => {
  const [addComponentDialogOpen, setAddComponentDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const isWide = useMediaQuery("(min-width: 1400px)");
  if (!visible) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col relative">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-medium">Componentes</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddComponentDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          {isMobile || isWide ? "Añadir" : ""}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2">
        {components.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="mb-2">No hay componentes</p>
            <p className="text-sm">
              Añade componentes para comenzar a construir tu invitación.
            </p>
          </div>
        ) : (
          <DraggableComponentList
            components={components}
            selectedComponentId={selectedComponentId || null}
            onSelectComponent={onSelectComponent}
            onReorderComponents={onReorderComponents || ((components) => {})}
          />
        )}
      </ScrollArea>

      <AddComponentDialog
        open={addComponentDialogOpen}
        onClose={() => setAddComponentDialogOpen(false)}
        onAddComponent={onAddComponent}
        componentTypeNames={componentTypeNames}
      />
    </div>
  );
};

export default ComponentPanel;
