"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateConfig } from '../types';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, RotateCw, CheckCircle, Clock } from 'lucide-react';

interface MobileHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{
    config: TemplateConfig;
    timestamp: string;
    label: string;
  }> | null;
  currentIndex: number;
  onRestore: (index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Panel para mostrar y gestionar el historial de cambios
 */
const MobileHistoryPanel: React.FC<MobileHistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  currentIndex,
  onRestore,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  // Formatear fecha/hora
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
  };

  // Animaciones
  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-lg flex flex-col"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Historial de cambios</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
            
            {/* Botones de deshacer/rehacer */}
            <div className="flex items-center justify-center gap-4 p-4 border-b">
              <Button 
                variant="outline" 
                size="icon"
                disabled={!canUndo}
                onClick={onUndo}
                className="h-10 w-10"
              >
                <RotateCcw size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                disabled={!canRedo}
                onClick={onRedo}
                className="h-10 w-10"
              >
                <RotateCw size={18} />
              </Button>
            </div>
            
            {/* Lista de versiones */}
            <div className="flex-1 overflow-auto p-2">
              {!history || history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Clock size={40} strokeWidth={1.5} className="mb-2" />
                  <p>No hay historial disponible</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {history.map((entry, index) => (
                    <li 
                      key={entry.timestamp} 
                      className={`p-3 rounded-md border ${index === currentIndex ? 'bg-primary/10 border-primary' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <button
                        className="w-full text-left flex items-start gap-3"
                        onClick={() => onRestore(index)}
                        disabled={index === currentIndex}
                      >
                        {index === currentIndex ? (
                          <CheckCircle size={18} className="text-primary shrink-0 mt-1" />
                        ) : (
                          <Clock size={18} className="text-gray-500 shrink-0 mt-1" />
                        )}
                        
                        <div>
                          <p className="font-medium">{entry.label}</p>
                          <p className="text-xs text-gray-500">{formatTimestamp(entry.timestamp)}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileHistoryPanel;
