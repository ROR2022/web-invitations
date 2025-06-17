import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ComponentType } from "../types";
import { ComponentIcon } from "./ComponentIcons";

type AddComponentDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddComponent: (type: ComponentType) => void;
  componentTypeNames: Record<string, string>;
};

const AddComponentDialog: React.FC<AddComponentDialogProps> = ({
  open,
  onClose,
  onAddComponent,
  componentTypeNames,
}) => {
  const handleAddComponent = (type: ComponentType) => {
    onAddComponent(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Componente</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de componente que deseas añadir a tu invitación.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="grid grid-cols-2 gap-2 p-1">
            {Object.entries(componentTypeNames).map(([type, name]) => (
              <Button
                key={type}
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2 py-6"
                onClick={() => handleAddComponent(type as ComponentType)}
              >
                <div className="text-primary">
                  <ComponentIcon type={type as ComponentType} />
                </div>
                <span className="text-sm font-medium">{name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddComponentDialog;
