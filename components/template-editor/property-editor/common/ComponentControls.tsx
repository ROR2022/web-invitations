"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface ComponentControlsProps {
  visible: boolean;
  onVisibilityToggle: (visible: boolean) => void;
  onRemoveComponent: () => void;
}

/**
 * Componente que muestra controles de visibilidad y eliminación para un componente
 */
const ComponentControls: React.FC<ComponentControlsProps> = ({
  visible,
  onVisibilityToggle,
  onRemoveComponent
}) => {
  return (
    <div className="flex justify-between items-center mb-4 py-2 border-b">
      <div className="flex items-center space-x-2">
        <Switch
          id="component-visibility"
          checked={visible}
          onCheckedChange={onVisibilityToggle}
        />
        <Label htmlFor="component-visibility" className="text-sm cursor-pointer">
          {visible ? 'Componente visible' : 'Componente oculto'}
        </Label>
      </div>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={onRemoveComponent}
        title="Eliminar componente"
      >
        <Trash size={18} />
      </Button>
    </div>
  );
};

export default ComponentControls;
