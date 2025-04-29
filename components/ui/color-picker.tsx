"use client";

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  className?: string;
}

/**
 * Componente para seleccionar colores
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  id,
  name,
  className = ""
}) => {
  // Colores predefinidos
  const presetColors = [
    '#0f766e',  // Teal
    '#be123c',  // Rose
    '#7c3aed',  // Violet
    '#1d4ed8',  // Blue
    '#a16207',  // Amber
    '#000000',  // Black
    '#334155',  // Dark Gray
    '#ffffff',  // White
    '#f8fafc',  // Light Gray
    '#f8f5ff',  // Light Violet
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          name={name}
          className={`flex items-center space-x-2 h-9 px-3 py-2 border border-input rounded-md ${className}`}
          aria-label="Select color"
        >
          <div
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: value }}
          />
          <span>{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8"
          />
          
          <div>
            <div className="text-xs mb-2 text-muted-foreground">Colores predefinidos</div>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded-md border flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  onClick={() => onChange(color)}
                  aria-label={`Select color ${color}`}
                >
                  {color === value && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white"
                      style={{ filter: "drop-shadow(0px 0px 1px rgba(0,0,0,0.8))" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ColorPicker };
