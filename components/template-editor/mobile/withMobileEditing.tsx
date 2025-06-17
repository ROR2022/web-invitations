"use client";

import React from 'react';
import { Pencil } from 'lucide-react';

// Tipos
interface WithMobileEditingProps {
  id: string;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * Higher-Order Component (HOC) que añade capacidades de edición móvil
 * a cualquier componente configurable
 */
export function withMobileEditing<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P & WithMobileEditingProps> {
  return function WithMobileEditingComponent({
    id,
    isEditMode,
    isSelected,
    onSelect,
    ...props
  }: WithMobileEditingProps & P) {
    // Manejar clic en el componente
    const handleClick = () => {
      if (isEditMode) {
        onSelect(id);
      }
    };

    return (
      <div 
        className={`editable-component ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        tabIndex={isEditMode ? 0 : -1}
        role="button"
        aria-pressed={isSelected}
        aria-label="Editar componente"
      >
        {/* Renderizar el componente original con todas sus props */}
        <WrappedComponent {...props as P} />
        
        {/* Indicador de edición (solo visible en modo edición) */}
        {isEditMode && (
          <div className="edit-indicator">
            <Pencil size={16} />
          </div>
        )}
      </div>
    );
  };
}

// Exportar tipos para facilitar su uso
export type MobileEditableComponent<P> = React.FC<P & WithMobileEditingProps>;
