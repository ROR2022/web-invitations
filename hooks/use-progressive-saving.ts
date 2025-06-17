"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { TemplateConfig } from '@/components/template-editor/types';
import { saveDraft, getDraft, deleteDraft, addToHistory, getHistory, restoreFromHistory, DRAFT_AUTOSAVE_INTERVAL } from '@/services/editor-cache.service';

interface UseProgressiveSavingProps {
  invitationId: string;
  initialConfig: TemplateConfig | null;
  onSave: (config: any) => Promise<void>;
}

interface UseProgressiveSavingResult {
  config: TemplateConfig | null;
  setConfig: React.Dispatch<React.SetStateAction<TemplateConfig | null>>;
  hasPendingChanges: boolean;
  isSaving: boolean;
  saveChanges: () => Promise<void>;
  saveAllChanges: () => Promise<void>;
  undoChange: () => void;
  redoChange: () => void;
  history: Array<{
    config: TemplateConfig;
    timestamp: string;
    label: string;
  }> | null;
  canUndo: boolean;
  canRedo: boolean;
  restoreVersion: (index: number) => void;
  discardChanges: () => void;
}

/**
 * Hook personalizado para gestionar el guardado progresivo y el historial de cambios
 */
export function useProgressiveSaving({
  invitationId,
  initialConfig,
  onSave
}: UseProgressiveSavingProps): UseProgressiveSavingResult {
  // Estados
  const [config, setConfig] = useState<TemplateConfig | null>(initialConfig);
  const [originalConfig, setOriginalConfig] = useState<TemplateConfig | null>(initialConfig);
  const [history, setHistory] = useState<Array<{
    config: TemplateConfig;
    timestamp: string;
    label: string;
  }> | null>(null);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Referencias
  const lastSavedConfig = useRef<TemplateConfig | null>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Verificar si hay cambios pendientes
  const hasPendingChanges = useCallback(() => {
    if (!config || !lastSavedConfig.current) return false;
    return JSON.stringify(config) !== JSON.stringify(lastSavedConfig.current);
  }, [config]);

  // Cargar borrador e historial al inicio
  useEffect(() => {
    if (invitationId) {
      // Cargar borrador si existe
      const draft = getDraft(invitationId);
      if (draft && draft.config) {
        setConfig(draft.config);
        console.log('Borrador cargado para:', invitationId);
      } else {
        setConfig(initialConfig);
      }
      
      // Establecer la configuración original y la última guardada
      setOriginalConfig(initialConfig);
      lastSavedConfig.current = initialConfig;
      
      // Cargar historial
      const savedHistory = getHistory(invitationId);
      if (savedHistory && savedHistory.length > 0) {
        setHistory(savedHistory);
        setHistoryIndex(0); // El más reciente
      }
    }
    
    // Limpiar al desmontar
    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
    };
  }, [invitationId, initialConfig]);

  // Configurar el guardado automático
  useEffect(() => {
    if (invitationId && config) {
      // Cancelar temporizador existente
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
      
      // Configurar nuevo temporizador
      autoSaveTimer.current = setInterval(() => {
        if (hasPendingChanges()) {
          saveDraft(invitationId, config);
          console.log('Guardado automático ejecutado');
        }
      }, DRAFT_AUTOSAVE_INTERVAL);
      
      // Guardar borrador inmediatamente si hay cambios
      if (hasPendingChanges()) {
        saveDraft(invitationId, config);
      }
    }
    
    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
    };
  }, [invitationId, config, hasPendingChanges]);

  // Guardar cambios actuales en localStorage
  const saveChanges = useCallback(async () => {
    if (!invitationId || !config) return;
    
    try {
      saveDraft(invitationId, config);
      
      // Añadir al historial solo si hay cambios significativos
      if (hasPendingChanges()) {
        addToHistory(invitationId, config);
        
        // Actualizar el historial en el estado
        const updatedHistory = getHistory(invitationId);
        if (updatedHistory) {
          setHistory(updatedHistory);
          setHistoryIndex(0);
        }
      }
      
      // Actualizar referencia de último guardado
      lastSavedConfig.current = JSON.parse(JSON.stringify(config));
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  }, [invitationId, config, hasPendingChanges]);

  // Guardar todos los cambios en el servidor
  const saveAllChanges = useCallback(async () => {
    if (!invitationId || !config) return;
    
    try {
      setIsSaving(true);
      
      // Guardar primero localmente
      await saveChanges();
      
      // Luego guardar en el servidor
      await onSave({
        ...config,
        // Aquí puedes transformar la configuración si es necesario
      });
      
      // Actualizar referencia de último guardado
      lastSavedConfig.current = JSON.parse(JSON.stringify(config));
      
      // Borrar el borrador local ya que se ha guardado en el servidor
      deleteDraft(invitationId);
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error al guardar todos los cambios:', error);
      setIsSaving(false);
    }
  }, [invitationId, config, onSave, saveChanges]);

  // Deshacer el último cambio
  const undoChange = useCallback(() => {
    if (!history || historyIndex >= history.length - 1) return;
    
    // Avanzar al siguiente elemento en el historial (recuerda que el índice 0 es el más reciente)
    const newIndex = historyIndex + 1;
    const versionToRestore = history[newIndex];
    
    if (versionToRestore && versionToRestore.config) {
      setConfig(versionToRestore.config);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Rehacer un cambio deshecho
  const redoChange = useCallback(() => {
    if (!history || historyIndex <= 0) return;
    
    // Retroceder al elemento anterior en el historial
    const newIndex = historyIndex - 1;
    const versionToRestore = history[newIndex];
    
    if (versionToRestore && versionToRestore.config) {
      setConfig(versionToRestore.config);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Restaurar una versión específica del historial
  const restoreVersion = useCallback((index: number) => {
    if (!history || index >= history.length) return;
    
    const versionToRestore = history[index];
    if (versionToRestore && versionToRestore.config) {
      setConfig(versionToRestore.config);
      setHistoryIndex(index);
    }
  }, [history]);

  // Descartar todos los cambios no guardados
  const discardChanges = useCallback(() => {
    if (originalConfig) {
      setConfig(originalConfig);
      lastSavedConfig.current = originalConfig;
      deleteDraft(invitationId);
    }
  }, [invitationId, originalConfig]);

  return {
    config,
    setConfig,
    hasPendingChanges: hasPendingChanges(),
    isSaving,
    saveChanges,
    saveAllChanges,
    undoChange,
    redoChange,
    history,
    canUndo: !!(history && historyIndex < history.length - 1),
    canRedo: !!(history && historyIndex > 0),
    restoreVersion,
    discardChanges
  };
}

export default useProgressiveSaving;
