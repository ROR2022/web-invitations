"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TemplateConfig, ComponentConfig } from '../types';

// Tipos
interface MobileEditorContextType {
  isEditMode: boolean;
  activeComponentId: string | null;
  pendingChanges: Record<string, Record<string, any>>;
  setIsEditMode: (isEditMode: boolean) => void;
  setActiveComponentId: (componentId: string | null) => void;
  setPendingChanges: (changes: Record<string, Record<string, any>>) => void;
  updatePendingChange: (componentId: string, propertyName: string, value: any) => void;
  clearPendingChangesForComponent: (componentId: string) => void;
  hasPendingChanges: boolean;
}

// Contexto
const MobileEditorContext = createContext<MobileEditorContextType | null>(null);

// Hook personalizado para acceder al contexto
export const useMobileEditor = () => {
  const context = useContext(MobileEditorContext);
  if (!context) {
    throw new Error('useMobileEditor debe ser usado dentro de un MobileEditorProvider');
  }
  return context;
};

// Proveedor del contexto
interface MobileEditorProviderProps {
  children: ReactNode;
}

export const MobileEditorProvider: React.FC<MobileEditorProviderProps> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, any>>>({});

  // Actualizar un cambio pendiente para un componente específico
  const updatePendingChange = (componentId: string, propertyName: string, value: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [componentId]: {
        ...(prev[componentId] || {}),
        [propertyName]: value
      }
    }));
  };

  // Limpiar los cambios pendientes para un componente específico
  const clearPendingChangesForComponent = (componentId: string) => {
    setPendingChanges(prev => {
      const updated = { ...prev };
      delete updated[componentId];
      return updated;
    });
  };

  // Verificar si hay cambios pendientes
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  // Valor del contexto
  const value: MobileEditorContextType = {
    isEditMode,
    activeComponentId,
    pendingChanges,
    setIsEditMode,
    setActiveComponentId,
    setPendingChanges,
    updatePendingChange,
    clearPendingChangesForComponent,
    hasPendingChanges
  };

  return (
    <MobileEditorContext.Provider value={value}>
      {children}
    </MobileEditorContext.Provider>
  );
};

export default MobileEditorProvider;
