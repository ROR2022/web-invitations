import React from "react";
import { Eye, EyeOff, Trash2, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { ComponentConfig } from "../types";
import PropertyEditor from "../PropertyEditor";
import ThemeEditor from "../ThemeEditor";
import { componentTypeNames } from "../utils/componentUtils";

type PropertiesPanelProps = {
  visible: boolean;
  selectedComponent: ComponentConfig | null;
  theme: any;
  onPropertyChange: (componentId: string, property: string, value: any) => void;
  onThemeChange: (updatedTheme: any) => void;
  onVisibilityToggle: (visible: boolean) => void;
  onRemoveComponent: () => void;
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  visible,
  selectedComponent,
  theme,
  onPropertyChange,
  onThemeChange,
  onVisibilityToggle,
  onRemoveComponent,
}) => {
  if (!visible) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-medium">Propiedades</h3>
      </div>

      <Tabs defaultValue="component" className="flex-1 flex flex-col h-full">
        <TabsList className="px-3 pt-2">
          <TabsTrigger value="component" disabled={!selectedComponent} className="flex-1">
            Componente
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex-1">
            <Palette className="h-4 w-4 mr-1" />
            Tema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="component" className="flex-1 flex flex-col">
          {selectedComponent ? (
            <>
              <div className="px-3 py-2 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {componentTypeNames[selectedComponent.type] || selectedComponent.type}
                  </Badge>
                  <Badge variant={selectedComponent.visible ? "default" : "secondary"}>
                    {selectedComponent.visible ? "Visible" : "Oculto"}
                  </Badge>
                </div>

                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onVisibilityToggle(!selectedComponent.visible)}
                        >
                          {selectedComponent.visible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {selectedComponent.visible ? "Ocultar componente" : "Mostrar componente"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onRemoveComponent}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Eliminar componente</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
                <div className="p-3">
                  <PropertyEditor
                    component={selectedComponent}
                    onChange={(componentId, property, value) =>
                      onPropertyChange(componentId, property, value)
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
              <div>
                <p className="mb-2">Ningún componente seleccionado</p>
                <p className="text-sm">
                  Selecciona un componente para editar sus propiedades.
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="theme" className="flex-1 p-0">
          <div className="h-full overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            <div className="p-3">
              <ThemeEditor theme={theme} onThemeChange={onThemeChange} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertiesPanel;
