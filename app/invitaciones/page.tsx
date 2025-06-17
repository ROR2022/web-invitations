"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Package, AlertTriangle, MoreVertical, Trash, Archive, Copy, Edit, Share, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserInvitations, updateInvitation, deleteInvitation } from '@/services/invitation.client';
import { Invitation, InvitationStatus } from '@/types/invitation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useRouter } from 'next/navigation';

export default function MisInvitaciones() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useUser();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  // Cargar invitaciones cuando el usuario está autenticado
  useEffect(() => {
    async function fetchInvitations() {
      if (!isAuthenticated) return;
      
      try {
        setLoadingInvitations(true);
        const data = await getUserInvitations();
        setInvitations(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading invitations:', err);
        setError(err.message || 'No se pudieron cargar las invitaciones');
      } finally {
        setLoadingInvitations(false);
      }
    }

    fetchInvitations();
  }, [isAuthenticated]);

  // Función para actualizar la lista después de realizar acciones
  const refreshInvitations = async () => {
    try {
      setLoadingInvitations(true);
      const data = await getUserInvitations();
      setInvitations(data);
    } catch (err: any) {
      console.error('Error refreshing invitations:', err);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las invitaciones",
        variant: "destructive",
      });
    } finally {
      setLoadingInvitations(false);
    }
  };

  // Función para eliminar una invitación
  const handleDeleteInvitation = async () => {
    if (!invitationToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteInvitation(invitationToDelete);
      setInvitationToDelete(null);
      
      toast({
        title: "Invitación eliminada",
        description: "La invitación ha sido eliminada correctamente.",
      });
      
      // Actualizar la lista
      await refreshInvitations();
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

  // Función para archivar/desarchivar una invitación
  const handleArchiveInvitation = async (invitation: Invitation) => {
    try {
      setIsArchiving(true);
      
      // Si ya está archivada, la desarchivamos
      const newStatus = invitation.status === InvitationStatus.ARCHIVED 
        ? InvitationStatus.DRAFT 
        : InvitationStatus.ARCHIVED;
        
      await updateInvitation(invitation.id, {
        status: newStatus
      });
      
      toast({
        title: newStatus === InvitationStatus.ARCHIVED ? "Invitación archivada" : "Invitación restaurada",
        description: newStatus === InvitationStatus.ARCHIVED 
          ? "La invitación ha sido archivada correctamente." 
          : "La invitación ha sido restaurada correctamente.",
      });
      
      // Actualizar la lista
      await refreshInvitations();
    } catch (err: any) {
      console.error('Error archiving invitation:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo realizar la acción",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  // Función para duplicar invitación (placeholder)
  const handleDuplicateInvitation = () => {
    toast({
      title: "Próximamente",
      description: "La duplicación de invitaciones estará disponible pronto.",
    });
  };

  // Función para compartir invitación (placeholder)
  const handleShareInvitation = () => {
    toast({
      title: "Próximamente",
      description: "Las opciones de compartir estarán disponibles pronto.",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
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
            <CardDescription>Debes iniciar sesión para ver tus invitaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
            <p className="mb-4">
              Por favor inicia sesión o regístrate para acceder a tus invitaciones.
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

  // Filtrar invitaciones por estado para cada pestaña
  const allInvitations = invitations;
  const draftInvitations = invitations.filter(inv => inv.status === InvitationStatus.DRAFT);
  const publishedInvitations = invitations.filter(inv => inv.status === InvitationStatus.PUBLISHED);
  const archivedInvitations = invitations.filter(inv => inv.status === InvitationStatus.ARCHIVED);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Invitaciones</h1>
        <Button asChild>
          <Link href="/crear-invitacion" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            <span>Crear Invitación</span>
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="borradores">Borradores</TabsTrigger>
          <TabsTrigger value="publicadas">Publicadas</TabsTrigger>
          <TabsTrigger value="archivadas">Archivadas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          {loadingInvitations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : allInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allInvitations.map(invitation => (
                <InvitationCard 
                  key={invitation.id} 
                  invitation={invitation} 
                  onDelete={setInvitationToDelete}
                  onArchive={handleArchiveInvitation}
                  onDuplicate={handleDuplicateInvitation}
                  onShare={handleShareInvitation}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="borradores">
          {loadingInvitations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : draftInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftInvitations.map(invitation => (
                <InvitationCard 
                  key={invitation.id} 
                  invitation={invitation} 
                  onDelete={setInvitationToDelete}
                  onArchive={handleArchiveInvitation}
                  onDuplicate={handleDuplicateInvitation}
                  onShare={handleShareInvitation}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>
        
        <TabsContent value="publicadas">
          {loadingInvitations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : publishedInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedInvitations.map(invitation => (
                <InvitationCard 
                  key={invitation.id} 
                  invitation={invitation} 
                  onDelete={setInvitationToDelete}
                  onArchive={handleArchiveInvitation}
                  onDuplicate={handleDuplicateInvitation}
                  onShare={handleShareInvitation}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="archivadas">
          {loadingInvitations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1].map((i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : archivedInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedInvitations.map(invitation => (
                <InvitationCard 
                  key={invitation.id} 
                  invitation={invitation} 
                  onDelete={setInvitationToDelete}
                  onArchive={handleArchiveInvitation}
                  onDuplicate={handleDuplicateInvitation}
                  onShare={handleShareInvitation}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={!!invitationToDelete} onOpenChange={(open) => !open && setInvitationToDelete(null)}>
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
  );
}

// Componente de tarjeta de invitación con menú de acciones
interface InvitationCardProps {
  invitation: Invitation;
  onDelete: (id: string) => void;
  onArchive: (invitation: Invitation) => void;
  onDuplicate: () => void;
  onShare: () => void;
}

function InvitationCard({ invitation, onDelete, onArchive, onDuplicate, onShare }: InvitationCardProps) {
  const isPublished = invitation.status === InvitationStatus.PUBLISHED;
  const isDraft = invitation.status === InvitationStatus.DRAFT;
  const isArchived = invitation.status === InvitationStatus.ARCHIVED;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="truncate">{invitation.config.title || "Sin título"}</CardTitle>
          <CardDescription>
            {invitation.config.eventDate ? new Date(invitation.config.eventDate).toLocaleDateString() : "Sin fecha"}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => window.location.href = `/invitaciones/${invitation.id}`}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {!isArchived && (
              <DropdownMenuItem 
                onClick={() => window.location.href = `/invitaciones/${invitation.id}/editar`}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}
            {isPublished && (
              <DropdownMenuItem onClick={onShare} className="cursor-pointer">
                <Share className="mr-2 h-4 w-4" />
                Compartir
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onArchive(invitation)}
              className="cursor-pointer"
            >
              <Archive className="mr-2 h-4 w-4" />
              {isArchived ? 'Restaurar' : 'Archivar'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(invitation.id)}
              className="text-red-600 cursor-pointer focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
        <p className="text-muted-foreground line-clamp-2">
          {invitation.config.location || "Sin ubicación"}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/invitaciones/${invitation.id}`}>
            Ver Detalles
          </Link>
        </Button>
        {isPublished && invitation.publicUrl && (
          <Button variant="secondary" asChild>
            <Link href={`/i/${invitation.publicUrl}`} target="_blank">
              Ver Pública
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="w-full py-12">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay invitaciones</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          No tienes invitaciones en esta categoría. Crea tu primera invitación para comenzar.
        </p>
        <Button asChild>
          <Link href="/crear-invitacion" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            <span>Crear Invitación</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
} 