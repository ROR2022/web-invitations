"use client";

import { TemplateConfig } from '@/components/template-editor/types';

/**
 * Servicio para gestionar el guardado progresivo de cambios en el editor móvil
 */

// Constantes para localStorage
const DRAFT_PREFIX = 'invitation_draft_';
const HISTORY_PREFIX = 'invitation_history_';
const MAX_HISTORY_ENTRIES = 10;

/**
 * Guarda un borrador de la configuración en localStorage
 */
export const saveDraft = (invitationId: string, config: TemplateConfig): void => {
  try {
    const key = `${DRAFT_PREFIX}${invitationId}`;
    const draft = {
      config,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(draft));
    console.log('Borrador guardado localmente:', invitationId);
  } catch (error) {
    console.error('Error al guardar borrador:', error);
  }
};

/**
 * Recupera un borrador guardado
 */
export const getDraft = (invitationId: string): { config: TemplateConfig; timestamp: string } | null => {
  try {
    const key = `${DRAFT_PREFIX}${invitationId}`;
    const draft = localStorage.getItem(key);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Error al recuperar borrador:', error);
    return null;
  }
};

/**
 * Elimina un borrador guardado
 */
export const deleteDraft = (invitationId: string): void => {
  try {
    const key = `${DRAFT_PREFIX}${invitationId}`;
    localStorage.removeItem(key);
    console.log('Borrador eliminado:', invitationId);
  } catch (error) {
    console.error('Error al eliminar borrador:', error);
  }
};

/**
 * Añade una entrada al historial de cambios
 */
export const addToHistory = (invitationId: string, config: TemplateConfig, label?: string): void => {
  try {
    const key = `${HISTORY_PREFIX}${invitationId}`;
    
    // Obtener historial actual
    let history = getHistory(invitationId) || [];
    
    // Añadir nueva entrada
    const newEntry = {
      config,
      timestamp: new Date().toISOString(),
      label: label || `Cambios ${new Date().toLocaleString()}`
    };
    
    // Añadir al principio para que los más recientes estén primero
    history.unshift(newEntry);
    
    // Limitar el número de entradas
    if (history.length > MAX_HISTORY_ENTRIES) {
      history = history.slice(0, MAX_HISTORY_ENTRIES);
    }
    
    // Guardar historial actualizado
    localStorage.setItem(key, JSON.stringify(history));
  } catch (error) {
    console.error('Error al guardar historial:', error);
  }
};

/**
 * Recupera el historial de cambios
 */
export const getHistory = (invitationId: string): Array<{
  config: TemplateConfig;
  timestamp: string;
  label: string;
}> | null => {
  try {
    const key = `${HISTORY_PREFIX}${invitationId}`;
    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : null;
  } catch (error) {
    console.error('Error al recuperar historial:', error);
    return null;
  }
};

/**
 * Restaura una configuración desde el historial
 */
export const restoreFromHistory = (invitationId: string, index: number): TemplateConfig | null => {
  try {
    const history = getHistory(invitationId);
    if (!history || index >= history.length) return null;
    
    return history[index].config;
  } catch (error) {
    console.error('Error al restaurar desde historial:', error);
    return null;
  }
};

/**
 * Comprueba si hay conexión a Internet
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Comprueba si hay borradores pendientes de sincronizar
 */
export const hasPendingDrafts = (): string[] => {
  try {
    const pendingDrafts: string[] = [];
    
    // Buscar todas las claves en localStorage que empiezan con el prefijo
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX)) {
        const invitationId = key.substring(DRAFT_PREFIX.length);
        pendingDrafts.push(invitationId);
      }
    }
    
    return pendingDrafts;
  } catch (error) {
    console.error('Error al buscar borradores pendientes:', error);
    return [];
  }
};

// Exportar constantes útiles
export const DRAFT_AUTOSAVE_INTERVAL = 30000; // 30 segundos
