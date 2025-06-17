"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleDashed, ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import TemplateEditor from '@/components/template-editor/TemplateEditor';
import { getInvitationById, updateInvitation } from '@/services/invitation.client';
import { Invitation } from '@/types/invitation';

export default function EditInvitationPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const params = useParams();
  
  // Cargar la invitación
  useEffect(() => {
    async function loadInvitation() {
      if (!params.id || !isAuthenticated) return;
      
      try {
        setLoading(true);
        const result = await getInvitationById(params.id as string);
        if (result) {
          setInvitation(result);
        } else {
          setError('No se pudo encontrar la invitación');
        }
      } catch (err: any) {
        console.error('Error loading invitation:', err);
        setError(err.message || 'Error al cargar la invitación');
      } finally {
        setLoading(false);
      }
    }
    
    if (isAuthenticated) {
      loadInvitation();
    }
  }, [params.id, isAuthenticated]);
  
  // Guardar los cambios en la invitación
  const handleSave = async (updatedConfig: any) => {
    if (!invitation || !isAuthenticated) return;
    
    try {
      setSaving(true);
      
      // Crear objeto de actualización
      const updates = {
        config: updatedConfig
      };
      
      // Llamar al servicio de actualización
      const result = await updateInvitation(params.id as string, updates);
      
      if (result) {
        // Actualizar el estado local con la invitación actualizada
        setInvitation(result);
        
        toast({
          title: "Cambios guardados",
          description: "Tu invitación se ha actualizado correctamente.",
        });
      } else {
        throw new Error('No se pudo actualizar la invitación');
      }
    } catch (err: any) {
      console.error('Error saving invitation:', err);
      
      toast({
        title: "Error al guardar",
        description: err.message || 'Ocurrió un error al guardar los cambios',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Si está cargando, mostrar indicador
  if (userLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <CircleDashed className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando invitación...</p>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated && !userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-lg mx-auto">
          <AlertTitle>Acceso restringido</AlertTitle>
          <AlertDescription>
            Debes iniciar sesión para editar invitaciones.
          </AlertDescription>
          <div className="mt-4">
            <Button asChild>
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }
  
  // Si hay un error, mostrarlo
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/invitaciones">Volver a mis invitaciones</Link>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }
  
  // Si no hay invitación, mostrar mensaje
  if (!invitation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-lg mx-auto">
          <AlertTitle>Invitación no encontrada</AlertTitle>
          <AlertDescription>
            La invitación que buscas no existe o no tienes permiso para editarla.
          </AlertDescription>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/invitaciones">Volver a mis invitaciones</Link>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/invitaciones">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold truncate">
            Editar: {invitation.config.title || 'Invitación sin título'}
          </h1>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Vista previa</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          {invitation && (
            <TemplateEditor 
              invitation={invitation}
              onSave={handleSave}
              isSaving={saving}
            />
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <div className="border rounded-lg overflow-hidden h-[800px]">
            <iframe 
              src={`/api/preview/${invitation.id}`}
              className="w-full h-full border-0"
              title="Vista previa de la invitación"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="bg-muted p-8 rounded-lg text-center">
            <p className="text-muted-foreground">
              La configuración avanzada estará disponible próximamente.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 