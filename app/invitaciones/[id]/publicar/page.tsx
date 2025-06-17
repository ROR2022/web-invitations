"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertTriangle, 
  ArrowLeft,
  Check,
  X,
  Calendar,
  MapPin,
  Users,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { getInvitationById, updateInvitation } from '@/services/invitation.client';
import { Invitation, InvitationStatus } from '@/types/invitation';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PublicarInvitacion() {
  const router = useRouter();
  const { user, loading: userLoading, isAuthenticated } = useUser();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const params = useParams();
  const invitationId = params.id as string;
  
  // Cargar detalles de la invitación
  useEffect(() => {
    async function loadInvitation() {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const data = await getInvitationById(invitationId);
        
        // Verificar que la invitación no esté archivada
        if (data.status === InvitationStatus.ARCHIVED) {
          setError("No se puede publicar una invitación archivada");
          return;
        }
        
        // Verificar que no esté ya publicada
        if (data.status === InvitationStatus.PUBLISHED) {
          setError("Esta invitación ya está publicada");
          return;
        }
        
        setInvitation(data);

        // Generar URL pública si no existe
        if (!data.publicUrl) {
          // Generar un slug en base al título (o un UUID si no hay título)
          const baseSlug = data.config.title 
            ? data.config.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            : uuidv4().substr(0, 8);
          
          // Añadir un identificador único corto para evitar colisiones
          const uniqueId = Math.random().toString(36).substr(2, 4);
          const newPublicUrl = `${baseSlug}-${uniqueId}`;
          
          setPublicUrl(newPublicUrl);
        } else {
          setPublicUrl(data.publicUrl);
        }
        
        // Validar la invitación para publicación
        validateInvitation(data);
        
        setError(null);
      } catch (err: any) {
        console.error('Error loading invitation:', err);
        setError(err.message || 'No se pudo cargar la invitación');
      } finally {
        setLoading(false);
      }
    }

    loadInvitation();
  }, [invitationId, isAuthenticated]);

  // Validar que la invitación tenga la información mínima requerida
  const validateInvitation = (invitation: Invitation) => {
    const errors = [];
    
    if (!invitation.config.title || invitation.config.title.trim() === '') {
      errors.push("La invitación debe tener un título");
    }
    
    if (!invitation.config.eventDate || invitation.config.eventDate.trim() === '') {
      errors.push("Debes configurar la fecha del evento");
    }
    
    if (!invitation.config.location || invitation.config.location.trim() === '') {
      errors.push("Debes configurar la ubicación del evento");
    }
    
    if (!invitation.config.hostNames || invitation.config.hostNames.length === 0) {
      errors.push("Debes incluir al menos un anfitrión");
    }
    
    setValidationErrors(errors);
  };

  // Función para publicar la invitación
  const handlePublish = async () => {
    if (!invitation) return;
    
    // Verificar que no haya errores de validación
    if (validationErrors.length > 0) {
      toast({
        title: "No se puede publicar",
        description: "Por favor corrige los errores antes de publicar la invitación",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setPublishing(true);
      
      const now = new Date().toISOString();
      
      const updated = await updateInvitation(invitation.id, {
        status: InvitationStatus.PUBLISHED,
        publishedAt: now,
        publicUrl: publicUrl
      });
      
      setInvitation(updated);
      
      toast({
        title: "¡Invitación publicada!",
        description: "Tu invitación ahora está disponible públicamente."
      });
      
      // Redirigir a la página de detalles después de unos segundos
      setTimeout(() => {
        router.push(`/invitaciones/${params.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Error publishing invitation:', err);
      toast({
        title: "Error al publicar",
        description: err.message || "No se pudo publicar la invitación",
        variant: "destructive"
      });
    } finally {
      setPublishing(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-8 mr-2" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>Debes iniciar sesión para publicar la invitación</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
            <p className="mb-4">
              Por favor inicia sesión o regístrate para acceder a esta página.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/sign-in">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Registrarse</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No se pudo cargar la invitación</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
            <p className="mb-4">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href={`/invitaciones/${params.id}`}>Volver a Detalles</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Invitación no encontrada</CardTitle>
            <CardDescription>No se pudo encontrar la invitación solicitada</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
            <p className="mb-4">
              La invitación que buscas no existe o no tienes permisos para verla.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/invitaciones">Volver a Mis Invitaciones</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button asChild variant="ghost" className="mr-2 p-2">
            <Link href={`/invitaciones/${params.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Publicar Invitación</h1>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revisión de la invitación */}
        <Card>
          <CardHeader>
            <CardTitle>Revisión final</CardTitle>
            <CardDescription>
              Verifica que toda la información sea correcta antes de publicar tu invitación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Información del evento</h3>
              <dl className="space-y-2">
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-muted-foreground">Título:</div>
                  <div className="flex-1 font-medium">{invitation.config.title || "No definido"}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-muted-foreground">Fecha:</div>
                  <div className="flex-1 font-medium">
                    {invitation.config.eventDate 
                      ? new Date(invitation.config.eventDate).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "No definida"
                    }
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-muted-foreground">Hora:</div>
                  <div className="flex-1 font-medium">
                    {invitation.config.eventTime || "No definida"}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-muted-foreground">Ubicación:</div>
                  <div className="flex-1 font-medium">
                    {invitation.config.location || "No definida"}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-muted-foreground">Anfitriones:</div>
                  <div className="flex-1 font-medium">
                    {invitation.config.hostNames && invitation.config.hostNames.length > 0
                      ? invitation.config.hostNames.join(', ')
                      : "No definidos"
                    }
                  </div>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Componentes activos</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Formulario de confirmación
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Cuenta regresiva
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Mapa
                </li>
                {invitation.config.components.gallery && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    Galería
                  </li>
                )}
                {invitation.config.components.music && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    Música
                  </li>
                )}
                {invitation.config.components.gifts && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    Mesa de Regalos
                  </li>
                )}
                {invitation.config.components.accommodation && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    Información de Hospedaje
                  </li>
                )}
                {invitation.config.components.itinerary && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    Itinerario
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Enlace público</h3>
              <div className="p-3 bg-muted rounded flex items-center">
                <div className="mr-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                </div>
                <input 
                  type="text" 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/i/${publicUrl}`}
                  readOnly
                  className="bg-transparent border-none w-full focus:outline-none"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Este es el enlace que compartirás con tus invitados
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Panel de publicación */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Lista de verificación</CardTitle>
              <CardDescription>
                Asegúrate de que tu invitación cumpla con estos requisitos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  {invitation.config.title ? (
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-medium">Título de la invitación</span>
                    <p className="text-sm text-muted-foreground">
                      Tu invitación debe tener un título descriptivo
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {invitation.config.eventDate ? (
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-medium">Fecha del evento</span>
                    <p className="text-sm text-muted-foreground">
                      Define cuándo se realizará tu evento
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {invitation.config.location ? (
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-medium">Ubicación</span>
                    <p className="text-sm text-muted-foreground">
                      Especifica dónde se llevará a cabo el evento
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {invitation.config.hostNames && invitation.config.hostNames.length > 0 ? (
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-medium">Anfitriones</span>
                    <p className="text-sm text-muted-foreground">
                      Añade quiénes organizan el evento
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No se puede publicar</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handlePublish} 
              disabled={publishing || validationErrors.length > 0}
              size="lg"
              className="w-full"
            >
              {publishing ? 'Publicando...' : '¡Publicar invitación ahora!'}
            </Button>
            
            <Button 
              asChild 
              variant="outline"
              disabled={publishing}
            >
              <Link href={`/invitaciones/${params.id}/editar`}>
                Volver a editar
              </Link>
            </Button>
            
            <Button
              asChild
              variant="ghost"
              disabled={publishing}
            >
              <Link href={`/invitaciones/${params.id}`}>
                Cancelar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 