import React from "react";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export interface EditorHeaderProps {
  templateName: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => Promise<void>;
  onBack?: () => void;
  isSaving?: boolean;
  saveStatus: "saved" | "saving" | "unsaved";
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  templateName,
  onNameChange,
  onSave,
  onBack,
  isSaving = false,
  saveStatus,
}) => {
  // Obtener el color del badge según el estado de guardado
  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case "saved":
        return "bg-green-500";
      case "saving":
        return "bg-yellow-500";
      case "unsaved":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Obtener el texto del badge según el estado de guardado
  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saved":
        return "Guardado";
      case "saving":
        return "Guardando...";
      case "unsaved":
        return "Sin guardar";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="px-4 py-3 border-b flex items-center gap-3 bg-white shadow-sm">
      {onBack && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Volver</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Input
        value={templateName}
        onChange={onNameChange}
        className="max-w-[300px]"
        placeholder="Nombre de la plantilla"
      />

      <div className="ml-auto flex items-center gap-2">
        <Badge className={`${getSaveStatusColor()}`}>{getSaveStatusText()}</Badge>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Guardar plantilla</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default EditorHeader;
