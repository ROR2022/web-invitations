"use client";

import React from 'react';

// Tipos
interface MobileRichTextControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

/**
 * Control para editar texto con formato básico en dispositivos móviles
 */
const MobileRichTextControl: React.FC<MobileRichTextControlProps> = ({
  label,
  value,
  onChange,
  multiline = true
}) => {
  // Manejador de cambios en el texto
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Aplicar formato (negrita, cursiva, etc.)
  const applyFormat = (format: 'bold' | 'italic' | 'underline') => {
    // En una implementación real, esto podría ser más complejo con selección de texto
    // y aplicación de etiquetas HTML o formato markdown.
    // Para esta versión simplificada, solo añadimos marcadores básicos
    
    let newValue = value;
    
    switch (format) {
      case 'bold':
        newValue = `**${value}**`;
        break;
      case 'italic':
        newValue = `*${value}*`;
        break;
      case 'underline':
        newValue = `_${value}_`;
        break;
    }
    
    onChange(newValue);
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="rich-text-control">
        {/* Barra de herramientas simple */}
        <div className="text-formatting-toolbar flex space-x-2 mb-2">
          <button 
            type="button"
            onClick={() => applyFormat('bold')}
            className="p-2 border border-gray-300 rounded-md bg-white"
            title="Negrita"
          >
            <span className="font-bold">B</span>
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('italic')}
            className="p-2 border border-gray-300 rounded-md bg-white"
            title="Cursiva"
          >
            <span className="italic">I</span>
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('underline')}
            className="p-2 border border-gray-300 rounded-md bg-white"
            title="Subrayado"
          >
            <span className="underline">U</span>
          </button>
        </div>
        
        {/* Área de texto */}
        <textarea
          value={value || ''}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md min-h-[120px]"
          placeholder="Escribe aquí..."
        />
        
        {/* Nota informativa */}
        <div className="text-xs text-gray-500 mt-1">
          Usa **texto** para negrita, *texto* para cursiva, _texto_ para subrayado
        </div>
      </div>
    </div>
  );
};

export default MobileRichTextControl;
