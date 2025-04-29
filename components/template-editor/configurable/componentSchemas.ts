import { ComponentConfig, ComponentProperty, ComponentType, PropertyType } from '../types';

/**
 * Definición de esquemas para cada tipo de componente configurable
 * Estos esquemas servirán como base para el editor visual
 */

// Propiedades configurables del Hero
export const heroSchema: Record<string, ComponentProperty> = {
  backgroundImage: {
    type: PropertyType.IMAGE,
    label: 'Imagen de fondo',
    description: 'Imagen de fondo para la sección principal',
    required: true,
    default: '/images/quince1.jpeg',
    group: 'Apariencia'
  },
  backgroundOverlay: {
    type: PropertyType.COLOR,
    label: 'Superposición',
    description: 'Color de superposición sobre la imagen de fondo',
    default: 'rgba(0,0,0,0.3)',
    group: 'Apariencia'
  },
  title: {
    type: PropertyType.STRING,
    label: 'Título',
    description: 'Título principal',
    default: 'Mis XV Años',
    required: true,
    group: 'Contenido'
  },
  subtitle: {
    type: PropertyType.STRING,
    label: 'Subtítulo',
    description: 'Texto secundario',
    default: 'Te invito a celebrar conmigo',
    group: 'Contenido'
  },
  name: {
    type: PropertyType.STRING,
    label: 'Nombre',
    description: 'Nombre de la persona celebrada',
    default: 'Ana Sofía',
    required: true,
    group: 'Contenido'
  },
  titleFont: {
    type: PropertyType.FONT,
    label: 'Fuente del título',
    description: 'Tipo de letra para el título',
    default: 'Great Vibes',
    group: 'Apariencia'
  },
  subtitleFont: {
    type: PropertyType.FONT,
    label: 'Fuente del subtítulo',
    description: 'Tipo de letra para el subtítulo',
    default: 'Playfair Display',
    group: 'Apariencia'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color del texto',
    description: 'Color para todos los textos',
    default: '#ffffff',
    group: 'Apariencia'
  },
  height: {
    type: PropertyType.ENUM,
    label: 'Altura',
    description: 'Altura de la sección',
    options: [
      { value: 'fullscreen', label: 'Pantalla completa' },
      { value: 'large', label: 'Grande' },
      { value: 'medium', label: 'Mediana' },
      { value: 'small', label: 'Pequeña' }
    ],
    default: 'fullscreen',
    group: 'Apariencia'
  },
  animation: {
    type: PropertyType.ENUM,
    label: 'Animación',
    description: 'Tipo de animación para la entrada',
    options: [
      { value: 'fade', label: 'Desvanecimiento' },
      { value: 'slide', label: 'Deslizamiento' },
      { value: 'zoom', label: 'Zoom' },
      { value: 'none', label: 'Ninguna' }
    ],
    default: 'fade',
    group: 'Apariencia'
  }
};

// Propiedades configurables del Countdown
export const countdownSchema: Record<string, ComponentProperty> = {
  eventDate: {
    type: PropertyType.DATE,
    label: 'Fecha del evento',
    description: 'Fecha hacia la que se contará',
    required: true,
    default: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#ffffff'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color del texto',
    description: 'Color para el texto del contador',
    default: '#333333'
  },
  accentColor: {
    type: PropertyType.COLOR,
    label: 'Color de acento',
    description: 'Color para destacar los números',
    default: '#9a0045'
  },
  showLabels: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar etiquetas',
    description: 'Mostrar texto para días, horas, etc',
    default: true
  },
  showTitle: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar título',
    description: 'Mostrar título en la sección',
    default: true
  },
  title: {
    type: PropertyType.STRING,
    label: 'Título',
    description: 'Título de la sección',
    default: 'Faltan'
  },
  style: {
    type: PropertyType.ENUM,
    label: 'Estilo',
    description: 'Estilo visual del contador',
    options: [
      { value: 'standard', label: 'Estándar' },
      { value: 'boxed', label: 'Con recuadros' },
      { value: 'circular', label: 'Circular' },
      { value: 'minimal', label: 'Minimalista' }
    ],
    default: 'boxed'
  }
};

// Propiedades configurables del EventDetails
export const eventDetailsSchema: Record<string, ComponentProperty> = {
  title: {
    type: PropertyType.STRING,
    label: 'Título',
    description: 'Título de la sección',
    default: 'Evento'
  },
  ceremonyTitle: {
    type: PropertyType.STRING,
    label: 'Título ceremonia',
    description: 'Título para la ceremonia',
    default: 'Misa de acción de gracias'
  },
  ceremonyLocation: {
    type: PropertyType.LOCATION,
    label: 'Lugar de ceremonia',
    description: 'Ubicación de la ceremonia',
    default: {
      address: 'Catedral Metropolitana, Ciudad de México',
      lat: 19.4336164,
      lng: -99.1330971,
      placeId: 'ChIJR8NqxVb_0YURkQ-EHczPPgQ'
    }
  },
  ceremonyTime: {
    type: PropertyType.STRING,
    label: 'Hora de ceremonia',
    description: 'Hora de inicio de la ceremonia',
    default: '17:00'
  },
  ceremonyDate: {
    type: PropertyType.STRING,
    label: 'Fecha de ceremonia',
    description: 'Fecha de la ceremonia',
    default: 'Sábado 15 de Abril, 2025'
  },
  receptionTitle: {
    type: PropertyType.STRING,
    label: 'Título recepción',
    description: 'Título para la recepción',
    default: 'Recepción'
  },
  receptionLocation: {
    type: PropertyType.LOCATION,
    label: 'Lugar de recepción',
    description: 'Ubicación de la recepción',
    default: {
      address: 'Salón Jardín Los Pinos, Ciudad de México',
      lat: 19.4115496,
      lng: -99.1894898,
      placeId: 'ChIJUQ6JNPn90YURYZmj-fMk7Kk'
    }
  },
  receptionTime: {
    type: PropertyType.STRING,
    label: 'Hora de recepción',
    description: 'Hora de inicio de la recepción',
    default: '19:00'
  },
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#f8f9fa'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color del texto',
    description: 'Color para el texto de la sección',
    default: '#333333'
  },
  accentColor: {
    type: PropertyType.COLOR,
    label: 'Color de acento',
    description: 'Color para destacar elementos',
    default: '#9a0045'
  },
  showMap: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar mapa',
    description: 'Mostrar mapa de ubicación',
    default: true
  }
};

// Propiedades configurables de la Gallery
export const gallerySchema: Record<string, ComponentProperty> = {
  title: {
    type: PropertyType.STRING,
    label: 'Título',
    description: 'Título de la sección de galería',
    default: 'Galería',
    group: 'basic'
  },
  description: {
    type: PropertyType.STRING,
    label: 'Descripción',
    description: 'Texto descriptivo de la galería',
    default: 'Recuerdos para compartir',
    group: 'basic'
  },
  layout: {
    type: PropertyType.ENUM,
    label: 'Diseño',
    description: 'Tipo de diseño para mostrar las imágenes',
    options: [
      { value: 'grid', label: 'Cuadrícula' },
      { value: 'masonry', label: 'Mosaico' },
      { value: 'carousel', label: 'Carrusel' },
      { value: 'slideshow', label: 'Presentación' }
    ],
    default: 'grid',
    group: 'layout'
  },
  numberOfImages: {
    type: PropertyType.NUMBER,
    label: 'Número de imágenes',
    description: 'Cantidad de imágenes a mostrar',
    default: 6,
    min: 1,
    max: 12,
    group: 'layout'
  },
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#ffffff',
    group: 'appearance'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color del texto',
    description: 'Color para los textos',
    default: '#333333',
    group: 'appearance'
  },
  showCaptions: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar leyendas',
    description: 'Mostrar pie de foto en las imágenes',
    default: false,
    group: 'content'
  },
  enableLightbox: {
    type: PropertyType.BOOLEAN,
    label: 'Habilitar lightbox',
    description: 'Permite ver las imágenes ampliadas al hacer clic',
    default: true,
    group: 'interaction'
  },
  imageStyle: {
    type: PropertyType.ENUM,
    label: 'Estilo de imagen',
    description: 'Forma y estilo de las imágenes',
    options: [
      { value: 'square', label: 'Cuadrado' },
      { value: 'rounded', label: 'Bordes redondeados' },
      { value: 'circle', label: 'Circular' },
      { value: 'polaroid', label: 'Polaroid' }
    ],
    default: 'rounded',
    group: 'appearance'
  },
  // Campos para imágenes individuales
  image1: {
    type: PropertyType.IMAGE,
    label: 'Imagen 1',
    description: 'Primera imagen de la galería',
    default: '/images/gallery/sample1.jpg',
    aspectRatio: 4/3,
    group: 'images'
  },
  image2: {
    type: PropertyType.IMAGE,
    label: 'Imagen 2',
    description: 'Segunda imagen de la galería',
    default: '/images/gallery/sample2.jpg',
    aspectRatio: 4/3,
    group: 'images'
  },
  image3: {
    type: PropertyType.IMAGE,
    label: 'Imagen 3',
    description: 'Tercera imagen de la galería',
    default: '/images/gallery/sample3.jpg',
    aspectRatio: 4/3,
    group: 'images'
  },
  image4: {
    type: PropertyType.IMAGE,
    label: 'Imagen 4',
    description: 'Cuarta imagen de la galería',
    default: '/images/gallery/sample4.jpg',
    aspectRatio: 4/3,
    group: 'images'
  },
  image5: {
    type: PropertyType.IMAGE,
    label: 'Imagen 5',
    description: 'Quinta imagen de la galería',
    default: '/images/gallery/sample5.jpg',
    aspectRatio: 4/3,
    group: 'images'
  },
  image6: {
    type: PropertyType.IMAGE,
    label: 'Imagen 6',
    description: 'Sexta imagen de la galería',
    default: '/images/gallery/sample6.jpg',
    aspectRatio: 4/3,
    group: 'images'
  },
  caption1: {
    type: PropertyType.STRING,
    label: 'Leyenda 1',
    description: 'Descripción para imagen 1',
    default: '',
    group: 'captions'
  },
  caption2: {
    type: PropertyType.STRING,
    label: 'Leyenda 2',
    description: 'Descripción para imagen 2',
    default: '',
    group: 'captions'
  },
  caption3: {
    type: PropertyType.STRING,
    label: 'Leyenda 3',
    description: 'Descripción para imagen 3',
    default: '',
    group: 'captions'
  },
  caption4: {
    type: PropertyType.STRING,
    label: 'Leyenda 4',
    description: 'Descripción para imagen 4',
    default: '',
    group: 'captions'
  },
  caption5: {
    type: PropertyType.STRING,
    label: 'Leyenda 5',
    description: 'Descripción para imagen 5',
    default: '',
    group: 'captions'
  },
  caption6: {
    type: PropertyType.STRING,
    label: 'Leyenda 6',
    description: 'Descripción para imagen 6',
    default: '',
    group: 'captions'
  }
};

// Propiedades configurables del Attendance
export const attendanceSchema: Record<string, ComponentProperty> = {
  title: {
    type: PropertyType.STRING,
    label: 'Título',
    description: 'Título de la sección',
    default: 'Confirmación'
  },
  description: {
    type: PropertyType.STRING,
    label: 'Descripción',
    description: 'Texto descriptivo',
    default: 'Por favor confirma tu asistencia antes del 1 de abril',
    multiline: true
  },
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#f8f9fa'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color del texto',
    description: 'Color para el texto de la sección',
    default: '#333333'
  },
  buttonColor: {
    type: PropertyType.COLOR,
    label: 'Color de botón',
    description: 'Color para el botón de enviar',
    default: '#9a0045'
  },
  buttonTextColor: {
    type: PropertyType.COLOR,
    label: 'Color texto botón',
    description: 'Color para el texto del botón',
    default: '#ffffff'
  },
  showAdditionalGuests: {
    type: PropertyType.BOOLEAN,
    label: 'Permitir invitados',
    description: 'Permitir añadir invitados adicionales',
    default: true
  },
  maxAdditionalGuests: {
    type: PropertyType.NUMBER,
    label: 'Máximo invitados',
    description: 'Número máximo de invitados adicionales',
    default: 2,
    min: 0,
    max: 10
  },
  showDietaryRestrictions: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar restricciones',
    description: 'Incluir campo para restricciones dietéticas',
    default: true
  },
  confirmationDeadline: {
    type: PropertyType.DATE,
    label: 'Fecha límite',
    description: 'Fecha límite para confirmar asistencia',
    default: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  }
};

// Propiedades configurables del GiftOptions
export const giftOptionsSchema: Record<string, ComponentProperty> = {
  title: {
    type: PropertyType.STRING,
    label: 'Título',
    description: 'Título de la sección',
    default: 'Mesa de Regalos'
  },
  description: {
    type: PropertyType.STRING,
    label: 'Descripción',
    description: 'Texto descriptivo',
    default: 'Tu presencia es el mejor regalo, pero si deseas obsequiarme algo, aquí hay algunas opciones:',
    multiline: true
  },
  showCashOption: {
    type: PropertyType.BOOLEAN,
    label: 'Opción en efectivo',
    description: 'Mostrar opción para regalo en efectivo',
    default: true
  },
  cashDescription: {
    type: PropertyType.STRING,
    label: 'Descripción efectivo',
    description: 'Texto para opción de regalo en efectivo',
    default: 'Si prefieres regalar un sobre/lluvia de sobres, será muy apreciado en mi día especial.',
    multiline: true
  },
  showGiftRegistries: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar registros',
    description: 'Mostrar registros de tiendas',
    default: true
  },
  registries: {
    type: PropertyType.ARRAY,
    label: 'Registros',
    description: 'Tiendas con mesa de regalos',
    default: ['liverpool', 'amazon']
  },
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#ffffff'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color del texto',
    description: 'Color para el texto de la sección',
    default: '#333333'
  },
  iconColor: {
    type: PropertyType.COLOR,
    label: 'Color de iconos',
    description: 'Color para los iconos',
    default: '#9a0045'
  }
};

// Propiedades configurables del MusicPlayer
export const musicPlayerSchema: Record<string, ComponentProperty> = {
  audioUrl: {
    type: PropertyType.STRING,
    label: 'URL de audio',
    description: 'URL del archivo de audio',
    default: 'https://example.com/music.mp3'
  },
  autoplay: {
    type: PropertyType.BOOLEAN,
    label: 'Reproducción auto',
    description: 'Iniciar reproducción automáticamente',
    default: false
  },
  loop: {
    type: PropertyType.BOOLEAN,
    label: 'Reproducir en bucle',
    description: 'Repetir audio constantemente',
    default: true
  },
  showControls: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar controles',
    description: 'Mostrar botones de control',
    default: true
  },
  buttonStyle: {
    type: PropertyType.ENUM,
    label: 'Estilo de botón',
    description: 'Apariencia del botón de reproducción',
    options: [
      { value: 'minimal', label: 'Minimalista' },
      { value: 'rounded', label: 'Redondeado' },
      { value: 'square', label: 'Cuadrado' }
    ],
    default: 'rounded'
  },
  buttonPosition: {
    type: PropertyType.ENUM,
    label: 'Posición del botón',
    description: 'Ubicación del botón en la pantalla',
    options: [
      { value: 'topRight', label: 'Superior derecha' },
      { value: 'topLeft', label: 'Superior izquierda' },
      { value: 'bottomRight', label: 'Inferior derecha' },
      { value: 'bottomLeft', label: 'Inferior izquierda' },
      { value: 'floating', label: 'Flotante lateral' }
    ],
    default: 'topRight'
  },
  buttonColor: {
    type: PropertyType.COLOR,
    label: 'Color del botón',
    description: 'Color de fondo del botón',
    default: '#9a0045'
  },
  iconColor: {
    type: PropertyType.COLOR,
    label: 'Color del icono',
    description: 'Color del icono de reproducción',
    default: '#ffffff'
  }
};

// Propiedades configurables del ThankYou
export const thankYouSchema: Record<string, ComponentProperty> = {
  title: {
    type: PropertyType.STRING,
    label: 'Título',
    description: 'Título de la sección',
    default: '¡Gracias!'
  },
  message: {
    type: PropertyType.STRING,
    label: 'Mensaje',
    description: 'Texto de agradecimiento',
    default: 'Gracias por ser parte de este día tan especial para mí. Espero contar con tu presencia.',
    multiline: true
  },
  backgroundImage: {
    type: PropertyType.IMAGE,
    label: 'Imagen de fondo',
    description: 'Imagen de fondo opcional',
    default: ''
  },
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#f8f9fa'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color del texto',
    description: 'Color para el texto de la sección',
    default: '#333333'
  },
  showSignature: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar firma',
    description: 'Mostrar nombre como firma',
    default: true
  },
  signature: {
    type: PropertyType.STRING,
    label: 'Firma',
    description: 'Texto para la firma',
    default: 'Ana Sofía'
  },
  signatureFont: {
    type: PropertyType.STRING,
    label: 'Fuente firma',
    description: 'Fuente para el texto de firma',
    default: 'Great Vibes'
  }
};

// Propiedades por defecto para inicializar componentes
export const componentDefaultProps: Record<ComponentType, Record<string, any>> = {
  hero: {
    backgroundImage: '/images/quince1.jpeg',
    backgroundOverlay: 'rgba(0,0,0,0.3)',
    title: 'Mis XV Años',
    subtitle: 'Te invito a celebrar conmigo',
    name: 'Ana Sofía',
    titleFont: 'Great Vibes',
    subtitleFont: 'Playfair Display',
    textColor: '#ffffff',
    height: 'fullscreen',
    animation: 'fade'
  },
  countdown: {
    eventDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#9a0045',
    showLabels: true,
    showTitle: true,
    title: 'Faltan',
    style: 'boxed'
  },
  eventDetails: {
    title: 'Evento',
    ceremonyTitle: 'Misa de acción de gracias',
    ceremonyLocation: {
      address: 'Catedral Metropolitana, Ciudad de México',
      lat: 19.4336164,
      lng: -99.1330971
    },
    ceremonyTime: '17:00',
    ceremonyDate: 'Sábado 15 de Abril, 2025',
    receptionTitle: 'Recepción',
    receptionLocation: {
      address: 'Salón Jardín Los Pinos, Ciudad de México',
      lat: 19.4115496,
      lng: -99.1894898
    },
    receptionTime: '19:00',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    accentColor: '#9a0045',
    showMap: true
  },
  gallery: {
    title: 'Galería',
    description: 'Recuerdos para compartir',
    layout: 'grid',
    numberOfImages: 6,
    backgroundColor: '#ffffff',
    textColor: '#333333',
    showCaptions: false,
    enableLightbox: true,
    imageStyle: 'rounded',
    image1: '/images/gallery/sample1.jpg',
    image2: '/images/gallery/sample2.jpg',
    image3: '/images/gallery/sample3.jpg',
    image4: '/images/gallery/sample4.jpg',
    image5: '/images/gallery/sample5.jpg',
    image6: '/images/gallery/sample6.jpg',
    caption1: '',
    caption2: '',
    caption3: '',
    caption4: '',
    caption5: '',
    caption6: ''
  },
  attendance: {
    title: 'Confirmación',
    description: 'Por favor confirma tu asistencia antes del 1 de abril',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    buttonColor: '#9a0045',
    buttonTextColor: '#ffffff',
    showAdditionalGuests: true,
    maxAdditionalGuests: 2,
    showDietaryRestrictions: true,
    confirmationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  giftOptions: {
    title: 'Mesa de Regalos',
    description: 'Tu presencia es el mejor regalo, pero si deseas obsequiarme algo, aquí hay algunas opciones:',
    showCashOption: true,
    cashDescription: 'Si prefieres regalar un sobre/lluvia de sobres, será muy apreciado en mi día especial.',
    showGiftRegistries: true,
    registries: ['liverpool', 'amazon'],
    backgroundColor: '#ffffff',
    textColor: '#333333',
    iconColor: '#9a0045'
  },
  musicPlayer: {
    audioUrl: 'https://example.com/music.mp3',
    autoplay: false,
    loop: true,
    showControls: true,
    buttonStyle: 'rounded',
    buttonPosition: 'topRight',
    buttonColor: '#9a0045',
    iconColor: '#ffffff'
  },
  thankYou: {
    title: '¡Gracias!',
    message: 'Gracias por ser parte de este día tan especial para mí. Espero contar con tu presencia.',
    backgroundImage: '',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    showSignature: true,
    signature: 'Ana Sofía',
    signatureFont: 'Great Vibes'
  }
};

// Exportar todos los esquemas como un objeto
export const componentSchemas: Record<ComponentType, ComponentConfig> = {
  hero: {
    id: 'hero',
    type: 'hero',
    name: 'Portada',
    description: 'Sección principal con imagen de fondo y título',
    icon: 'crown',
    order: 1,
    visible: true,
    properties: heroSchema
  },
  countdown: {
    id: 'countdown',
    type: 'countdown',
    name: 'Cuenta regresiva',
    description: 'Contador hacia la fecha del evento',
    icon: 'clock',
    order: 2,
    visible: true,
    properties: countdownSchema
  },
  eventDetails: {
    id: 'eventDetails',
    type: 'eventDetails',
    name: 'Detalles del evento',
    description: 'Información sobre lugar y hora',
    icon: 'map-pin',
    order: 3,
    visible: true,
    properties: eventDetailsSchema
  },
  gallery: {
    id: 'gallery',
    type: 'gallery',
    name: 'Galería',
    description: 'Galería de imágenes',
    icon: 'image',
    order: 4,
    visible: true,
    properties: gallerySchema
  },
  attendance: {
    id: 'attendance',
    type: 'attendance',
    name: 'Confirmación',
    description: 'Formulario para confirmar asistencia',
    icon: 'check-circle',
    order: 5,
    visible: true,
    properties: attendanceSchema
  },
  giftOptions: {
    id: 'giftOptions',
    type: 'giftOptions',
    name: 'Regalos',
    description: 'Información sobre regalos o mesa de regalos',
    icon: 'gift',
    order: 6,
    visible: true,
    properties: giftOptionsSchema
  },
  musicPlayer: {
    id: 'musicPlayer',
    type: 'musicPlayer',
    name: 'Reproductor de música',
    description: 'Reproductor de música de fondo',
    icon: 'music',
    order: 7,
    visible: true,
    properties: musicPlayerSchema
  },
  thankYou: {
    id: 'thankYou',
    type: 'thankYou',
    name: 'Agradecimiento',
    description: 'Mensaje de agradecimiento',
    icon: 'heart',
    order: 8,
    visible: true,
    properties: thankYouSchema
  }
};

// Exportar todos los esquemas como un array
export const componentSchemaArray: ComponentConfig[] = [
  componentSchemas.hero,
  componentSchemas.countdown,
  componentSchemas.eventDetails,
  componentSchemas.gallery,
  componentSchemas.attendance,
  componentSchemas.giftOptions,
  componentSchemas.musicPlayer,
  componentSchemas.thankYou
];
