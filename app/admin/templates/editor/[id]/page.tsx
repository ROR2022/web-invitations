'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Invitation, InvitationStatus, PackageType, EventType } from '@/types/invitation';
import { TemplateConfig } from '@/components/template-editor/types';
import TemplateEditor from '@/components/template-editor/TemplateEditor';
import { defaultTheme } from '@/components/template-editor/themeSchemas';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { createClient } from '@/utils/supabase/client';
import * as templateApi from '@/services/api/templates';
import type { TemplateData } from '@/services/api/templates';

// Define el tipo para una plantilla en Supabase
interface TemplateDbData {
  id: string;
  name: string;
  description?: string | null;
  config: TemplateConfig | null;
  html_content?: string | null;
  css_content?: string | null;
  js_content?: string | null;
  event_type?: string | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
  thumbnail_url?: string | null;
  category?: string | null;
  status?: string | null;
  slug: string;
}

/**
 * Página de administración para editar o crear una plantilla
 * Integra con el servicio de Supabase para guardar plantillas con enfoque basado en configuración
 */
export default function TemplateEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useUser();
  
  // Estado de la página
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'error'>('loading');
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null);
  const [templateData, setTemplateData] = useState<TemplateDbData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // ¿Es una nueva plantilla?
  const isNewTemplate = params.id === 'new';
  
  // Manejador centralizado de errores
  const handleError = useCallback((error: any, title: string) => {
    console.warn(`${title}:`, error);
    
    const message = error?.message || 'Ha ocurrido un error inesperado';
    setErrorMessage(message);
    setStatus('error');
    
    toast({
      title,
      description: message,
      variant: 'destructive'
    });
  }, [toast]);
  
  // Cargar o crear plantilla al inicializar
  useEffect(() => {
    // No hacer nada si user está loading
    if (user === undefined) return;
    
    const initializeTemplate = async () => {
      try {
        setStatus('loading');
        const supabase = createClient();
        
        if (isNewTemplate) {
          // Crear nueva plantilla temporal usando la API directamente
          if (!user?.id) {
            throw new Error('Debes iniciar sesión para crear plantillas');
          }
          
          // Crear una plantilla temporal
          const tempTemplate = {
            id: crypto.randomUUID(),
            name: 'Nueva Plantilla',
            description: 'Descripción de la plantilla',
            slug: `nueva-plantilla-${Date.now()}`,
            thumbnail_url: '/placeholder.svg',
            config: {
              id: crypto.randomUUID(),
              name: 'Nueva Plantilla',
              description: 'Descripción de la plantilla',
              theme: { ...defaultTheme },
              components: [],
              category: 'premium'
            },
            status: 'draft',
            is_active: true,
            event_type: 'generic',
            category: 'premium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data, error } = await supabase
            .from('templates')
            .insert([tempTemplate])
            .select('*')
            .single();
            
          if (error) {
            throw error;
          }
          
          // Actualizar URL sin recargar la página
          const newUrl = `/admin/templates/editor/${data.id}`;
          router.replace(newUrl, { scroll: false });
          
          // Actualizar estado
          setTemplateData(data);
          setTemplateConfig(data.config);
          setStatus('ready');
        } else {
          // Cargar plantilla existente
          const { data, error } = await supabase
            .from('templates')
            .select('*')
            .eq('id', params.id)
            .single();
          
          if (error) {
            console.warn('Error al cargar plantilla:', error);
            
            // Si la plantilla no existe, redirigir a la lista
            if (error.code === 'PGRST116' || error.message?.includes('no rows')) {
              toast({
                title: 'Plantilla no encontrada',
                description: 'La plantilla que intentas editar no existe o ha sido eliminada',
                variant: 'destructive'
              });
              
              // Redirigir tras un breve retraso
              setTimeout(() => {
                router.push('/admin/templates');
              }, 1500);
              
              throw new Error('Plantilla no encontrada');
            }
            
            throw error;
          }
          
          // Verificar formato antiguo (migración pendiente)
          if (!data.config && (data.html_content || data.css_content || data.js_content)) {
            toast({
              title: 'Formato antiguo detectado',
              description: 'Esta plantilla está en formato antiguo y debe ser migrada',
              variant: 'destructive'
            });
            
            router.push(`/admin/templates/migration?id=${params.id}`);
            throw new Error('Formato de plantilla antiguo detectado');
          }
          
          // Manejar plantilla sin configuración
          if (!data.config) {
            // Crear una configuración básica
            data.config = {
              id: data.id, // Usar el mismo ID que la plantilla
              name: data.name || 'Plantilla sin nombre',
              description: data.description || '',
              theme: { ...defaultTheme },
              components: [],
              category: data.category || 'premium'
            };
            
            // Actualizar la plantilla con la nueva configuración
            await supabase
              .from('templates')
              .update({ config: data.config })
              .eq('id', params.id);
          }
          
          // Actualizar estado
          setTemplateData(data);
          setTemplateConfig(data.config);
          setStatus('ready');
        }
      } catch (error) {
        handleError(error, 'Error al inicializar la plantilla');
      }
    };
    
    initializeTemplate();
  }, [params.id, user, router, toast, handleError, isNewTemplate]);
  
  // Guardar la plantilla
  const handleSave = async (config: TemplateConfig) => {
    try {
      if (status === 'saving') return;
      
      setStatus('saving');
      const supabase = createClient();
      
      // Asegurarse de que los datos de la plantilla existen
      if (!templateData) {
        throw new Error('No hay datos de plantilla disponibles para guardar');
      }
      
      // Preparar datos para actualización
      const updateData = {
        name: config.name,
        description: config.description || '',
        config: config,
        status: 'published', // Marcar como publicada al guardar
        category: config.category || 'premium',
        event_type: config.eventType || 'otro',
        updated_at: new Date().toISOString()
      };
      
      // Actualizar la plantilla
      const { data, error } = await supabase
        .from('templates')
        .update(updateData)
        .eq('id', templateData.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Actualizar estado local
      setTemplateData(data);
      setTemplateConfig(config);
      
      toast({
        title: 'Guardado exitoso',
        description: 'La plantilla se ha guardado correctamente'
      });
      
      setStatus('ready');
    } catch (error) {
      handleError(error, 'Error al guardar la plantilla');
    }
  };
  
  // Volver a la lista de plantillas
  const handleBack = () => {
    router.push('/admin/templates');
  };
  
  // Renderizado basado en el estado actual
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Cargando plantilla...</span>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4 max-w-md text-center">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{errorMessage || 'Ha ocurrido un error al cargar la plantilla'}</p>
        </div>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          onClick={handleBack}
        >
          Volver a la lista de plantillas
        </button>
      </div>
    );
  }
  
  if (!templateConfig || !templateData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Plantilla no disponible</h1>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          onClick={handleBack}
        >
          Volver a la lista
        </button>
      </div>
    );
  }
  
  // Crear un objeto invitation para pasarlo al TemplateEditor
  const mockInvitation: Invitation = {
    id: templateData.id,
    status: InvitationStatus.DRAFT,
    createdAt: templateData.created_at || new Date().toISOString(),
    updatedAt: templateData.updated_at || new Date().toISOString(),
    userId: '',
    packageType: PackageType.BASIC,
    // Crear un objeto InvitationConfig con los datos mínimos necesarios
    config: {
      title: templateData.name || 'Plantilla',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '12:00',
      location: 'Ubicación del evento',
      eventType: EventType.OTHER,
      hostNames: ['Anfitrión'],
      rsvpEnabled: false,
      templateId: templateData.id,
      // Colores y fuente por defecto para la invitación
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#f43f5e',
        fontFamily: 'Inter'
      },
      components: {
        countdown: true,
        map: true,
        gallery: false,
        music: false,
        gifts: false,
        itinerary: false,
        accommodation: false
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editor de Plantilla</h1>
        <Button variant="outline" onClick={handleBack}>Volver</Button>
      </div>
      
      <TemplateEditor
        invitation={mockInvitation}
        onSave={handleSave}
        isSaving={status === 'saving'}
      />
    </div>
  );
}
