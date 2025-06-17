// Exportar el componente principal
export { default as PropertyEditor } from './PropertyEditor';

// Exportar los componentes de utilidad
export { default as ComponentControls } from './common/ComponentControls';
export { default as PropertyLabel } from './common/PropertyLabel';
export { default as PropertyWrapper } from './common/PropertyWrapper';

// Exportar hooks
export { useComponentProperties } from './hooks/useComponentProperties';
export type { NamedComponentProperty } from './hooks/useComponentProperties';

// Exportar utilidades
export { createPropertyControl } from './utils/control-factory';
export { PROPERTY_GROUPS, EVENT_TYPE_OPTIONS, EVENT_COLOR_PALETTES } from './utils/property-groups';
