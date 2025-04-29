"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { TemplateConfig } from '@/components/template-editor/types';
import TemplateEditor from '@/components/template-editor/TemplateEditor';
import { defaultTheme } from '@/components/template-editor/themeSchemas';
//import { componentDefaultProps } from '@/components/template-editor/configurable/componentSchemas';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { generateCode } from '@/components/template-editor/codeGenerator';

/**
 * Página de administración para editar o crear una plantilla
 * Versión temporal para desarrollo, sin integración real con Supabase
 */
export default function TemplateEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Referencias para evitar ciclos de renderizado
  const idRef = useRef<string>(params.id);
  const isNewTemplateRef = useRef<boolean>(params.id === 'new');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null);
  
  // Cargar la configuración de la plantilla si existe (mock para desarrollo)
  useEffect(() => {
    // Esto solo debe ejecutarse una vez durante la carga inicial
    const loadTemplate = async () => {
      setLoading(true);
      
      try {
        // Simulación de carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Crear una nueva plantilla vacía para desarrollo
        const newConfig: TemplateConfig = {
          id: isNewTemplateRef.current ? uuidv4() : idRef.current,
          name: isNewTemplateRef.current ? 'Nueva Plantilla' : 'Plantilla Existente',
          description: 'Descripción de la plantilla para desarrollo',
          theme: { ...defaultTheme },
          components: []
        };
        
        setTemplateConfig(newConfig);
        
        // Si es una plantilla nueva, actualizar la URL sin recargar
        if (isNewTemplateRef.current) {
          const newUrl = `/admin/templates/editor/${newConfig.id}`;
          window.history.replaceState({}, '', newUrl);
          idRef.current = newConfig.id;
          isNewTemplateRef.current = false;
        }
      } catch (error) {
        console.error('Error al cargar la plantilla:', error);
        toast({
          title: "Error al cargar",
          description: "No se pudo cargar la configuración de la plantilla",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplate();
    // Including toast as dependency since it's used inside loadTemplate
  }, [toast]);
  
  // Guardar la plantilla (simulación para desarrollo)
  const handleSave = async (config: TemplateConfig) => {
    if (saving) return; // Prevenir guardados simultáneos
    
    setSaving(true);
    console.log('Guardando configuración de plantilla:', config);
    
    try {
      // Generar HTML, CSS y JS a partir de la configuración
      const { html, css, js } = generateCode(config);
      console.log('Código generado:', { html, css, js });
      
      // Simular guardado - Aquí se enviaría a Supabase en la versión final
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Plantilla guardada exitosamente');
      toast({
        title: "Guardado exitoso",
        description: "La plantilla y su código generado se han guardado correctamente",
      });
      
      // Actualizar el estado local con la configuración guardada
      setTemplateConfig(config);
    } catch (error) {
      console.error('Error al generar el código:', error);
      toast({
        title: "Error al guardar",
        description: "Hubo un problema al generar el código de la plantilla",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Volver a la lista de plantillas
  const handleBack = () => {
    router.push('/admin/templates');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }
  
  if (!templateConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Plantilla no encontrada</h1>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          onClick={handleBack}
        >
          Volver a la lista
        </button>
      </div>
    );
  }
  
  return (
    <TemplateEditor
      initialConfig={templateConfig}
      templateId={idRef.current}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
}
