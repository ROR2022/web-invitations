"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Plus } from 'lucide-react';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../../types';

interface ArrayControlProps {
  property: NamedComponentProperty;
  value: any[];
  onChange: (value: any[]) => void;
}

/**
 * Control para propiedades de tipo array
 * Permite manejar listas de elementos como imágenes, ítems de itinerario, etc.
 */
const ArrayControl: React.FC<ArrayControlProps> = ({
  property,
  value = [],
  onChange
}) => {
  const { name, label, description, required } = property;
  const itemType = (property as any).itemType || 'string';
  const [newItemValue, setNewItemValue] = useState('');
  
  // Manejar adición de nuevo elemento
  const handleAddItem = () => {
    if (!newItemValue.trim()) return;
    
    // Si es un array de objetos con URL (como imágenes)
    if (itemType === 'image') {
      onChange([...value, { url: newItemValue, alt: '' }]);
    } else {
      onChange([...value, newItemValue]);
    }
    setNewItemValue('');
  };
  
  // Manejar eliminación de elemento
  const handleRemoveItem = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };
  
  // Manejar edición de elemento
  const handleItemChange = (index: number, newValue: any) => {
    const updatedValue = [...value];
    updatedValue[index] = newValue;
    onChange(updatedValue);
  };
  
  // Manejar edición de propiedad en elemento tipo objeto
  const handleObjectItemPropertyChange = (index: number, property: string, propertyValue: any) => {
    const updatedValue = [...value];
    updatedValue[index] = {
      ...updatedValue[index],
      [property]: propertyValue
    };
    onChange(updatedValue);
  };
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <div className="space-y-3">
        {/* Lista de elementos actuales */}
        {value && value.length > 0 ? (
          <div className="space-y-2">
            {value.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {itemType === 'image' ? (
                  // Para imágenes
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <Input
                      value={item.url || ''}
                      onChange={(e) => handleObjectItemPropertyChange(index, 'url', e.target.value)}
                      placeholder="URL de la imagen"
                      className="flex-1"
                    />
                    <Input
                      value={item.alt || ''}
                      onChange={(e) => handleObjectItemPropertyChange(index, 'alt', e.target.value)}
                      placeholder="Texto alternativo"
                      className="flex-1"
                    />
                  </div>
                ) : (
                  // Para strings u otros tipos simples
                  <Input
                    value={typeof item === 'string' ? item : JSON.stringify(item)}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="flex-1"
                  />
                )}
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleRemoveItem(index)}
                  className="shrink-0"
                  type="button"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hay elementos. Agrega uno a continuación.</p>
        )}
        
        {/* Control para agregar nuevo elemento */}
        <div className="flex items-center gap-2">
          <Input
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            placeholder={
              itemType === 'image' 
                ? "URL de la imagen" 
                : `Nuevo elemento`
            }
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button 
            onClick={handleAddItem} 
            disabled={!newItemValue.trim()}
            type="button"
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>
    </PropertyWrapper>
  );
};

export default ArrayControl; 