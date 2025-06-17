# Control de Texto Enriquecido para Móvil (MobileRichTextControl)

Este componente proporciona una interfaz optimizada para dispositivos móviles que permite a los usuarios editar texto con formato básico en las invitaciones.

## Características

- **Barra de herramientas simple**: Con botones para aplicar formatos básicos (negrita, cursiva, subrayado)
- **Área de texto amplia**: Adaptada para entrada de texto cómoda en dispositivos móviles
- **Soporte para sintaxis Markdown**: Permite usar marcadores como `**negrita**`, `*cursiva*` y `_subrayado_`
- **Guía de uso**: Incluye instrucciones sencillas para el usuario

## Uso

El control está diseñado para trabajar con el sistema de edición de propiedades móvil:

```jsx
<MobileRichTextControl
  label="Mensaje"
  value={textValue}
  onChange={handleTextChange}
  multiline={true}
/>
```

## Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Etiqueta descriptiva para el control |
| `value` | string | Valor actual del texto con formato |
| `onChange` | function | Función que se llama al cambiar el texto |
| `multiline` | boolean | Define si el campo debe permitir múltiples líneas (por defecto: true) |

## Formatos soportados

El control soporta un conjunto básico de formatos mediante sintaxis Markdown:

- **Negrita**: Texto entre dobles asteriscos `**texto**`
- **Cursiva**: Texto entre asteriscos simples `*texto*`
- **Subrayado**: Texto entre guiones bajos `_texto_`

## Implementación

El componente está optimizado para dispositivos móviles con:
- Botones grandes para facilitar la aplicación de formatos
- Área de texto expandible para mostrar contenido extenso
- Interfaz simplificada para mejor experiencia en pantallas táctiles

## Consideraciones

Para esta primera versión, se ha implementado un editor de texto enriquecido básico. En versiones futuras, se podría expandir para incluir:

- Alineación de texto
- Listas (ordenadas y desordenadas)
- Tamaños de texto
- Colores
- Vista previa WYSIWYG

## Integración con otros componentes

Este control se utiliza principalmente en componentes que requieren entradas de texto con formato, como:
- Mensajes de agradecimiento
- Descripciones de eventos
- Secciones informativas
