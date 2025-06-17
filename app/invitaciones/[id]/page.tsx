"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Edit, 
  Share, 
  Trash, 
  Archive, 
  Copy, 
  Eye,
  Users,
  Calendar,
  MapPin, 
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { getInvitationById, getInvitationStats, updateInvitation, deleteInvitation } from '@/services/invitation.client';
import { Invitation, InvitationStatus } from '@/types/invitation';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';

export default function InvitacionDetalle() {
  const router = useRouter();
  const { user, loading: userLoading, isAuthenticated } = useUser();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const params = useParams();

  // Cargar detalles de la invitación
  useEffect(() => {
    async function loadInvitation() {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const data = await getInvitationById(params.id as string);
        setInvitation(data);
        
        // Cargar estadísticas si la invitación está publicada
        if (data.status === InvitationStatus.PUBLISHED) {
          try {
            const statsData = await getInvitationStats(params.id as string);
            setStats(statsData);
          } catch (err) {
            console.error('Error loading stats:', err);
            // No mostrar error por las estadísticas, solo log
          }
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error loading invitation:', err);
        setError(err.message || 'No se pudo cargar la invitación');
      } finally {
        setLoading(false);
      }
    }

    loadInvitation();
  }, [params.id, isAuthenticated]);

  // Funciones para gestionar la invitación
  const handleDeleteInvitation = async () => {
    try {
      setIsDeleting(true);
      await deleteInvitation(params.id as string);
      toast({
        title: "Invitación eliminada",
        description: "La invitación ha sido eliminada correctamente.",
      });
      router.push('/invitaciones');
    } catch (err: any) {
      console.error('Error deleting invitation:', err);
      toast({
        title: "Error al eliminar",
        description: err.message || "No se pudo eliminar la invitación",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveInvitation = async () => {
    if (!invitation) return;
    
    try {
      setIsArchiving(true);
      
      // Si ya está archivada, la desarchivamos
      const newStatus = invitation.status === InvitationStatus.ARCHIVED 
        ? InvitationStatus.DRAFT 
        : InvitationStatus.ARCHIVED;
        
      const updated = await updateInvitation(params.id as string, {
        status: newStatus
      });
      
      setInvitation(updated);
      
      toast({
        title: newStatus === InvitationStatus.ARCHIVED ? "Invitación archivada" : "Invitación restaurada",
        description: newStatus === InvitationStatus.ARCHIVED 
          ? "La invitación ha sido archivada correctamente." 
          : "La invitación ha sido restaurada correctamente.",
      });
    } catch (err: any) {
      console.error('Error archiving invitation:', err);
      toast({
        title: "Error al archivar",
        description: err.message || "No se pudo archivar la invitación",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDuplicateInvitation = async () => {
    // Esta funcionalidad se implementará después
    toast({
      title: "Próximamente",
      description: "La duplicación de invitaciones estará disponible pronto.",
    });
  };

  const handleShareInvitation = () => {
    // Esta funcionalidad se implementará después
    toast({
      title: "Próximamente",
      description: "Las opciones de compartir estarán disponibles pronto.",
    });
  };

  if (userLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-8 mr-2" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full mb-6 rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
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
            <CardDescription>Debes iniciar sesión para ver los detalles de la invitación</CardDescription>
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
              <Link href="/invitaciones">Volver a Mis Invitaciones</Link>
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

  const isPublished = invitation.status === InvitationStatus.PUBLISHED;
  const isDraft = invitation.status === InvitationStatus.DRAFT;
  const isArchived = invitation.status === InvitationStatus.ARCHIVED;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button asChild variant="ghost" className="mr-2 p-2">
            <Link href="/invitaciones">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold truncate">{invitation.config.title || 'Invitación sin título'}</h1>
          <span className={`ml-3 inline-block px-2 py-1 rounded-full text-xs ${
            isPublished ? 'bg-green-100 text-green-800' :
            isDraft ? 'bg-yellow-100 text-yellow-800' :
            isArchived ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {isPublished ? 'Publicada' :
             isDraft ? 'Borrador' :
             isArchived ? 'Archivada' :
             invitation.status}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {!isArchived && (
            <Button asChild variant="default">
              <Link href={`/invitaciones/${params.id}/editar`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
          )}
          
          {isPublished && (
            <Button onClick={handleShareInvitation} variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          )}
          
          <Button onClick={handleDuplicateInvitation} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                {isArchived ? (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Restaurar
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Archivar
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isArchived ? '¿Restaurar invitación?' : '¿Archivar invitación?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isArchived 
                    ? 'Esta acción restaurará la invitación y la moverá a borradores.' 
                    : 'Esta acción archivará la invitación. Puedes restaurarla después si lo deseas.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleArchiveInvitation}
                  disabled={isArchiving}
                >
                  {isArchiving 
                    ? 'Procesando...' 
                    : isArchived ? 'Restaurar' : 'Archivar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar invitación?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente la invitación. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteInvitation}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda y central */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta de vista previa */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-0">
              <div className="bg-gray-100 w-full h-64 flex items-center justify-center">
                {isPublished ? (
                  <div className="text-center">
                    <p className="mb-4">Vista previa disponible</p>
                    <Button asChild>
                      <Link href={`/i/${invitation.publicUrl}`} target="_blank">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver invitación publicada
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <p>Esta invitación aún no ha sido publicada</p>
                )}
              </div>
            </CardContent>
            {isDraft && (
              <CardFooter className="flex justify-end">
                <Button asChild>
                  <Link href={`/invitaciones/${params.id}/publicar`}>
                    Publicar Invitación
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Fecha y Hora</h3>
                    <p className="text-muted-foreground">
                      {invitation.config.eventDate 
                        ? new Date(invitation.config.eventDate).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Fecha no definida'
                      }
                      {invitation.config.eventTime ? `, ${invitation.config.eventTime}` : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Ubicación</h3>
                    <p className="text-muted-foreground">
                      {invitation.config.location || 'Ubicación no definida'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Anfitriones</h3>
                    <p className="text-muted-foreground">
                      {invitation.config.hostNames && invitation.config.hostNames.length > 0
                        ? invitation.config.hostNames.join(', ')
                        : 'No definidos'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Columna derecha - Estadísticas y detalles */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tipo de paquete</dt>
                  <dd className="text-sm font-semibold mt-1">
                    {invitation.packageType === 'basic' ? 'Básico' :
                     invitation.packageType === 'premium' ? 'Premium' :
                     invitation.packageType === 'vip' ? 'VIP' :
                     invitation.packageType}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tipo de evento</dt>
                  <dd className="text-sm font-semibold mt-1">
                    {invitation.config.eventType === 'wedding' ? 'Boda' :
                     invitation.config.eventType === 'birthday' ? 'Cumpleaños' :
                     invitation.config.eventType === 'baptism' ? 'Bautizo' :
                     invitation.config.eventType === 'sweet_fifteen' ? 'Quinceañera' :
                     invitation.config.eventType === 'graduation' ? 'Graduación' :
                     invitation.config.eventType === 'corporate' ? 'Corporativo' :
                     invitation.config.eventType || 'No definido'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Fecha de creación</dt>
                  <dd className="text-sm font-semibold mt-1">
                    {new Date(invitation.createdAt).toLocaleDateString('es-ES')}
                  </dd>
                </div>
                
                {invitation.publishedAt && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Fecha de publicación</dt>
                    <dd className="text-sm font-semibold mt-1">
                      {new Date(invitation.publishedAt).toLocaleDateString('es-ES')}
                    </dd>
                  </div>
                )}
                
                {invitation.publicUrl && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Enlace público</dt>
                    <dd className="text-sm font-semibold mt-1 break-all">
                      {`${window.location.origin}/i/${invitation.publicUrl}`}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
          
          {/* Estadísticas - Solo mostrar si está publicada y hay datos */}
          {isPublished && stats && (
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Vistas totales</dt>
                    <dd className="text-xl font-bold mt-1">{stats.views || 0}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Visitantes únicos</dt>
                    <dd className="text-xl font-bold mt-1">{stats.uniqueVisitors || 0}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Confirmaciones</dt>
                    <dd className="text-xl font-bold mt-1 text-green-600">{stats.confirmations || 0}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Rechazos</dt>
                    <dd className="text-xl font-bold mt-1 text-red-600">{stats.declines || 0}</dd>
                  </div>
                </dl>
              </CardContent>
              {/* Podríamos añadir un enlace a un panel de estadísticas más detallado */}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 