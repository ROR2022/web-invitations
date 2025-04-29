import { Theme } from './types';

/**
 * Temas predefinidos para las plantillas de invitaciones
 * Cada tema incluye paletas de colores y combinaciones de fuentes
 */

export const classicRoseTheme: Theme = {
  name: 'Rosa Clásico',
  colors: {
    primary: '#9a0045',
    secondary: '#c50057',
    accent: '#ff8fab',
    background: '#ffffff',
    text: '#333333',
    headings: '#9a0045'
  },
  fonts: {
    heading: 'Great Vibes',
    body: 'Playfair Display',
    accent: 'Montserrat'
  },
  spacing: {
    sections: 'normal'
  }
};

export const goldenGlamourTheme: Theme = {
  name: 'Glamour Dorado',
  colors: {
    primary: '#d4af37',
    secondary: '#f5cc7f',
    accent: '#b98c24',
    background: '#ffffff',
    text: '#444444',
    headings: '#b98c24'
  },
  fonts: {
    heading: 'Cinzel',
    body: 'Cormorant Garamond',
    accent: 'Montserrat'
  },
  spacing: {
    sections: 'spacious'
  }
};

export const oceanBreezeTheme: Theme = {
  name: 'Brisa Marina',
  colors: {
    primary: '#1a75bc',
    secondary: '#5aaddd',
    accent: '#0d3b5c',
    background: '#f9fcff',
    text: '#333333',
    headings: '#0d3b5c'
  },
  fonts: {
    heading: 'Dancing Script',
    body: 'Lato',
    accent: 'Roboto'
  },
  spacing: {
    sections: 'normal'
  }
};

export const rusticCharmTheme: Theme = {
  name: 'Encanto Rústico',
  colors: {
    primary: '#7d5a3c',
    secondary: '#b08968',
    accent: '#dcc9a6',
    background: '#f8f4e8',
    text: '#4b3621',
    headings: '#7d5a3c'
  },
  fonts: {
    heading: 'Amatic SC',
    body: 'Josefin Sans',
    accent: 'Roboto'
  },
  spacing: {
    sections: 'normal'
  }
};

export const modernMinimalTheme: Theme = {
  name: 'Minimalista Moderno',
  colors: {
    primary: '#333333',
    secondary: '#777777',
    accent: '#aaaaaa',
    background: '#ffffff',
    text: '#333333',
    headings: '#000000'
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Raleway',
    accent: 'Montserrat'
  },
  spacing: {
    sections: 'spacious'
  }
};

export const tropicalParadiseTheme: Theme = {
  name: 'Paraíso Tropical',
  colors: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#f59e0b',
    background: '#f0fdfa',
    text: '#334155',
    headings: '#047857'
  },
  fonts: {
    heading: 'Pacifico',
    body: 'Nunito',
    accent: 'Poppins'
  },
  spacing: {
    sections: 'normal'
  }
};

export const dreamyLavenderTheme: Theme = {
  name: 'Lavanda Soñadora',
  colors: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#c4b5fd',
    background: '#f5f3ff',
    text: '#4c1d95',
    headings: '#6d28d9'
  },
  fonts: {
    heading: 'Satisfy',
    body: 'Quicksand',
    accent: 'Montserrat'
  },
  spacing: {
    sections: 'normal'
  }
};

export const elegantBordeauxTheme: Theme = {
  name: 'Burdeos Elegante',
  colors: {
    primary: '#800020',
    secondary: '#a4262c',
    accent: '#d81e5b',
    background: '#ffffff',
    text: '#333333',
    headings: '#800020'
  },
  fonts: {
    heading: 'Cormorant Garamond',
    body: 'Libre Baskerville',
    accent: 'Montserrat'
  },
  spacing: {
    sections: 'spacious'
  }
};

// Tema por defecto para nuevas plantillas
export const defaultTheme: Theme = classicRoseTheme;

// Exportar todos los temas como un objeto para usar en el editor
export const predefinedThemes: Record<string, Theme> = {
  classicRose: classicRoseTheme,
  goldenGlamour: goldenGlamourTheme,
  oceanBreeze: oceanBreezeTheme,
  rusticCharm: rusticCharmTheme,
  modernMinimal: modernMinimalTheme,
  tropicalParadise: tropicalParadiseTheme,
  dreamyLavender: dreamyLavenderTheme,
  elegantBordeaux: elegantBordeauxTheme
};
