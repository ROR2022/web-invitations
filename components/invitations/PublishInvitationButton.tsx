"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { publishInvitation } from '@/services/invitation.client';
import { Invitation, InvitationStatus } from '@/types/invitation';
import { useToast } from '@/components/ui/use-toast';
import { Check, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { ValidationError } from '@/utils/invitation-validator';

interface PublishInvitationButtonProps {
  invitation: Invitation;
  onSuccess?: (updatedInvitation: Invitation) => void;
  buttonText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function PublishInvitationButton({
  invitation,
  onSuccess,
  buttonText = 'Publicar',
  fullWidth = false,
  disabled = false
}: PublishInvitationButtonProps) {
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [publishedInvitation, setPublishedInvitation] = useState<Invitation | null>(null);
  
  const hasValidationErrors = validationErrors.length > 0;
  
  // Verificar si la invitación ya está publicada
  const isAlreadyPublished = invitation.status === InvitationStatus.PUBLISHED;
  
  // Handler para el botón de publicar
  const handlePublish = async () => {
    if (isPublishing) return;
    
    try {
      setIsPublishing(true);
      setValidationErrors([]);
      
      const updatedInvitation = await publishInvitation(invitation.id);
      
      // Guardar la invitación publicada para mostrar detalles
      setPublishedInvitation(updatedInvitation);
      
      // Notificar éxito
      toast({
        title: "¡Invitación publicada!",
        description: "Tu invitación está disponible en línea y lista para compartir.",
      });
      
      // Llamar al callback si existe
      if (onSuccess) {
        onSuccess(updatedInvitation);
      }
      
    } catch (error: any) {
      console.error('Error publishing invitation:', error);
      
      // Manejar errores de validación
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      } else {
        toast({
          title: "Error al publicar",
          description: error.message || "No se pudo publicar la invitación. Intenta nuevamente.",
          variant: "destructive",
        });
        
        // Cerrar el diálogo en caso de error que no sea de validación
        setDialogOpen(false);
      }
    } finally {
      setIsPublishing(false);
    }
  };
  
  // URL pública para compartir (en caso de que ya esté publicada)
  const publicUrl = publishedInvitation?.publicUrl || invitation.publicUrl;
  const fullPublicUrl = publicUrl ? `${window.location.origin}/i/${publicUrl}` : '';
  
  // Copiar URL al portapapeles
  const copyToClipboard = () => {
    if (fullPublicUrl) {
      navigator.clipboard.writeText(fullPublicUrl);
      toast({
        title: "URL copiada",
        description: "Enlace copiado al portapapeles",
      });
    }
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isAlreadyPublished ? "outline" : "default"}
          className={fullWidth ? "w-full" : ""}
          disabled={disabled}
        >
          {isAlreadyPublished ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          ) : buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        {!hasValidationErrors && !publishedInvitation && (
          <>
            <DialogHeader>
              <DialogTitle>Publicar invitación</DialogTitle>
              <DialogDescription>
                Al publicar tu invitación estará disponible en línea y podrás compartirla con tus invitados.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Antes de publicar, asegúrate de que toda la información esté correcta.
                Una vez publicada, podrás seguir haciendo cambios.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handlePublish} 
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : 'Publicar ahora'}
              </Button>
            </DialogFooter>
          </>
        )}
        
        {hasValidationErrors && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-amber-500">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Información incompleta
              </DialogTitle>
              <DialogDescription>
                Para publicar tu invitación, necesitas completar la siguiente información:
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-muted-foreground">
                Por favor, completa todos los campos requeridos antes de publicar.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>
                Entendido
              </Button>
            </DialogFooter>
          </>
        )}
        
        {publishedInvitation && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600">
                <Check className="h-5 w-5 mr-2" />
                ¡Invitación publicada!
              </DialogTitle>
              <DialogDescription>
                Tu invitación está disponible en línea y lista para compartir.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-1">URL pública:</p>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-background p-2 rounded w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {fullPublicUrl}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    Copiar
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Comparte este enlace con tus invitados. Puedes ver estadísticas de tu invitación
                en la sección de detalles.
              </p>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cerrar
              </Button>
              <Button 
                onClick={() => window.open(fullPublicUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver invitación
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 