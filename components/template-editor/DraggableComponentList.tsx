"use client";

import React from 'react';
import { ComponentConfig, ComponentType } from './types';
import { Button } from '@/components/ui/button';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

// Usar Record para permitir indexación con string y asegurar typesafety
type ComponentTypeNames = Record<string, string>;

const componentTypeNames: ComponentTypeNames = {
  hero: 'Héroe/Portada',
  countdown: 'Cuenta Regresiva',
  eventDetails: 'Detalles del Evento',
  gallery: 'Galería',
  attendance: 'Formulario de Asistencia',
  giftOptions: 'Mesa de Regalos',
  musicPlayer: 'Reproductor de Música',
  thankYou: 'Agradecimiento',
  invitation: 'Invitación Formal',
  couple: 'Nosotros'
};

// Componente que representa un elemento arrastrable individual
interface SortableItemProps {
  component: ComponentConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function SortableItem({ component, isSelected, onSelect }: SortableItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: component.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`
        p-2 border-b cursor-pointer flex items-center justify-between
        ${component.visible ? '' : 'opacity-60'}
        ${isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-gray-50'}
      `}
      onClick={() => onSelect(component.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(component.id);
          e.preventDefault();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span className="flex items-center flex-1 text-sm">
        <span 
          className={`w-2 h-2 rounded-full mr-2 ${component.visible ? 'bg-green-500' : 'bg-gray-400'}`}
          title={component.visible ? 'Visible' : 'Oculto'}
        ></span>
        <span className="flex-1 truncate">
          {componentTypeNames[component.type] || component.type}
        </span>
      </span>
      
      <div className="flex items-center space-x-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 hover:bg-gray-100 rounded-sm"
          title="Arrastrar para reordenar"
        >
          <GripVertical size={14} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

// Propiedades del componente principal
interface DraggableComponentListProps {
  components: ComponentConfig[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onReorderComponents: (components: ComponentConfig[]) => void;
}

// Componente principal que contiene la lista ordenable
export default function DraggableComponentList({
  components,
  selectedComponentId,
  onSelectComponent,
  onReorderComponents
}: DraggableComponentListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Ordenar componentes por el orden especificado
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);
  
  // Manejar el evento de finalización de arrastre
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Crear una copia nueva con los componentes reordenados
      const oldIndex = sortedComponents.findIndex(item => item.id === active.id);
      const newIndex = sortedComponents.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(sortedComponents, oldIndex, newIndex);
        
        // Actualizar los valores de orden
        const updatedComponents = newItems.map((component, index) => ({
          ...component,
          order: index
        }));
        
        onReorderComponents(updatedComponents);
      }
    }
  }
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedComponents.map(component => component.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 flex-1 overflow-y-auto py-1">
          {sortedComponents.map(component => (
            <SortableItem
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={onSelectComponent}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
