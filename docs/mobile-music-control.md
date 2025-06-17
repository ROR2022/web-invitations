# Control de Música para Móvil (MobileMusicControl)

Este componente proporciona una interfaz optimizada para dispositivos móviles que permite a los usuarios seleccionar y previsualizar música para sus invitaciones.

## Características

- **Selector de canciones predefinidas**: Lista de canciones populares para bodas y eventos
- **Soporte para URL personalizadas**: Posibilidad de añadir canciones propias mediante URL
- **Reproductor integrado**: Previsualización de la canción seleccionada
- **Interfaz táctil adaptada**: Botones grandes y controles optimizados para uso móvil

## Uso

El control está diseñado para trabajar con el sistema de edición de propiedades móvil:

```jsx
<MobileMusicControl
  label="Música de fondo"
  value={musicUrl}
  onChange={handleMusicChange}
/>
```

## Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Etiqueta descriptiva para el control |
| `value` | string | URL de la canción seleccionada |
| `onChange` | function | Función que se llama al cambiar la selección de música |

## Canciones predefinidas

El control incluye una selección de canciones populares para eventos:

- Perfect (Ed Sheeran)
- A Thousand Years (Christina Perri)
- Thinking Out Loud (Ed Sheeran)
- Marry You (Bruno Mars)
- All of Me (John Legend)

## Implementación

El componente está optimizado para dispositivos móviles con:
- Selector de opciones nativo para mejor experiencia táctil
- Botón de reproducción/pausa de tamaño adecuado para interacción táctil
- Visualización clara del estado de reproducción
- Interfaz simplificada para no sobrecargar pantallas pequeñas

## Consideraciones técnicas

- El componente utiliza el elemento de audio HTML5 para la reproducción
- Se implementa manejo adecuado de eventos de audio (reproducción, pausa, finalización)
- Se incluye manejo de errores para reproducción de audio

## Integración con otros componentes

Este control se utiliza principalmente en componentes de tipo `MUSIC_PLAYER` y cualquier otro que requiera añadir música de fondo a la invitación.
