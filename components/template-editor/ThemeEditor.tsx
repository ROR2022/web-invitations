"use client";

import React from 'react';
import { Theme } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { predefinedThemes } from './themeSchemas';

interface ThemeEditorProps {
  theme: Theme;
  onThemeChange: (property: string, value: any) => void;
}

/**
 * Editor de temas para personalizar los colores y estilos
 * de la invitación
 */
const ThemeEditor: React.FC<ThemeEditorProps> = ({
  theme,
  onThemeChange
}) => {
  // Función para aplicar un tema predefinido
  const applyTheme = (presetTheme: Theme) => {
    Object.entries(presetTheme.colors).forEach(([key, value]) => {
      onThemeChange(key, value);
    });
  };

  // Función para generar un preset de color
  const colorPreset = (color: string, name: string) => (
    <button
      type="button"
      className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
      style={{ backgroundColor: color }}
      title={name}
      onClick={() => onThemeChange('primary', color)}
      aria-label={`Seleccionar color ${name}`}
    ></button>
  );

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-medium mb-4 flex items-center">
        <span className="w-3 h-3 bg-primary mr-2 rounded-full"></span>
        Tema
      </h3>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {/* Temas predefinidos */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Temas predefinidos</div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Temas predefinidos">
            {Object.entries(predefinedThemes).map(([key, presetTheme]) => (
              <Button
                key={key}
                variant="outline"
                className="h-14 flex flex-col justify-center relative overflow-hidden"
                onClick={() => applyTheme(presetTheme)}
              >
                <span className="text-sm">{presetTheme.name}</span>
                <div className="absolute bottom-0 left-0 w-full h-1.5 flex">
                  <div style={{ backgroundColor: presetTheme.colors.primary }} className="flex-1"></div>
                  <div style={{ backgroundColor: presetTheme.colors.secondary }} className="flex-1"></div>
                  <div style={{ backgroundColor: presetTheme.colors.background }} className="flex-1"></div>
                  <div style={{ backgroundColor: presetTheme.colors.text }} className="flex-1"></div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Colores personalizados</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm">
                  Color primario
                </div>
                <span className="text-xs text-gray-500">{theme.colors.primary}</span>
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="color"
                  id="primary-color"
                  value={theme.colors.primary}
                  onChange={(e) => onThemeChange('primary', e.target.value)}
                  className="w-8 h-8 p-0 rounded-md border border-gray-200"
                />
                <div className="flex space-x-1 ml-2">
                  {colorPreset('#0f766e', 'Teal')}
                  {colorPreset('#be123c', 'Rose')}
                  {colorPreset('#7c3aed', 'Violet')}
                  {colorPreset('#1d4ed8', 'Blue')}
                  {colorPreset('#a16207', 'Amber')}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm">
                  Color secundario
                </div>
                <span className="text-xs text-gray-500">{theme.colors.secondary}</span>
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="color"
                  id="secondary-color"
                  value={theme.colors.secondary}
                  onChange={(e) => onThemeChange('secondary', e.target.value)}
                  className="w-8 h-8 p-0 rounded-md border border-gray-200"
                />
                <div className="flex space-x-1 ml-2">
                  {colorPreset('#0f766e', 'Teal')}
                  {colorPreset('#be123c', 'Rose')}
                  {colorPreset('#7c3aed', 'Violet')}
                  {colorPreset('#1d4ed8', 'Blue')}
                  {colorPreset('#a16207', 'Amber')}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm">
                  Color de fondo
                </div>
                <span className="text-xs text-gray-500">{theme.colors.background}</span>
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="color"
                  id="background-color"
                  value={theme.colors.background}
                  onChange={(e) => onThemeChange('background', e.target.value)}
                  className="w-8 h-8 p-0 rounded-md border border-gray-200"
                />
                <div className="flex space-x-1 ml-2">
                  {colorPreset('#ffffff', 'White')}
                  {colorPreset('#f8fafc', 'Light Gray')}
                  {colorPreset('#f8f5ff', 'Light Violet')}
                  {colorPreset('#fef2f2', 'Light Red')}
                  {colorPreset('#f0fdf4', 'Light Green')}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm">
                  Color de texto
                </div>
                <span className="text-xs text-gray-500">{theme.colors.text}</span>
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="color"
                  id="text-color"
                  value={theme.colors.text}
                  onChange={(e) => onThemeChange('text', e.target.value)}
                  className="w-8 h-8 p-0 rounded-md border border-gray-200"
                />
                <div className="flex space-x-1 ml-2">
                  {colorPreset('#000000', 'Black')}
                  {colorPreset('#334155', 'Dark Gray')}
                  {colorPreset('#1e293b', 'Slate')}
                  {colorPreset('#3f3f46', 'Zinc')}
                  {colorPreset('#44403c', 'Stone')}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm">
                  Color de encabezados
                </div>
                <span className="text-xs text-gray-500">{theme.colors.headings || theme.colors.primary}</span>
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="color"
                  id="headings-color"
                  value={theme.colors.headings || theme.colors.primary}
                  onChange={(e) => onThemeChange('headings', e.target.value)}
                  className="w-8 h-8 p-0 rounded-md border border-gray-200"
                />
                <div className="flex space-x-1 ml-2">
                  {colorPreset('#0f766e', 'Teal')}
                  {colorPreset('#be123c', 'Rose')}
                  {colorPreset('#7c3aed', 'Violet')}
                  {colorPreset('#1d4ed8', 'Blue')}
                  {colorPreset('#a16207', 'Amber')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vista previa del tema */}
        <div className="mt-8 border rounded-md overflow-hidden">
          <div className="text-sm font-medium px-3 py-2 bg-gray-50 border-b">
            Vista previa del tema
          </div>
          
          <div 
            className="p-4 space-y-4"
            style={{ 
              backgroundColor: theme.colors.background,
              color: theme.colors.text
            }}
          >
            <h1 
              className="text-xl font-medium" 
              style={{ color: theme.colors.headings || theme.colors.primary }}
            >
              Título de ejemplo
            </h1>
            
            <p>Este es un texto de ejemplo para mostrar cómo se ve el tema seleccionado.</p>
            
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 rounded text-white" 
                style={{ backgroundColor: theme.colors.primary }}
              >
                Botón primario
              </button>
              
              <button 
                className="px-3 py-1 rounded text-white" 
                style={{ backgroundColor: theme.colors.secondary }}
              >
                Botón secundario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;
