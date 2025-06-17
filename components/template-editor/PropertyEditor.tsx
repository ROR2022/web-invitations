"use client";

// Este archivo ahora importa y reexporta la versión modular de PropertyEditor
// La implementación ha sido refactorizada en componentes más pequeños y específicos
// ubicados en la carpeta /property-editor

import { PropertyEditor as ModularPropertyEditor } from './property-editor';
export type { PropertyEditorProps } from './property-editor/PropertyEditor';

// Reexportar para mantener compatibilidad con el código existente
export default ModularPropertyEditor;
