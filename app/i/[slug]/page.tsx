"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Invitation, InvitationStatus } from '@/types/invitation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CircleDashed, 
  CalendarDays, 
  MapPin, 
  Clock, 
  Share, 
  ThumbsUp, 
  ThumbsDown, 
  X 
} from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { recordInvitationView } from '@/services/invitation.client';
import RsvpForm from '@/components/invitations/RsvpForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

export default function PublicInvitationPage() {
  const params = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpDecision, setRsvpDecision] = useState<boolean | null>(null);
  
  // Cargar la invitación pública
  useEffect(() => {
    async function loadInvitation() {
      try {
        const supabase = createClient();
        setLoading(true);
        
        // Buscar la invitación por su slug público
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('public_url', params.slug)
          .eq('status', InvitationStatus.PUBLISHED)
          .single();
        
        if (error) {
          throw new Error('No se encontró la invitación');
        }
        
        // Transformar de snake_case a camelCase
        const invitation: Invitation = {
          id: data.id,
          userId: data.user_id,
          config: data.config,
          status: data.status,
          packageType: data.package_type,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          publishedAt: data.published_at,
          publicUrl: data.public_url
        };
        
        setInvitation(invitation);
        
        // Generar o recuperar ID de visitante
        let visitorId = localStorage.getItem(`visitor_${invitation.id}`);
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem(`visitor_${invitation.id}`, visitorId);
        }
        setVisitorId(visitorId);
        
        // Registrar vista
        await recordInvitationView(invitation.id, visitorId);
        
      } catch (err: any) {
        console.error('Error loading public invitation:', err);
        setError(err.message || 'No se pudo cargar la invitación');
      } finally {
        setLoading(false);
      }
    }
    
    loadInvitation();
  }, [params.slug]);
  
  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CircleDashed className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Cargando invitación...</h1>
          <p className="text-muted-foreground">Estamos preparando tu invitación</p>
        </div>
      </div>
    );
  }
  
  // Mostrar error si no se encuentra la invitación
  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Invitación no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            La invitación que buscas no existe o ha sido eliminada.
          </p>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </Card>
      </div>
    );
  }
  
  // Extraer información de la configuración
  const { 
    title,
    eventDate,
    eventTime,
    location,
  } = invitation.config;
  
  // Dar formato a la fecha
  const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  // Compartir invitación
  const shareInvitation = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'Invitación',
        text: `Te invito a ${title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };
  
  // Manejar la respuesta (RSVP) del invitado
  const handleRSVP = (attending: boolean) => {
    setRsvpDecision(attending);
    setRsvpOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Contenido de la invitación */}
      <div className="container max-w-3xl mx-auto p-4">
        {invitation.config.editorConfig ? (
          // Si tiene configuración de editor, usar el iframe con versión generada
          <div className="w-full h-[90vh] overflow-hidden rounded-lg shadow-lg">
            <iframe 
              src={`/api/preview/${invitation.id}?token=public`}
              className="w-full h-full border-0"
              title={title || 'Invitación'}
            />
          </div>
        ) : (
          // Si no, mostrar versión simplificada
          <Card className="overflow-hidden">
            <div className="bg-primary p-10 text-center text-white">
              <h1 className="text-4xl font-bold mb-3">{title || 'Invitación'}</h1>
              <p className="text-xl">Te invitamos a acompañarnos</p>
            </div>
            
            <div className="p-6 space-y-8">
              {eventDate && (
                <div className="flex items-start gap-4">
                  <CalendarDays className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Fecha</h3>
                    <p>{formattedDate}</p>
                  </div>
                </div>
              )}
              
              {eventTime && (
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Hora</h3>
                    <p>{eventTime}</p>
                  </div>
                </div>
              )}
              
              {location && (
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Lugar</h3>
                    <p>{location}</p>
                    
                    {/* Mapa */}
                    {invitation.config.components?.map && (
                      <div className="mt-2 rounded-md overflow-hidden h-[200px]">
                        <iframe
                          title={`Mapa de ubicación: ${location}`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Botones de RSVP y compartir */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={shareInvitation}
            className="flex items-center justify-center gap-2"
          >
            <Share className="h-4 w-4" />
            Compartir invitación
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="default" 
              onClick={() => handleRSVP(true)}
              className="flex items-center justify-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Confirmar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleRSVP(false)}
              className="flex items-center justify-center gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Declinar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Modal de RSVP */}
      <Dialog open={rsvpOpen} onOpenChange={setRsvpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {rsvpDecision === true 
                ? 'Confirmar asistencia' 
                : 'Declinar invitación'}
              <DialogClose className="rounded-full h-6 w-6 flex items-center justify-center">
                <X className="h-4 w-4" />
              </DialogClose>
            </DialogTitle>
            <DialogDescription>
              {rsvpDecision === true 
                ? 'Por favor completa tu información para confirmar tu asistencia.' 
                : 'Lamentamos que no puedas asistir. ¿Quieres dejar un mensaje?'}
            </DialogDescription>
          </DialogHeader>
          
          {invitation && (
            <RsvpForm 
              invitationId={invitation.id}
              onSuccess={() => {
                setTimeout(() => setRsvpOpen(false), 3000);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 