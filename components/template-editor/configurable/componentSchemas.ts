import { 
  ComponentConfig, 
  ComponentProperty, 
  ComponentType, 
  PropertyType, 
  TextProperty, 
  NumberProperty, 
  BooleanProperty, 
  ColorProperty, 
  ImageProperty, 
  FontProperty, 
  DateProperty, 
  SelectProperty, 
  MusicSelectorProperty, 
  FontSelectorProperty,
  ArrayProperty
} from '../types';

/**
 * Definición de esquemas para cada tipo de componente configurable
 * Estos esquemas servirán como base para el editor visual
 */

// Función utilitaria para obtener la fecha predeterminada de forma consistente
function getDefaultDate() {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 34);
  return defaultDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

// Propiedades configurables del Hero
export const heroSchema: Record<string, ComponentProperty> = {
  backgroundImages: {
    type: PropertyType.ARRAY,
    itemType: 'image',
    label: 'Imágenes de fondo',
    description: 'Imágenes para el carrusel de fondo',
    required: true,
    default: ['/images/quince1.jpeg'],
    group: 'Apariencia'
  } as ArrayProperty,
  useCarousel: {
    type: PropertyType.BOOLEAN,
    label: 'Usar carrusel',
    description: 'Mostrar las imágenes en un carrusel',
    default: true,
    group: 'Apariencia'
  },
  carouselInterval: {
    type: PropertyType.NUMBER,
    label: 'Intervalo (ms)',
    description: 'Tiempo entre cambios de imagen (milisegundos)',
    default: 5000,
    min: 1000,
    max: 15000,
    step: 1000,
    group: 'Apariencia'
  },
  carouselEffect: {
    type: PropertyType.ENUM,
    label: 'Efecto del carrusel',
    description: 'Efecto de transición entre imágenes',
    options: [
      { value: 'fade', label: 'Desvanecer' },
      { value: 'slide', label: 'Deslizar' }
    ],
    default: 'fade',
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
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente del título',
    description: 'Tipo de letra para el título',
    default: 'Great Vibes',
    group: 'Apariencia'
  },
  subtitleFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente del subtítulo',
    description: 'Tipo de letra para el subtítulo',
    default: 'Playfair Display',
    group: 'Apariencia'
  },
  nameFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente del nombre',
    description: 'Tipo de letra para el nombre de la persona celebrada',
    default: 'Great Vibes',
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
    default: getDefaultDate()
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
      locationUrl: 'https://goo.gl/maps/example-ceremony',
      buttonText: 'Ver mapa de la ceremonia'
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
      locationUrl: 'https://goo.gl/maps/example-reception',
      buttonText: 'Ver mapa de la recepción'
    }
  },
  receptionTime: {
    type: PropertyType.STRING,
    label: 'Hora de recepción',
    description: 'Hora de inicio de la recepción',
    default: '19:00'
  },
  receptionDate: {
    type: PropertyType.STRING,
    label: 'Fecha de recepción',
    description: 'Fecha de la recepción',
    default: 'Sábado 15 de Abril, 2025'
  },
  // Propiedades de fuentes
  sectionTitleFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente del título',
    description: 'Tipo de letra para el título de la sección',
    default: 'Playfair Display',
    group: 'Apariencia'
  },
  eventTitleFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de eventos',
    description: 'Tipo de letra para los títulos de ceremonia y recepción',
    default: 'Montserrat',
    group: 'Apariencia'
  },
  detailsFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de detalles',
    description: 'Tipo de letra para los textos de información',
    default: 'Open Sans',
    group: 'Apariencia'
  },
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#f8f9fa'
  },
  useTexture: {
    type: PropertyType.BOOLEAN,
    label: 'Usar textura',
    description: 'Usar un patrón de textura para el fondo',
    default: false,
    category: 'Apariencia'
  },
  texturePattern: {
    type: PropertyType.IMAGE,
    label: 'Patrón de textura',
    description: 'Imagen para la textura de fondo',
    default: '',
    category: 'Apariencia'
  },
  textureOpacity: {
    type: PropertyType.NUMBER,
    label: 'Opacidad de textura',
    description: 'Intensidad de la textura (0-1)',
    default: 0.3,
    min: 0,
    max: 1,
    step: 0.1,
    category: 'Apariencia'
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
  dressCode: {
    type: PropertyType.STRING,
    label: 'Código de vestimenta',
    description: 'Código de vestimenta para el evento (ej: Formal, Semi-formal, Casual)',
    default: 'Formal',
    category: 'Contenido'
  },
  dressCodeDetails: {
    type: PropertyType.STRING,
    label: 'Detalles del código',
    description: 'Información adicional sobre el código de vestimenta (restricciones, sugerencias, etc.)',
    default: 'El color blanco es exclusivo de la novia. Se solicita a los caballeros usar traje.',
    multiline: true,
    category: 'Contenido'
  } as TextProperty,
  buttonColor: {
    type: PropertyType.COLOR,
    label: 'Color de botones',
    description: 'Color de fondo para los botones de ubicación',
    default: '#4F46E5',
    category: 'Apariencia'
  },
  buttonTextColor: {
    type: PropertyType.COLOR,
    label: 'Color texto botones',
    description: 'Color del texto para los botones de ubicación',
    default: '#ffffff',
    category: 'Apariencia'
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
  } as TextProperty,
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
  } as TextProperty,
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
  } as TextProperty,
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
    type: PropertyType.MUSIC_SELECTOR,
    label: 'Seleccionar canción',
    description: 'Selecciona un archivo de música para tu invitación',
    default: '',
    group: 'Contenido'
  },
  autoplay: {
    type: PropertyType.BOOLEAN,
    label: 'Reproducción auto',
    description: 'Iniciar reproducción automáticamente',
    default: false,
    group: 'Básicas'
  },
  loop: {
    type: PropertyType.BOOLEAN,
    label: 'Reproducir en bucle',
    description: 'Repetir audio constantemente',
    default: true,
    group: 'Básicas'
  },
  showControls: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar controles',
    description: 'Mostrar botones de control',
    default: true,
    group: 'Básicas'
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
    default: 'rounded',
    group: 'Apariencia'
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
  } as TextProperty,
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

// Propiedades configurables del Invitation
export const invitationSchema: Record<string, ComponentProperty> = {
  introText: {
    type: PropertyType.STRING,
    label: 'Texto de introducción',
    description: 'Primera línea de texto de la invitación',
    default: 'Acompáñanos a celebrar',
    category: 'Contenido'
  },
  mainEventText: {
    type: PropertyType.STRING,
    label: 'Texto principal',
    description: 'Texto destacado con el evento principal',
    default: 'Mis XV años',
    category: 'Contenido'
  },
  formalText: {
    type: PropertyType.STRING,
    label: 'Texto formal',
    description: 'Texto adicional (bendición, formalidad)',
    default: 'con la bendición de Dios\ny mis padres:',
    category: 'Contenido'
  },
  
  // Fuentes de texto
  introTextFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de introducción',
    description: 'Tipo de letra para el texto de introducción',
    default: 'Playfair Display',
    category: 'Fuentes'
  },
  mainEventTextFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de texto principal',
    description: 'Tipo de letra para el texto principal del evento',
    default: 'Great Vibes',
    category: 'Fuentes'
  },
  formalTextFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de texto formal',
    description: 'Tipo de letra para el texto formal/adicional',
    default: 'Playfair Display',
    category: 'Fuentes'
  },
  hostNamesFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de anfitriones',
    description: 'Tipo de letra para los nombres de anfitriones',
    default: 'Montserrat',
    category: 'Fuentes'
  },
  
  // Información de anfitriones
  showHosts: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar anfitriones',
    description: 'Mostrar sección de anfitriones/padres',
    default: true,
    category: 'Anfitriones'
  },
  hostType: {
    type: PropertyType.ENUM,
    label: 'Tipo de anfitriones',
    description: 'Tipo de relación entre los anfitriones',
    default: 'parents',
    options: [
      { label: 'Padres', value: 'parents' },
      { label: 'Pareja', value: 'couple' },
      { label: 'Individual', value: 'individual' }
    ],
    category: 'Anfitriones'
  },
  host1FirstName: {
    type: PropertyType.STRING,
    label: 'Nombre anfitrión 1',
    description: 'Nombre del primer anfitrión/padre',
    default: 'JOEL ALFONSO',
    category: 'Anfitriones'
  },
  host1LastName: {
    type: PropertyType.STRING,
    label: 'Apellido anfitrión 1',
    description: 'Apellido del primer anfitrión/padre',
    default: 'CANTÚ SARABIA',
    category: 'Anfitriones'
  },
  host2FirstName: {
    type: PropertyType.STRING,
    label: 'Nombre anfitrión 2',
    description: 'Nombre del segundo anfitrión/padre',
    default: 'MARIANA',
    category: 'Anfitriones'
  },
  host2LastName: {
    type: PropertyType.STRING,
    label: 'Apellido anfitrión 2',
    description: 'Apellido del segundo anfitrión/padre',
    default: 'TORRES MARTÍNEZ',
    category: 'Anfitriones'
  },
  separatorText: {
    type: PropertyType.STRING,
    label: 'Texto separador',
    description: 'Texto que separa a los anfitriones',
    default: '&',
    category: 'Anfitriones'
  },
  
  // Información de padrinos
  showPadrinos: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar padrinos',
    description: 'Mostrar sección de padrinos',
    default: false,
    category: 'Padrinos'
  },
  padrinosTitle: {
    type: PropertyType.STRING,
    label: 'Título de padrinos',
    description: 'Texto introductorio para la sección de padrinos',
    default: 'Con la bendición de nuestros padrinos',
    category: 'Padrinos'
  },
  numPadrinos: {
    type: PropertyType.ENUM,
    label: 'Cantidad de padrinos',
    description: 'Número de padrinos a mostrar',
    default: 'one',
    options: [
      { label: 'Un padrino/madrina', value: 'one' },
      { label: 'Dos padrinos', value: 'two' }
    ],
    category: 'Padrinos'
  },
  padrino1FirstName: {
    type: PropertyType.STRING,
    label: 'Nombre padrino 1',
    description: 'Nombre del primer padrino',
    default: 'FAMILIA',
    category: 'Padrinos'
  },
  padrino1LastName: {
    type: PropertyType.STRING,
    label: 'Apellido padrino 1',
    description: 'Apellido del primer padrino',
    default: 'HERNÁNDEZ GONZÁLEZ',
    category: 'Padrinos'
  },
  padrino1Role: {
    type: PropertyType.STRING,
    label: 'Rol padrino 1',
    description: 'Rol o función del primer padrino',
    default: 'Padrinos de Velación',
    category: 'Padrinos'
  },
  padrino2FirstName: {
    type: PropertyType.STRING,
    label: 'Nombre padrino 2',
    description: 'Nombre del segundo padrino',
    default: 'FAMILIA',
    category: 'Padrinos'
  },
  padrino2LastName: {
    type: PropertyType.STRING,
    label: 'Apellido padrino 2',
    description: 'Apellido del segundo padrino',
    default: 'MARTÍNEZ LÓPEZ',
    category: 'Padrinos'
  },
  padrino2Role: {
    type: PropertyType.STRING,
    label: 'Rol padrino 2',
    description: 'Rol o función del segundo padrino',
    default: 'Padrinos de Arras',
    category: 'Padrinos'
  },
  padrinosFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de padrinos',
    description: 'Tipo de letra para los nombres de padrinos',
    default: 'Montserrat',
    category: 'Fuentes'
  },
  
  // Estilos visuales
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#ffffff',
    category: 'Apariencia'
  },
  useTexture: {
    type: PropertyType.BOOLEAN,
    label: 'Usar textura',
    description: 'Usar un patrón de textura para el fondo',
    default: false,
    category: 'Apariencia'
  },
  texturePattern: {
    type: PropertyType.IMAGE,
    label: 'Patrón de textura',
    description: 'Imagen para la textura de fondo',
    default: '',
    category: 'Apariencia'
  },
  textureOpacity: {
    type: PropertyType.NUMBER,
    label: 'Opacidad de textura',
    description: 'Intensidad de la textura (0-1)',
    default: 0.3,
    min: 0,
    max: 1,
    step: 0.1,
    category: 'Apariencia'
  },
  mainTextColor: {
    type: PropertyType.COLOR,
    label: 'Color de texto',
    description: 'Color para el texto principal',
    default: '#333333',
    category: 'Apariencia'
  },
  accentTextColor: {
    type: PropertyType.COLOR,
    label: 'Color de acento',
    description: 'Color para textos destacados',
    default: '#9a0045',
    category: 'Apariencia'
  },
  decorativeIcon: {
    type: PropertyType.ENUM,
    label: 'Ícono decorativo',
    description: 'Ícono para separador decorativo',
    default: 'heart',
    options: [
      { label: 'Corazón', value: 'heart' },
      { label: 'Flor', value: 'flower' },
      { label: 'Estrella', value: 'star' },
      { label: 'Ninguno', value: 'none' }
    ],
    category: 'Apariencia'
  },
  showAnimation: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar animación',
    description: 'Animar entrada del componente',
    default: true,
    category: 'Apariencia'
  },
  
  // Elementos opcionales
  showImage: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar imagen',
    description: 'Mostrar imagen de homenajeado/pareja',
    default: false,
    category: 'Elementos adicionales'
  },
  imageUrl: {
    type: PropertyType.IMAGE,
    label: 'Imagen',
    description: 'Imagen del homenajeado o pareja',
    default: '',
    category: 'Elementos adicionales',
    aspectRatio: 1
  }
};

// Propiedades configurables del Couple (Nosotros)
export const coupleSchema: Record<string, ComponentProperty> = {
  // Contenido general
  sectionTitle: {
    type: PropertyType.STRING,
    label: 'Título de la sección',
    description: 'Título principal (ej: "Nosotros", "Los Novios")',
    default: 'Nosotros',
    category: 'Contenido'
  },
  
  // Información del primer cónyuge
  person1Name: {
    type: PropertyType.STRING,
    label: 'Nombre persona 1',
    description: 'Nombre completo del primer cónyuge',
    default: 'Ana María',
    category: 'Persona 1'
  },
  person1Image: {
    type: PropertyType.IMAGE,
    label: 'Foto persona 1',
    description: 'Fotografía del primer cónyuge',
    default: '/images/novia1.jpeg',
    aspectRatio: 1,
    category: 'Persona 1'
  },
  person1Description: {
    type: PropertyType.STRING,
    label: 'Descripción persona 1',
    description: 'Breve descripción o biografía',
    default: 'Amante de los viajes, la fotografía y las mañanas con café. Mi sonrisa es mi mayor virtud.',
    multiline: true,
    category: 'Persona 1'
  } as TextProperty,
  
  // Información del segundo cónyuge
  person2Name: {
    type: PropertyType.STRING,
    label: 'Nombre persona 2',
    description: 'Nombre completo del segundo cónyuge',
    default: 'Carlos Eduardo',
    category: 'Persona 2'
  },
  person2Image: {
    type: PropertyType.IMAGE,
    label: 'Foto persona 2',
    description: 'Fotografía del segundo cónyuge',
    default: '/images/novio1.jpeg',
    aspectRatio: 1,
    category: 'Persona 2'
  },
  person2Description: {
    type: PropertyType.STRING,
    label: 'Descripción persona 2',
    description: 'Breve descripción o biografía',
    default: 'Apasionado por la tecnología, la música y las tardes de cine. Mi sentido del humor me define.',
    multiline: true,
    category: 'Persona 2'
  } as TextProperty,
  
  // Historia común (opcional)
  showStory: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar historia',
    description: 'Mostrar sección de historia compartida',
    default: true,
    category: 'Historia'
  },
  storyTitle: {
    type: PropertyType.STRING,
    label: 'Título historia',
    description: 'Título para la sección de historia compartida',
    default: 'Nuestra Historia',
    category: 'Historia'
  },
  storyText: {
    type: PropertyType.STRING,
    label: 'Texto de historia',
    description: 'Breve relato de la historia de la pareja',
    default: 'Nos conocimos hace 5 años en una tarde de otoño. Desde entonces, cada día ha sido una aventura juntos. Hemos compartido risas, sueños y la certeza de que queremos construir un futuro donde nuestros caminos sigan unidos para siempre.',
    multiline: true,
    category: 'Historia'
  } as TextProperty,
  
  // Estilos visuales
  backgroundColor: {
    type: PropertyType.COLOR,
    label: 'Color de fondo',
    description: 'Color de fondo para esta sección',
    default: '#ffffff',
    category: 'Apariencia'
  },
  useTexture: {
    type: PropertyType.BOOLEAN,
    label: 'Usar textura',
    description: 'Usar un patrón de textura para el fondo',
    default: false,
    category: 'Apariencia'
  },
  texturePattern: {
    type: PropertyType.IMAGE,
    label: 'Patrón de textura',
    description: 'Imagen para la textura de fondo',
    default: '',
    category: 'Apariencia'
  },
  textureOpacity: {
    type: PropertyType.NUMBER,
    label: 'Opacidad de textura',
    description: 'Intensidad de la textura (0-1)',
    default: 0.3,
    min: 0,
    max: 1,
    step: 0.1,
    category: 'Apariencia'
  },
  textColor: {
    type: PropertyType.COLOR,
    label: 'Color de texto',
    description: 'Color para el texto principal',
    default: '#333333',
    category: 'Apariencia'
  },
  accentColor: {
    type: PropertyType.COLOR,
    label: 'Color de acento',
    description: 'Color para destacar nombres y títulos',
    default: '#9a0045',
    category: 'Apariencia'
  },
  decorativeIcon: {
    type: PropertyType.ENUM,
    label: 'Ícono decorativo',
    description: 'Ícono para separadores decorativos',
    default: 'heart',
    options: [
      { label: 'Corazón', value: 'heart' },
      { label: 'Flor', value: 'flower' },
      { label: 'Estrella', value: 'star' },
      { label: 'Anillos', value: 'rings' },
      { label: 'Ninguno', value: 'none' }
    ],
    category: 'Apariencia'
  },
  
  // Fuentes
  titleFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de título',
    description: 'Tipo de letra para el título de la sección',
    default: 'Playfair Display',
    category: 'Fuentes'
  },
  namesFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de nombres',
    description: 'Tipo de letra para los nombres de la pareja',
    default: 'Great Vibes',
    category: 'Fuentes'
  },
  textFont: {
    type: PropertyType.FONT_SELECTOR,
    label: 'Fuente de texto',
    description: 'Tipo de letra para las descripciones y la historia',
    default: 'Open Sans',
    category: 'Fuentes'
  },
  
  // Animación
  showAnimation: {
    type: PropertyType.BOOLEAN,
    label: 'Mostrar animación',
    description: 'Animar entrada de los elementos',
    default: true,
    category: 'Apariencia'
  }
};

// Propiedades por defecto para inicializar componentes
export const componentDefaultProps: Record<ComponentType, Record<string, any>> = {
  hero: {
    backgroundImages: ['/images/quince1.jpeg', '/images/quince2.jpeg'],
    useCarousel: true,
    carouselInterval: 5000,
    carouselEffect: 'fade',
    backgroundOverlay: 'rgba(0,0,0,0.4)',
    title: 'Nuestra Boda',
    subtitle: 'Te invitamos a celebrar',
    name: 'Ana & Juan',
    titleFont: 'Great Vibes',
    subtitleFont: 'Playfair Display',
    nameFont: 'Great Vibes',
    textColor: '#ffffff',
    height: 'fullscreen',
    animation: 'fade'
  },
  countdown: (() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 34);
    const defaultEventDate = defaultDate.toISOString().split('T')[0];
    console.log('Creating countdown default props with eventDate:', defaultEventDate);
    
    return {
      eventDate: defaultEventDate,
      backgroundColor: '#ffffff',
      textColor: '#333333',
      accentColor: '#9a0045',
      showLabels: true,
      showTitle: true,
      title: 'Faltan',
      style: 'boxed'
    };
  })(),
  eventDetails: {
    title: 'Evento',
    ceremonyTitle: 'Misa de acción de gracias',
    ceremonyLocation: {
      address: 'Catedral Metropolitana, Ciudad de México',
      locationUrl: 'https://goo.gl/maps/example-ceremony',
      buttonText: 'Ver mapa de la ceremonia'
    },
    ceremonyTime: '17:00',
    ceremonyDate: 'Sábado 12 de Julio, 2025',
    receptionTitle: 'Recepción',
    receptionLocation: {
      address: 'Salón Jardín Los Pinos, Ciudad de México',
      locationUrl: 'https://goo.gl/maps/example-reception',
      buttonText: 'Ver mapa de la recepción'
    },
    receptionTime: '19:00',
    receptionDate: 'Sábado 12 de Julio, 2025',
    sectionTitleFont: 'Playfair Display',
    eventTitleFont: 'Montserrat',
    detailsFont: 'Open Sans',
    backgroundColor: '#f8f9fa',
    useTexture: false,
    texturePattern: '',
    textureOpacity: 0.3,
    textColor: '#333333',
    accentColor: '#9a0045',
    dressCode: 'Formal',
    dressCodeDetails: 'El color blanco es exclusivo de la novia. Se solicita a los caballeros usar traje.',
    buttonColor: '#4F46E5',
    buttonTextColor: '#ffffff'
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
    image1: '/images/quince1.jpeg',
    image2: '/images/quince2.jpeg',
    image3: '/images/quince3.jpeg',
    image4: '/images/quince4.jpeg',
    image5: '/images/quince1.jpeg',
    image6: '/images/quince2.jpeg',
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
    audioUrl: '',
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
  },
  invitation: {
    introText: 'Acompáñanos a celebrar',
    mainEventText: 'Mis XV años',
    formalText: 'con la bendición de Dios\ny mis padres:',
    introTextFont: 'Playfair Display',
    mainEventTextFont: 'Great Vibes',
    formalTextFont: 'Playfair Display',
    hostNamesFont: 'Montserrat',
    showHosts: true,
    hostType: 'parents',
    host1FirstName: 'JOEL ALFONSO',
    host1LastName: 'CANTÚ SARABIA',
    host2FirstName: 'MARIANA',
    host2LastName: 'TORRES MARTÍNEZ',
    separatorText: '&',
    showPadrinos: false,
    padrinosTitle: 'Con la bendición de nuestros padrinos',
    numPadrinos: 'one',
    padrino1FirstName: 'FAMILIA',
    padrino1LastName: 'HERNÁNDEZ GONZÁLEZ',
    padrino1Role: 'Padrinos de Velación',
    padrino2FirstName: 'FAMILIA',
    padrino2LastName: 'MARTÍNEZ LÓPEZ',
    padrino2Role: 'Padrinos de Arras',
    padrinosFont: 'Montserrat',
    backgroundColor: '#ffffff',
    useTexture: false,
    texturePattern: '',
    textureOpacity: 0.3,
    mainTextColor: '#333333',
    accentTextColor: '#9a0045',
    decorativeIcon: 'heart',
    showAnimation: true,
    showImage: false,
    imageUrl: ''
  },
  couple: {
    sectionTitle: 'Nosotros',
    person1Name: 'Ana María',
    person1Image: '/images/novio1.jpeg',
    person1Description: 'Amante de los viajes, la fotografía y las mañanas con café. Mi sonrisa es mi mayor virtud.',
    person2Name: 'Carlos Eduardo',
    person2Image: '/images/novia1.jpeg',
    person2Description: 'Apasionado por la tecnología, la música y las tardes de cine. Mi sentido del humor me define.',
    showStory: true,
    storyTitle: 'Nuestra Historia',
    storyText: 'Nos conocimos hace 5 años en una tarde de otoño. Desde entonces, cada día ha sido una aventura juntos. Hemos compartido risas, sueños y la certeza de que queremos construir un futuro donde nuestros caminos sigan unidos para siempre.',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#9a0045',
    decorativeIcon: 'heart',
    titleFont: 'Playfair Display',
    namesFont: 'Great Vibes',
    textFont: 'Open Sans',
    showAnimation: true,
    useTexture: false,
    texturePattern: '',
    textureOpacity: 0.3
  },
  itinerary: {
    title: 'Agenda del Evento',
    description: 'Cronograma de actividades',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#9a0045',
    showIcon: true,
    events: [
      {
        time: '16:00',
        title: 'Ceremonia Religiosa',
        description: 'Iglesia San José',
        icon: 'church'
      },
      {
        time: '18:00',
        title: 'Cóctel de bienvenida',
        description: 'Jardín principal',
        icon: 'glass-cheers'
      },
      {
        time: '19:30',
        title: 'Cena',
        description: 'Salón principal',
        icon: 'utensils'
      },
      {
        time: '21:00',
        title: 'Baile',
        description: 'Pista central',
        icon: 'music'
      }
    ]
  },
  accommodation: {
    title: 'Hospedaje',
    description: 'Opciones de alojamiento para invitados',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#9a0045',
    showMap: true,
    locations: [
      {
        name: 'Hotel Royal',
        description: 'Hotel oficial del evento con tarifa especial para invitados.',
        address: 'Av. Principal 123, Ciudad',
        mapUrl: 'https://maps.google.com',
        priceRange: '$$',
        contactInfo: 'Tel: 555-123-4567',
        website: 'www.hotelroyal.com',
        discount: 'Mencionar código BODA2023 para 15% de descuento'
      },
      {
        name: 'Suites Confort',
        description: 'Opción económica a 10 minutos del evento.',
        address: 'Calle Secundaria 456, Ciudad',
        mapUrl: 'https://maps.google.com',
        priceRange: '$',
        contactInfo: 'Tel: 555-765-4321',
        website: 'www.suitesconfort.com',
        discount: ''
      }
    ]
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
  },
  invitation: {
    id: 'invitation',
    type: 'invitation',
    name: 'Invitación',
    description: 'Sección de invitación',
    icon: 'envelope',
    order: 9,
    visible: true,
    properties: invitationSchema
  },
  couple: {
    id: 'couple',
    type: 'couple',
    name: 'Pareja',
    description: 'Información sobre los novios',
    icon: 'heart',
    order: 10,
    visible: true,
    properties: coupleSchema
  },
  itinerary: {
    id: 'itinerary',
    type: 'itinerary',
    name: 'Itinerario',
    description: 'Cronograma de actividades',
    icon: 'calendar',
    order: 11,
    visible: true,
    properties: {} // Placeholder - ideally would have an itinerarySchema
  },
  accommodation: {
    id: 'accommodation',
    type: 'accommodation',
    name: 'Hospedaje',
    description: 'Opciones de alojamiento para invitados',
    icon: 'home',
    order: 12,
    visible: true,
    properties: {} // Placeholder - ideally would have an accommodationSchema
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
  componentSchemas.thankYou,
  componentSchemas.invitation,
  componentSchemas.couple
];
