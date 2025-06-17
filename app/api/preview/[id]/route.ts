import { NextRequest, NextResponse } from 'next/server';
import { getInvitationById } from '@/services/invitation.service';
import { generateCode } from '@/components/template-editor/codeGenerator';
import { TemplateConfig } from '@/components/template-editor/types';
import { cookies } from 'next/headers';

/**
 * API para previsualizar una invitación sin publicarla
 * GET /api/preview/[id]
 */
export async function GET(
  request: NextRequest
) {
  try {
    const params = request.nextUrl.searchParams;
    
    // Verificar autenticación básica de cookies (implemente según su sistema)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    // En lugar de session?.user.id, pasamos null y verificamos autorización después
    let userId: string | undefined = undefined;
    
    // Si no hay cookie de sesión, verificar si es un preview seguro
    if (!sessionToken) {
      const authHeader = request.headers.get('Authorization');
      const previewToken = request.nextUrl.searchParams.get('token');
      
      // Si no hay token de preview ni header de autorización, devolver error
      if (!previewToken && !authHeader) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }
      
      // TODO: Implementar validación de tokens de preview
    }
    
    // Obtener la invitación
    const invitationId = params.get('id') || '';
    const { data: invitation, error } = await getInvitationById(invitationId, userId);
    
    if (error || !invitation) {
      return NextResponse.json(
        { error: error || 'Invitación no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario sea propietario o token válido (simplificado)
    if (sessionToken && userId && invitation.userId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para ver esta invitación' },
        { status: 403 }
      );
    }
    
    // Crear una configuración para el generador de código
    const templateConfig: TemplateConfig = {
      id: invitation.id,
      name: invitation.config.title || 'Invitación',
      components: [], // Esto se llenaría dinámicamente con los componentes de la invitación
      theme: {
        name: invitation.config.title,
        colors: {
          primary: invitation.config.theme?.primaryColor || '#9333ea',
          secondary: invitation.config.theme?.secondaryColor || '#6b21a8',
          background: '#ffffff',
          text: '#333333',
          accent: '#ffd700',
        },
        fonts: {
          heading: invitation.config.theme?.fontFamily || 'Playfair Display',
          body: 'Montserrat',
          accent: 'Dancing Script',
        }
      }
    };
    
    // Check if the config has any extended editor configuration
    if ((invitation.config as any).editorConfig) {
      // Use type assertion to access the property
      const editorConfig = (invitation.config as any).editorConfig;
      if (editorConfig) {
        Object.assign(templateConfig, editorConfig);
      }
    }
    
    // Generar el código
    const code = generateCode(templateConfig);
    
    // Construir HTML completo - usamos regex simples para evitar flags incompatibles
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${templateConfig.name}</title>
        <style>${code.css}</style>
      </head>
      <body>
        ${code.html
          .replace('<!DOCTYPE html>', '')
          .replace(/<html[^>]*>/, '')
          .replace(/<head>.*<\/head>/, '')
          .replace(/<body>/, '')
          .replace('</body></html>', '')
        }
        <script>${code.js}</script>
      </body>
      </html>
    `;
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('Error in invitation preview API:', error);
    return NextResponse.json(
      { error: error.message || 'Error al generar la previsualización' },
      { status: 500 }
    );
  }
} 