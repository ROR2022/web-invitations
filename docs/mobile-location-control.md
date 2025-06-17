# Control de Ubicación para Móvil (MobileLocationControl)

Este componente proporciona una interfaz optimizada para dispositivos móviles que permite a los usuarios gestionar información de ubicación en las invitaciones.

## Características

- **Campo de dirección**: Permite ingresar la dirección física del evento
- **Campo de URL**: Para añadir un enlace directo a un servicio de mapas (Google Maps, Waze, etc.)
- **Generación automática**: Botón para crear automáticamente un enlace de Google Maps basado en la dirección
- **Personalización del botón**: Campo para personalizar el texto del botón que mostrará el enlace

## Uso

El control está diseñado para trabajar con el sistema de edición de propiedades móvil:

```jsx
<MobileLocationControl
  label="Ubicación"
  value={locationData}
  onChange={handleLocationChange}
/>
```

## Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Etiqueta descriptiva para el control |
| `value` | object \| string | Valor actual de la ubicación (puede ser un objeto con address, locationUrl y buttonText, o una simple cadena de texto) |
| `onChange` | function | Función que se llama al cambiar cualquier valor |

## Estructura de datos

El control maneja un objeto con la siguiente estructura:

```typescript
{
  address: string;       // Dirección física del evento
  locationUrl?: string;  // URL al mapa (Google Maps, Waze, etc.)
  buttonText?: string;   // Texto personalizado para el botón que muestra el mapa
}
```

## Implementación

El componente está optimizado para pantallas táctiles con:
- Campos de entrada más grandes para facilitar la escritura
- Botones con áreas de toque adecuadas
- Diseño vertical para evitar problemas de espacio horizontal

## Integración con otros componentes

Este control se utiliza principalmente en componentes de tipo `EVENT_DETAILS` y cualquier otro que requiera mostrar información de ubicación.
