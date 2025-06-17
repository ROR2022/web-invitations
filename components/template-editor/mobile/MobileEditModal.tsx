"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ComponentConfig, ComponentType } from '../types';
import { X } from 'lucide-react';
import MobilePropertyEditor from './MobilePropertyEditor';
import './mobile-preview.css';

// Tipos
interface MobileEditModalProps {
  isOpen: boolean;
  component: ComponentConfig | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (componentId: string, propertyName: string, value: any) => void;
  pendingChanges: Record<string, any>;
}

/**
 * Modal contextual para editar propiedades de componentes en dispositivos móviles
 */
const MobileEditModal: React.FC<MobileEditModalProps> = ({
  isOpen,
  component,
  onClose,
  onSave,
  onChange,
  pendingChanges
}) => {
  if (!component) return null;

  // Manejar cambios en las propiedades
  const handlePropertyChange = (propertyName: string, value: any) => {
    onChange(component.id, propertyName, value);
  };

  // Obtener el nombre amigable del componente
  const getComponentDisplayName = (type: ComponentType) => {
    const displayNames: Record<ComponentType, string> = {
      [ComponentType.HERO]: 'Portada',
      [ComponentType.EVENT_DETAILS]: 'Detalles del Evento',
      [ComponentType.COUNTDOWN]: 'Cuenta Regresiva',
      [ComponentType.GALLERY]: 'Galería',
      [ComponentType.ATTENDANCE]: 'Asistencia',
      [ComponentType.MUSIC_PLAYER]: 'Reproductor de Música',
      [ComponentType.THANK_YOU]: 'Agradecimiento',
      [ComponentType.ACCOMMODATION]: 'Alojamiento',
      [ComponentType.ITINERARY]: 'Itinerario',
      [ComponentType.GIFT_OPTIONS]: 'Mesa de Regalos',
      [ComponentType.INVITATION]: 'Invitación Formal',
      [ComponentType.COUPLE]: 'Nosotros',
    };
    
    return `Editar ${displayNames[type] || String(type)}`;
  };

  // Crear una versión del componente con las propiedades actualizadas para la vista previa
  const previewComponent = {
    ...component,
    properties: {
      ...component.properties,
      ...pendingChanges
    }
  };

  // Renderizar el componente para la vista previa
  const renderComponentPreview = () => {
    // Usar las propiedades del componente directamente
    const props = previewComponent.properties;
    const componentType = previewComponent.type as ComponentType;

    // Mostrar una vista previa simplificada para todos los componentes
    return (
      <div className="component-preview-content">
        <h3 className="text-lg font-semibold mb-2">{props.title || 'Sin título'}</h3>
        
        {componentType === ComponentType.HERO && (
          <div className="preview-hero" style={{ backgroundColor: '#f5f5f5', padding: '20px', textAlign: 'center' }}>
            <div className="text-lg" style={{ color: props.textColor || '#000' }}>{props.subtitle || 'Subtítulo'}</div>
            <div className="text-xl mt-2" style={{ fontFamily: props.nameFont || 'cursive' }}>{props.name || 'Nombres'}</div>
          </div>
        )}
        
        {componentType === ComponentType.EVENT_DETAILS && (
          <div className="preview-details" style={{ padding: '10px' }}>
            <div className="text-sm"><b>Fecha:</b> {props.date || 'No especificada'}</div>
            <div className="text-sm"><b>Hora:</b> {props.time || 'No especificada'}</div>
            <div className="text-sm"><b>Lugar:</b> {props.location || 'No especificado'}</div>
          </div>
        )}
        
        {componentType === ComponentType.COUNTDOWN && (
          <div className="preview-countdown" style={{ padding: '10px', backgroundColor: props.backgroundColor || '#f9f9f9', color: props.textColor || '#333' }}>
            <div className="flex justify-around text-center">
              <div><span className="text-xl font-bold">15</span><br /><span className="text-xs">DÍAS</span></div>
              <div><span className="text-xl font-bold">05</span><br /><span className="text-xs">HORAS</span></div>
              <div><span className="text-xl font-bold">32</span><br /><span className="text-xs">MIN</span></div>
              <div><span className="text-xl font-bold">10</span><br /><span className="text-xs">SEG</span></div>
            </div>
          </div>
        )}
        
        {componentType === ComponentType.GALLERY && (
          <div className="preview-gallery grid grid-cols-2 gap-2 mt-2">
            <div className="bg-gray-200 h-16 rounded"></div>
            <div className="bg-gray-200 h-16 rounded"></div>
            <div className="bg-gray-200 h-16 rounded"></div>
            <div className="bg-gray-200 h-16 rounded"></div>
          </div>
        )}
        
        {componentType === ComponentType.ATTENDANCE && (
          <div className="preview-attendance text-center p-2">
            <p className="text-sm">{props.description || 'Confirma tu asistencia'}</p>
            <button className="mt-2 px-4 py-1 bg-purple-600 text-white rounded-md text-sm">
              {props.buttonText || 'Confirmar'}
            </button>
          </div>
        )}
        
        {componentType === ComponentType.MUSIC_PLAYER && (
          <div className="preview-music p-2 border rounded">
            <div className="flex items-center">
              <div className="mr-2 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">▶</div>
              <div>
                <div className="text-sm font-semibold">{props.songTitle || 'Título de la canción'}</div>
                <div className="text-xs text-gray-600">{props.songArtist || 'Artista'}</div>
              </div>
            </div>
          </div>
        )}
        
        {componentType === ComponentType.THANK_YOU && (
          <div className="preview-thank-you text-center p-2">
            <p className="text-sm italic">{props.message || 'Gracias por compartir este momento especial'}</p>
            <p className="text-sm font-semibold mt-2">{props.signature || 'Los anfitriones'}</p>
          </div>
        )}
      </div>
    );
  };

  // Verificar si hay cambios pendientes antes de cerrar
  const handleClose = () => {
    // Si hay cambios pendientes, podríamos preguntar al usuario si desea guardarlos
    // Por ahora, simplemente cerraremos sin guardar
    onClose();
  };

  return (
    <motion.div 
      className="mobile-edit-modal"
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="modal-header">
        <div className="modal-title">{getComponentDisplayName(component.type as ComponentType)}</div>
        <button className="close-button" onClick={handleClose} aria-label="Cerrar">
          <X size={18} />
        </button>
      </div>
      
      <div className="component-preview">
        {renderComponentPreview()}
      </div>
      
      <div className="property-editor">
        <MobilePropertyEditor 
          component={component}
          onChange={handlePropertyChange}
          pendingChanges={pendingChanges}
        />
      </div>
      
      <div className="modal-footer">
        <button className="cancel-button" onClick={handleClose}>
          Cancelar
        </button>
        <button 
          className="save-button" 
          onClick={onSave}
          disabled={Object.keys(pendingChanges).length === 0}
        >
          Guardar Cambios
        </button>
      </div>
    </motion.div>
  );
};

export default MobileEditModal;
