"use client";

import React, { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, AlertTriangle, Package, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createInvitation } from '@/services/invitation.client';
import { PackageType, EventType } from '@/types/invitation';
import { toast } from '@/components/ui/use-toast';
import TemplateGallery from '@/components/templates/TemplateGallery';

const steps = [
  { id: 'paquete', title: 'Paquete' },
  { id: 'plantilla', title: 'Plantilla' },
  { id: 'personalizar', title: 'Personalizar' },
  { id: 'pago', title: 'Pago' },
];

interface PackageOption {
  type: PackageType;
  title: string;
  description: string;
  price: number;
  features: string[];
}

const packageOptions: PackageOption[] = [
  {
    type: PackageType.BASIC,
    title: 'Básico',
    description: 'Para eventos pequeños',
    price: 299,
    features: [
      'Invitación interactiva',
      'Formulario de confirmación',
      'Mapa de ubicación',
      'Cuenta regresiva'
    ]
  },
  {
    type: PackageType.PREMIUM,
    title: 'Premium',
    description: 'Para eventos medianos',
    price: 499,
    features: [
      'Todo lo de Básico',
      'Galería de fotos',
      'Música personalizada',
      'Mesa de regalos digital'
    ]
  },
  {
    type: PackageType.VIP,
    title: 'VIP',
    description: 'Para eventos grandes',
    price: 799,
    features: [
      'Todo lo de Premium',
      'Información de hospedaje',
      'Itinerario detallado',
      'Diseños exclusivos'
    ]
  }
];

export default function CrearInvitacion() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useUser();
  const [currentStep, setCurrentStep] = useState('paquete');
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
            <CardDescription>Debes iniciar sesión para crear invitaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
            <p className="mb-4">
              Por favor inicia sesión o regístrate para crear una nueva invitación.
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

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  const goToNextStep = async () => {
    if (currentStepIndex < steps.length - 1) {
      if (currentStepIndex === 0 && selectedPackage) {
        // Si estamos en el último paso, crear la invitación
        if (currentStepIndex === steps.length - 2) {
          await handleCreateInvitation();
          return;
        }
      }
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleCreateInvitation = async () => {
    if (!selectedPackage || !selectedTemplate) {
      setError("Por favor selecciona un paquete y una plantilla para continuar");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Por ahora, usamos valores temporales para tipo de evento
      const eventType = EventType.WEDDING;

      const result = await createInvitation({
        packageType: selectedPackage,
        eventType,
        templateId: selectedTemplate,
      });

      toast({
        title: "¡Invitación creada!",
        description: "Tu invitación ha sido creada correctamente.",
      });

      // Redirigir a la página de edición de la invitación
      router.push(`/invitaciones/${result.id}/editar`);
    } catch (err: any) {
      console.error("Error creating invitation:", err);
      setError(err.message || "Ocurrió un error al crear la invitación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    if (currentStep === 'paquete') return !!selectedPackage;
    if (currentStep === 'plantilla') return !!selectedTemplate;
    return true;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Crear Nueva Invitación</h1>
        <Button asChild variant="ghost">
          <Link href="/invitaciones">Cancelar</Link>
        </Button>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex justify-between relative mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${currentStepIndex >= index ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-muted text-muted-foreground'}`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm font-medium">{step.title}</span>
            </div>
          ))}
          {/* Línea conectora */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contenido del paso actual */}
      <Card className="mb-8">
        <CardContent className="pt-6 pb-6">
          {currentStep === 'paquete' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Selecciona un Paquete</h2>
              <p className="text-muted-foreground">
                Elige el paquete que mejor se adapte a tus necesidades para tu invitación digital.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {packageOptions.map((option) => (
                  <Card 
                    key={option.type}
                    className={`cursor-pointer transition-all h-full flex flex-col ${selectedPackage === option.type ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedPackage(option.type)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </div>
                        {selectedPackage === option.type && (
                          <span className="rounded-full bg-primary p-1">
                            <Check className="h-4 w-4 text-white" />
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-3xl font-bold mb-4">${option.price} <span className="text-sm font-normal">MXN</span></p>
                      <ul className="space-y-2">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 text-primary">✓</span> {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button 
                        variant={selectedPackage === option.type ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedPackage(option.type)}
                      >
                        {selectedPackage === option.type ? "Seleccionado" : "Seleccionar"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'plantilla' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Selecciona una Plantilla</h2>
              <p className="text-muted-foreground">
                Elige una plantilla para tu invitación. Podrás personalizarla en el siguiente paso.
              </p>
              <div className="mt-6">
                {selectedPackage && (
                  <TemplateGallery 
                    packageType={selectedPackage}
                    selectedTemplateId={selectedTemplate || undefined}
                    onSelectTemplate={(id) => setSelectedTemplate(id)}
                  />
                )}
              </div>
            </div>
          )}

          {currentStep === 'personalizar' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Personaliza tu Invitación</h2>
              <p className="text-muted-foreground">
                Ahora completa la información básica para crear tu invitación. Podrás personalizarla en detalle después.
              </p>
              <div className="p-6 border rounded-lg text-center">
                <p>Esta sección será implementada más adelante.</p>
                <p className="text-muted-foreground mt-2">
                  Por ahora, puedes continuar y editar los detalles después de crear la invitación.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'pago' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Finaliza tu Pedido</h2>
              <p className="text-muted-foreground">
                Revisa tu selección y completa la creación de tu invitación.
              </p>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 border-b">
                  <h3 className="font-medium">Resumen de tu pedido</h3>
                </div>
                <div className="p-4 space-y-4">
                  {selectedPackage && (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Paquete {
                          selectedPackage === PackageType.BASIC ? 'Básico' :
                          selectedPackage === PackageType.PREMIUM ? 'Premium' :
                          'VIP'
                        }</p>
                        <p className="text-sm text-muted-foreground">
                          {packageOptions.find(p => p.type === selectedPackage)?.description}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${packageOptions.find(p => p.type === selectedPackage)?.price} MXN
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <p>Total</p>
                    <p>${packageOptions.find(p => p.type === selectedPackage)?.price} MXN</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-amber-700 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    En esta versión de desarrollo, el módulo de pagos no está activo. 
                    Se creará tu invitación sin cargo.
                  </span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navegación entre pasos */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={goToPreviousStep}
          disabled={currentStepIndex === 0 || isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button 
          onClick={currentStepIndex === steps.length - 1 ? handleCreateInvitation : goToNextStep}
          disabled={
            !canGoNext() || isSubmitting
          }
          className="flex items-center gap-2"
        >
          {isSubmitting ? 'Procesando...' : 
            currentStepIndex === steps.length - 1 ? 'Crear Invitación' : 'Siguiente'}
          {!isSubmitting && currentStepIndex < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
} 