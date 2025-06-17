"use client";
import React from "react";
import { Smartphone, Tablet, Monitor, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { TemplateConfig } from "../types";
import InvitationPreview from "../InvitationPreview";
import type { PreviewMode } from "../hooks/useResponsiveLayout";
import { useMediaQuery } from "usehooks-ts";

type PreviewPanelProps = {
  visible: boolean;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  templateConfig: TemplateConfig;
  selectedComponentId: string | null;
  onComponentSelect: (id: string) => void;
  isPreviewMode?: boolean;
  togglePreviewMode?: () => void;
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  visible,
  previewMode,
  setPreviewMode,
  templateConfig,
  selectedComponentId,
  onComponentSelect,
  isPreviewMode = false,
  togglePreviewMode,
}) => {
  // Move useMediaQuery before the conditional return
  const isSmallScreen = useMediaQuery("(max-width: 400px)");
  
  if (!visible) return null;

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

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
      <div className=" border-b flex items-center justify-center p-3">
        <h3 className="font-medium">{isSmallScreen ? "" : "Vista Previa"}</h3>
        
        <div className="flex gap-1 items-center">
          {/* Botones de modo de previsualización */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista móvil</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={previewMode === "tablet" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewMode("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista tablet</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista escritorio</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Separador */}
          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Botón de modo de previsualización completa */}
          {togglePreviewMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePreviewMode}
                  >
                    {isPreviewMode ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPreviewMode ? "Salir de vista previa" : "Vista previa completa"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-4" style={{ maxHeight: "calc(100vh - 120px)" }}>
        <div className={getPreviewContainerClasses()}>
          <InvitationPreview
            config={templateConfig}
            isEditing={!isPreviewMode}
            onComponentSelect={onComponentSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
