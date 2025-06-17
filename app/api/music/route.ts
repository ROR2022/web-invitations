import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API endpoint para listar archivos de música disponibles
 * GET /api/music
 */
export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), 'public', 'music');
    
    // Verificar si el directorio existe
    if (!fs.existsSync(musicDir)) {
      return NextResponse.json(
        { error: 'El directorio de música no existe' },
        { status: 404 }
      );
    }
    
    // Leer archivos del directorio
    const files = fs.readdirSync(musicDir);
    
    // Filtrar solo archivos MP3
    const musicFiles = files
      .filter(file => file.toLowerCase().endsWith('.mp3'))
      .map(file => {
        const filePath = path.join(musicDir, file);
        const stats = fs.statSync(filePath);
        
        // Formatear el tamaño del archivo
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        return {
          name: file.replace('.mp3', ''),
          fileName: file,
          url: `/music/${file}`,
          size: `${fileSizeInMB} MB`,
          lastModified: stats.mtime.toISOString()
        };
      });
    
    return NextResponse.json({ music: musicFiles });
  } catch (error) {
    console.error('Error al listar archivos de música:', error);
    return NextResponse.json(
      { error: 'Error al obtener archivos de música' },
      { status: 500 }
    );
  }
}
