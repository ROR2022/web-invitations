# Componentes de la Fase 4 - Editor Móvil

## MobileHistoryPanel

El componente `MobileHistoryPanel` es un panel deslizable que muestra el historial de cambios realizados en la invitación. Permite al usuario navegar entre diferentes versiones y aplicar acciones de deshacer/rehacer.

### Props

```typescript
interface MobileHistoryPanelProps {
  isOpen: boolean;              // Controla la visibilidad del panel
  onClose: () => void;          // Función para cerrar el panel
  history: Array<{              // Array con el historial de versiones
    config: TemplateConfig;     // Configuración completa de cada versión
    timestamp: string;          // Fecha y hora de la versión
    label: string;              // Etiqueta descriptiva 
  }> | null;
  currentIndex: number;         // Índice de la versión actual en el historial
  onRestore: (index: number) => void;  // Función para restaurar una versión
  onUndo: () => void;           // Función para deshacer el último cambio
  onRedo: () => void;           // Función para rehacer un cambio deshecho
  canUndo: boolean;             // Si es posible deshacer
  canRedo: boolean;             // Si es posible rehacer
}
```

### Características

- Animaciones fluidas de entrada/salida
- Visualización clara de las versiones con marcado de la versión actual
- Botones de acción para deshacer/rehacer
- Diseño optimizado para móviles
- Backdrop semi-transparente para mejor contexto visual

### Uso

```tsx
<MobileHistoryPanel
  isOpen={isHistoryOpen}
  onClose={() => setIsHistoryOpen(false)}
  history={history}
  currentIndex={historyIndex}
  onRestore={handleRestoreVersion}
  onUndo={handleUndo}
  onRedo={handleRedo}
  canUndo={canUndo}
  canRedo={canRedo}
/>
```

## Funcionalidades Añadidas al MobileTemplateEditor

### Guardado Progresivo

- **Guardado Automático**: Los cambios se guardan automáticamente cada 30 segundos.
- **Guardado Manual**: Los cambios se guardan manualmente al cerrar un componente editado.
- **Sincronización**: Los cambios locales se sincronizan con el servidor al guardar.

### Optimización de Imágenes

- **Redimensionado Automático**: Las imágenes se redimensionan para dispositivos móviles.
- **Conversión de Formato**: Se utiliza WebP cuando está disponible para mejor rendimiento.
- **Precarga**: Los recursos se precargan para mejorar la experiencia del usuario.

### Indicadores Visuales

- **Indicador de Carga**: Muestra el progreso de carga de recursos.
- **Indicador de Éxito**: Confirma visualmente el guardado exitoso.
- **Botón de Historial**: Acceso rápido al historial de cambios.
