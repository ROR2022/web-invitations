import { TemplateConfig, ComponentConfig, ComponentType } from './types';

/**
 * Genera el código HTML basado en la configuración de la plantilla
 */
export function generateHTML(config: TemplateConfig): string {
  const sortedComponents = [...config.components]
    .filter(comp => comp.visible)
    .sort((a, b) => a.order - b.order);
  
  const componentsHTML = sortedComponents.map(component => {
    return generateComponentHTML(component, config);
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.name}</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${config.theme.fonts?.heading?.replace(' ', '+') || 'Playfair+Display'}&family=${config.theme.fonts?.body?.replace(' ', '+') || 'Montserrat'}&display=swap" rel="stylesheet">
</head>
<body>
  <div class="invitation-container">
    ${componentsHTML}
  </div>
  <script src="script.js"></script>
</body>
</html>`;
}

/**
 * Genera el código CSS basado en la configuración de la plantilla
 */
export function generateCSS(config: TemplateConfig): string {
  // Variables CSS para el tema
  const themeCSS = `
:root {
  --color-primary: ${config.theme.colors.primary};
  --color-secondary: ${config.theme.colors.secondary};
  --color-background: ${config.theme.colors.background};
  --color-text: ${config.theme.colors.text};
  --color-accent: ${config.theme.colors.accent || '#FFD700'};
  --font-heading: '${config.theme.fonts?.heading || 'Playfair Display'}', serif;
  --font-body: '${config.theme.fonts?.body || 'Montserrat'}', sans-serif;
  --font-accent: '${config.theme.fonts?.accent || 'Dancing Script'}', cursive;
}`;

  // Estilos base
  const baseCSS = `
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

.invitation-container {
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin-top: 0;
}

p {
  margin-bottom: 1rem;
}

img {
  max-width: 100%;
  height: auto;
}

.section {
  padding: 3rem 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .section {
    padding: 2rem 1rem;
  }
}

.button {
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-family: var(--font-body);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: var(--color-secondary);
}`;
  
  // Estilos para componentes específicos
  const componentsCSS = config.components
    .filter(comp => comp.visible)
    .map(component => {
      return generateComponentCSS(component, config);
    }).join('\n');
  
  return `${themeCSS}\n${baseCSS}\n${componentsCSS}`;
}

/**
 * Genera el código JavaScript basado en la configuración de la plantilla
 */
export function generateJS(config: TemplateConfig): string {
  // Código base
  const baseJS = `
document.addEventListener('DOMContentLoaded', function() {
  console.log('Invitation loaded: ${config.name}');
  
  // Inicializar componentes
  initializeComponents();
});

function initializeComponents() {`;

  // Código específico para cada componente
  const componentsJS = config.components
    .filter(comp => comp.visible)
    .map(component => {
      return generateComponentJS(component, config);
    }).join('\n');
  
  // Funciones utilitarias
  const utilJS = `
}

// Función para formatear fechas
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para calcular tiempo restante
function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date().toString());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}`;
  
  return `${baseJS}\n${componentsJS}\n${utilJS}`;
}

/**
 * Genera el HTML específico para un componente
 */
function generateComponentHTML(component: ComponentConfig, config: TemplateConfig): string {
  const id = `component-${component.id}`;
  
  switch (component.type) {
    case 'hero':
      return `
  <section id="${id}" class="section hero-section">
    <div class="hero-content">
      <h1>${component.properties.title || 'Título Principal'}</h1>
      <p class="subtitle">${component.properties.subtitle || 'Subtítulo'}</p>
    </div>
  </section>`;
      
    case 'countdown':
      return `
  <section id="${id}" class="section countdown-section">
    <h2>${component.properties.title || 'Cuenta Regresiva'}</h2>
    <div class="countdown-container">
      <div class="countdown-unit">
        <span id="countdown-days">--</span>
        <span class="countdown-label">Días</span>
      </div>
      <div class="countdown-unit">
        <span id="countdown-hours">--</span>
        <span class="countdown-label">Horas</span>
      </div>
      <div class="countdown-unit">
        <span id="countdown-minutes">--</span>
        <span class="countdown-label">Minutos</span>
      </div>
      <div class="countdown-unit">
        <span id="countdown-seconds">--</span>
        <span class="countdown-label">Segundos</span>
      </div>
    </div>
  </section>`;
      
    case 'eventDetails':
      return `
  <section id="${id}" class="section event-details-section">
    <h2>${component.properties.title || 'Detalles del Evento'}</h2>
    <div class="event-details-container">
      <div class="event-detail">
        <div class="event-icon">📅</div>
        <div class="event-info">
          <h3>Fecha</h3>
          <p>${component.properties.date || 'Fecha por definir'}</p>
        </div>
      </div>
      <div class="event-detail">
        <div class="event-icon">🕒</div>
        <div class="event-info">
          <h3>Hora</h3>
          <p>${component.properties.time || 'Hora por definir'}</p>
        </div>
      </div>
      <div class="event-detail">
        <div class="event-icon">📍</div>
        <div class="event-info">
          <h3>Lugar</h3>
          <p>${component.properties.location || 'Lugar por definir'}</p>
        </div>
      </div>
    </div>
    ${component.properties.showMap ? `<div class="map-container">
      <iframe
        width="100%"
        height="300"
        frameborder="0"
        src="https://maps.google.com/maps?q=${encodeURIComponent((component.properties.location as unknown) as string || '')}&output=embed"
        allowfullscreen
      ></iframe>
    </div>` : ''}
  </section>`;
      
    case 'gallery':
      const galleryItems = Array.isArray(component.properties.images) 
        ? component.properties.images.map((img: any, index: number) => 
            `<div class="gallery-item"><img src="${img.url}" alt="Imagen ${index + 1}"></div>`
          ).join('\n      ')
        : '<div class="gallery-item"><img src="https://via.placeholder.com/400x300" alt="Imagen de ejemplo"></div>';
        
      return `
  <section id="${id}" class="section gallery-section">
    <h2>${component.properties.title || 'Galería'}</h2>
    <div class="gallery-container">
      ${galleryItems}
    </div>
  </section>`;
      
    case 'attendance':
      return `
  <section id="${id}" class="section attendance-section">
    <h2>${component.properties.title || 'Confirma tu Asistencia'}</h2>
    <p>${component.properties.description || 'Por favor confirma tu asistencia antes de la fecha indicada.'}</p>
    <form id="attendance-form" class="attendance-form">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="guests">Número de invitados</label>
        <input type="number" id="guests" name="guests" min="1" max="10" value="1">
      </div>
      <div class="form-group">
        <label>¿Asistirás?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="attending" value="yes" checked> Sí, asistiré
          </label>
          <label>
            <input type="radio" name="attending" value="no"> No podré asistir
          </label>
        </div>
      </div>
      <button type="submit" class="button">Confirmar</button>
    </form>
  </section>`;
      
    case 'giftOptions':
      return `
  <section id="${id}" class="section gift-options-section">
    <h2>${component.properties.title || 'Mesa de Regalos'}</h2>
    <p>${component.properties.description || 'Si deseas hacernos un regalo, aquí tienes algunas opciones.'}</p>
    <div class="gift-options-container">
      ${component.properties.showCash ? `
      <div class="gift-option">
        <div class="gift-icon">💰</div>
        <h3>Efectivo</h3>
        <p>${component.properties.cashDescription || 'Una contribución en efectivo sería muy apreciada.'}</p>
      </div>` : ''}
      ${component.properties.showRegistry ? `
      <div class="gift-option">
        <div class="gift-icon">🎁</div>
        <h3>Mesa de Regalos</h3>
        <p>${component.properties.registryDescription || 'Hemos creado una mesa de regalos para tu conveniencia.'}</p>
        <a href="${component.properties.registryLink || '#'}" class="button" target="_blank">Ver Mesa de Regalos</a>
      </div>` : ''}
    </div>
  </section>`;
      
    case 'musicPlayer':
      // Asegurar que la URL del audio sea absoluta para que funcione correctamente
      const audioUrl = (component.properties.audioUrl as unknown) as string || '';
      const fullAudioUrl = audioUrl.startsWith('http') 
        ? audioUrl 
        : audioUrl.startsWith('/') 
          ? audioUrl 
          : `/music/${audioUrl}`;
          
      return `
  <section id="${id}" class="section music-player-section">
    <h2>${component.properties.title || 'Música'}</h2>
    <div class="music-player-container">
      <div class="music-controls">
        <button id="play-button" class="play-button">▶️</button>
        <div class="song-info">
          <p class="song-title">${component.properties.songTitle || 'Nuestra Canción'}</p>
          <p class="song-artist">${component.properties.songArtist || 'Artista'}</p>
        </div>
      </div>
      <audio id="background-music" loop>
        <source src="${fullAudioUrl}" type="audio/mp3">
        Tu navegador no soporta audio HTML5.
      </audio>
    </div>
  </section>`;
      
    case 'thankYou':
      return `
  <section id="${id}" class="section thank-you-section">
    <h2>${component.properties.title || 'Gracias'}</h2>
    <p>${component.properties.message || 'Gracias por ser parte de este momento tan especial para nosotros.'}</p>
    <div class="signature">${component.properties.signature || 'Con amor,'}</div>
  </section>`;
      
    default:
      return `<section id="${id}" class="section">Componente no reconocido</section>`;
  }
}

/**
 * Genera el CSS específico para un componente
 */
function generateComponentCSS(component: ComponentConfig, config: TemplateConfig): string {
  const id = `component-${component.id}`;
  
  switch (component.type) {
    case 'hero':
      return `
/* Hero Section */
.hero-section {
  background-image: url('${component.properties.backgroundImage || 'https://via.placeholder.com/1920x1080'}');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 800px;
  padding: 2rem;
}

.hero-section h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: white;
}

.hero-section .subtitle {
  font-size: 1.5rem;
  font-weight: 300;
}`;
      
    case 'countdown':
      return `
/* Countdown Section */
.countdown-section {
  text-align: center;
  padding: 4rem 1rem;
}

.countdown-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.countdown-unit {
  background-color: var(--color-primary);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 100px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.countdown-unit span {
  display: block;
}

#countdown-days, #countdown-hours, #countdown-minutes, #countdown-seconds {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.countdown-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}`;
      
    case 'gallery':
      return `
/* Gallery Section */
.gallery-section {
  padding: 4rem 1rem;
  text-align: center;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.gallery-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 0;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  position: relative;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.gallery-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox.active {
  display: flex;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  border: 3px solid white;
}

.lightbox-close {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
}

.lightbox-prev {
  left: 20px;
}

.lightbox-next {
  right: 20px;
}`;
      
    case 'musicPlayer':
      return `
/* Music Player Section */
.music-player-section {
  padding: 3rem 1rem;
  text-align: center;
}

.music-player-container {
  max-width: 500px;
  margin: 2rem auto 0;
  padding: 1.5rem;
  background-color: rgba(var(--color-primary-rgb), 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.music-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.play-button {
  background: var(--color-primary);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  flex-shrink: 0;
  font-size: 1.5rem;
}

.play-button:hover {
  background: var(--color-secondary);
  transform: scale(1.05);
}

.song-info {
  text-align: left;
  flex-grow: 1;
}

.song-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
  color: var(--color-primary);
}

.song-artist {
  margin: 0;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
}`;
      
    // Añadir casos para los demás componentes...
    
    default:
      return '';
  }
}

/**
 * Genera el JS específico para un componente
 */
function generateComponentJS(component: ComponentConfig, config: TemplateConfig): string {
  const id = `component-${component.id}`;
  
  switch (component.type) {
    case 'countdown':
      return `
  // Inicializar cuenta regresiva
  if (document.getElementById('${id}')) {
    const deadline = new Date('${component.properties.date || new Date().toISOString()}').getTime();
    
    const countdownInterval = setInterval(function() {
      const now = new Date().getTime();
      const t = getTimeRemaining(deadline);
      
      document.getElementById('countdown-days').innerHTML = t.days.toString();
      document.getElementById('countdown-hours').innerHTML = t.hours.toString();
      document.getElementById('countdown-minutes').innerHTML = t.minutes.toString();
      document.getElementById('countdown-seconds').innerHTML = t.seconds.toString();
      
      if (t.total <= 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown-days').innerHTML = '0';
        document.getElementById('countdown-hours').innerHTML = '0';
        document.getElementById('countdown-minutes').innerHTML = '0';
        document.getElementById('countdown-seconds').innerHTML = '0';
      }
    }, 1000);
  }`;
      
    case 'gallery':
      return `
  // Inicializar galería con lightbox
  if (document.getElementById('${id}')) {
    // Crear lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = \`
      <div class="lightbox-content">
        <img src="" alt="" class="lightbox-image">
        <div class="lightbox-close">&times;</div>
        <div class="lightbox-nav lightbox-prev">&#10094;</div>
        <div class="lightbox-nav lightbox-next">&#10095;</div>
      </div>
    \`;
    document.body.appendChild(lightbox);
    
    // Variables para el lightbox
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Obtener todas las imágenes de la galería
    const galleryItems = document.querySelectorAll('#${id} .gallery-item img');
    galleryItems.forEach((img, index) => {
      galleryImages.push({
        src: img.src,
        alt: img.alt
      });
      
      img.parentElement.addEventListener('click', function() {
        currentImageIndex = index;
        showLightbox(index);
      });
    });
    
    // Función para mostrar el lightbox
    function showLightbox(index) {
      if (galleryImages.length === 0) return;
      
      const image = galleryImages[index];
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add('active');
      
      // Deshabilitar scroll en el body
      document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar el lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // Función para ir a la imagen anterior
    function prevImage() {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      showLightbox(currentImageIndex);
    }
    
    // Función para ir a la imagen siguiente
    function nextImage() {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      showLightbox(currentImageIndex);
    }
    
    // Eventos para los controles del lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Cerrar lightbox con ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    });
    
    // Cerrar lightbox haciendo clic fuera de la imagen
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }`;
      
    case 'musicPlayer':
      return `
  // Inicializar reproductor de música
  const playButton = document.getElementById('play-button');
  const audio = document.getElementById('background-music');
  
  if (playButton && audio) {
    // Variable para controlar el estado
    let isPlaying = false;
    
    // Inicializar con el estado correcto
    updatePlayButtonIcon();
    
    // Manejar evento click
    playButton.addEventListener('click', function() {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            isPlaying = true;
          }).catch(err => {
            console.warn('Error al iniciar reproducción:', err);
          });
        }
      }
      updatePlayButtonIcon();
    });
    
    // Actualizar icono según estado
    function updatePlayButtonIcon() {
      playButton.innerHTML = isPlaying ? '⏸️' : '▶️';
    }
    
    // Manejar eventos de audio
    audio.addEventListener('ended', function() {
      isPlaying = false;
      updatePlayButtonIcon();
    });
    
    audio.addEventListener('pause', function() {
      isPlaying = false;
      updatePlayButtonIcon();
    });
    
    audio.addEventListener('play', function() {
      isPlaying = true;
      updatePlayButtonIcon();
    });
  }`;
      
    // Añadir casos para los demás componentes...
    
    default:
      return '';
  }
}

/**
 * Genera todo el código necesario para la plantilla
 */
export function generateCode(config: TemplateConfig): {
  html: string;
  css: string;
  js: string;
} {
  return {
    html: generateHTML(config),
    css: generateCSS(config),
    js: generateJS(config)
  };
}
