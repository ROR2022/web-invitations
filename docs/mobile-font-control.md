# Control de Fuentes para Móvil (MobileFontControl)

Este componente proporciona una interfaz optimizada para dispositivos móviles que permite a los usuarios seleccionar fuentes tipográficas para el texto de sus invitaciones.

## Características

- **Selector categorizado**: Fuentes agrupadas por categorías (Caligráficas, Tradicionales, Modernas)
- **Vista previa instantánea**: Muestra cómo se verá el texto con la fuente seleccionada
- **Interfaz expansible**: Diseño que permite mantener un uso eficiente del espacio en pantalla
- **Texto de muestra personalizable**: Posibilidad de definir el texto que se usará para la vista previa

## Uso

El control está diseñado para trabajar con el sistema de edición de propiedades móvil:

```jsx
<MobileFontControl
  label="Fuente del título"
  value={selectedFont}
  onChange={handleFontChange}
  sampleText="Juan & María"
/>
```

## Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Etiqueta descriptiva para el control |
| `value` | string | Nombre de la fuente seleccionada |
| `onChange` | function | Función que se llama al cambiar la selección de fuente |
| `sampleText` | string | Texto de muestra para previsualizar la fuente (opcional) |

## Fuentes disponibles

El control incluye una selección de fuentes populares para invitaciones agrupadas por categorías:

### Caligráficas
- Great Vibes
- Dancing Script
- Pacifico

### Tradicionales
- Playfair Display
- Lora
- Merriweather

### Modernas
- Montserrat
- Roboto
- Open Sans
- Oswald

## Implementación

El componente está optimizado para dispositivos móviles con:
- Categorías colapsables para mostrar solo las fuentes relevantes
- Diseño jerárquico para facilitar la navegación
- Visualización clara de la selección actual
- Vista previa de tamaño adecuado para apreciar los detalles de la fuente

## Integración con otros componentes

Este control se utiliza principalmente en componentes que requieren personalización tipográfica, como:
- Encabezados (Hero)
- Títulos de sección
- Elementos donde la tipografía es un aspecto importante del diseño
