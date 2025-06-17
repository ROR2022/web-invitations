"use client";

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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
interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
  sampleText?: string;
  placeholder?: string;
  label?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange,
  sampleText = "Texto de muestra",
  placeholder = "Selecciona una fuente",
  label,
}) => {
  const [selectedFont, setSelectedFont] = useState(value || '');

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

  // Manejar cambio de selección
  const handleChange = (newValue: string) => {
    console.log('FontSelector: Cambiando selección a:', newValue);
    setSelectedFont(newValue);
    onChange(newValue);
  };

  // Obtener el objeto de fuente seleccionada
  const getSelectedFontObject = () => {
    return availableFonts.find(font => font.name === selectedFont) || null;
  };

  // Obtener el estilo de la fuente seleccionada
  const getFontStyle = () => {
    const font = getSelectedFontObject();
    return font ? { fontFamily: font.family } : {};
  };

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 text-sm font-medium">{label}</div>
      )}
      
      <Select
        value={selectedFont}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(fontsByCategory).map(([category, fonts]) => (
            <SelectGroup key={category}>
              <div className="px-2 py-1.5 text-sm font-semibold">
                {category}
              </div>
              {fonts.map(font => (
                <SelectItem
                  key={font.name}
                  value={font.name}
                >
                  <div className="flex justify-between items-center w-full">
                    <span style={{ fontFamily: font.family }}>
                      {font.name}
                    </span>
                    {selectedFont === font.name && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {/* Vista previa de la fuente seleccionada */}
      {selectedFont && (
        <div className="mt-4 p-3 border rounded-md">
          <div className="text-sm text-muted-foreground mb-2">Vista previa:</div>
          <div 
            className="text-xl py-2"
            style={getFontStyle()}
          >
            {sampleText}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
