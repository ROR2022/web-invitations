"use client";

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

// Lista de fuentes disponibles
const availableFonts = [
  { name: 'Great Vibes', family: 'var(--font-great-vibes)', style: 'script', category: 'Caligráficas' },
  { name: 'Playfair Display', family: 'var(--font-playfair)', style: 'serif', category: 'Tradicionales' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', style: 'sans-serif', category: 'Modernas' },
  { name: 'Roboto', family: 'Roboto, sans-serif', style: 'sans-serif', category: 'Modernas' },
  { name: 'Lora', family: 'Lora, serif', style: 'serif', category: 'Tradicionales' },
  { name: 'Dancing Script', family: 'Dancing Script, cursive', style: 'script', category: 'Caligráficas' },
  { name: 'Pacifico', family: 'Pacifico, cursive', style: 'script', category: 'Caligráficas' },
  { name: 'Open Sans', family: 'Open Sans, sans-serif', style: 'sans-serif', category: 'Modernas' },
  { name: 'Oswald', family: 'Oswald, sans-serif', style: 'sans-serif', category: 'Modernas' },
  { name: 'Merriweather', family: 'Merriweather, serif', style: 'serif', category: 'Tradicionales' }
];

// Tipo de propiedades
interface MobileFontControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  sampleText?: string;
}

/**
 * Control para seleccionar fuentes en dispositivos móviles
 */
const MobileFontControl: React.FC<MobileFontControlProps> = ({
  label,
  value,
  onChange,
  sampleText = "Texto de muestra"
}) => {
  const [selectedFont, setSelectedFont] = useState(value || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Efecto para inicializar el valor seleccionado
  useEffect(() => {
    if (value) {
      setSelectedFont(value);
    }
  }, [value]);

  // Agrupar fuentes por categoría
  const fontsByCategory: Record<string, typeof availableFonts> = {};
  availableFonts.forEach(font => {
    if (!fontsByCategory[font.category]) {
      fontsByCategory[font.category] = [];
    }
    fontsByCategory[font.category].push(font);
  });

  // Obtener categorías disponibles
  const categories = Object.keys(fontsByCategory);

  // Manejar selección de fuente
  const handleFontSelect = (fontName: string) => {
    setSelectedFont(fontName);
    onChange(fontName);
    setIsExpanded(false);
    setActiveCategory(null);
  };

  // Obtener el objeto de fuente seleccionada
  const getSelectedFontObject = () => {
    return availableFonts.find(font => font.name === selectedFont) || null;
  };

  // Togglear la visualización de categorías
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setActiveCategory(null);
    }
  };

  // Togglear la visualización de fuentes de una categoría
  const toggleCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  // Obtener el estilo de la fuente seleccionada
  const getFontStyle = (fontName?: string) => {
    const font = fontName 
      ? availableFonts.find(f => f.name === fontName) 
      : getSelectedFontObject();
    return font ? { fontFamily: font.family } : {};
  };

  return (
    <div className="property-control">
      <div className="property-label">{label}</div>
      <div className="font-selector-mobile">
        {/* Selector principal */}
        <div 
          className="font-selector-trigger p-3 border border-gray-300 rounded-md flex items-center justify-between"
          onClick={toggleExpanded}
          onKeyDown={(e) => e.key === 'Enter' && toggleExpanded()}
          tabIndex={0}
          role="button"
          aria-expanded={isExpanded}
          aria-haspopup="listbox"
        >
          <span style={getFontStyle()}>
            {selectedFont || "Selecciona una fuente"}
          </span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
          </svg>
        </div>

        {/* Vista previa */}
        {selectedFont && (
          <div className="mt-3 p-3 border border-gray-300 rounded-md bg-gray-50">
            <div className="text-sm text-gray-500 mb-1">Vista previa:</div>
            <div 
              className="text-xl py-2"
              style={getFontStyle()}
            >
              {sampleText}
            </div>
          </div>
        )}

        {/* Lista de categorías y fuentes */}
        {isExpanded && (
          <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
            {categories.map(category => (
              <div key={category} className="font-category">
                <div 
                  className="p-3 bg-gray-100 font-medium border-b border-gray-300 flex items-center justify-between"
                  onClick={() => toggleCategory(category)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleCategory(category)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={activeCategory === category}
                >
                  {category}
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform ${activeCategory === category ? 'rotate-180' : ''}`}
                  >
                    <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
                  </svg>
                </div>
                {activeCategory === category && (
                  <div className="font-list">
                    {fontsByCategory[category].map(font => (
                      <div 
                        key={font.name}
                        className={`p-3 border-b border-gray-200 flex items-center justify-between ${selectedFont === font.name ? 'bg-blue-50' : ''}`}
                        onClick={() => handleFontSelect(font.name)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFontSelect(font.name)}
                        tabIndex={0}
                        role="option"
                        aria-selected={selectedFont === font.name}
                      >
                        <span style={{ fontFamily: font.family }}>
                          {font.name}
                        </span>
                        {selectedFont === font.name && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileFontControl;
