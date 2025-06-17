"use client";

import React, { useState } from 'react';
import { useForm, FieldValues, DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle2, UserPlus } from 'lucide-react';
import { saveGuestRSVP } from '@/services/invitation.client';

// Esquema de validación
const rsvpFormSchema = z.object({
  name: z.string().min(2, { message: 'Por favor ingresa tu nombre completo' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  attending: z.enum(['yes', 'no']),
  numberOfGuests: z.number().min(0).max(10, { message: 'Máximo 10 invitados adicionales' }),
  message: z.string().optional().or(z.literal('')),
  dietaryRestrictions: z.string().optional().or(z.literal('')),
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

interface RsvpFormProps {
  invitationId: string;
  onSuccess?: () => void;
}

// Make all properties non-optional for form default values
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

export default function RsvpForm({ invitationId, onSuccess }: RsvpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Inicializar formulario
  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      attending: 'yes',
      numberOfGuests: 0,
      message: '',
      dietaryRestrictions: '',
    } as DefaultValues<Concrete<RsvpFormValues>>,
  });

  // Enviar formulario
  const onSubmit = async (values: RsvpFormValues) => {
    try {
      setIsSubmitting(true);

      // Convertir attending a boolean
      const attending = values.attending === 'yes';

      // Guardar RSVP
      await saveGuestRSVP({
        invitationId,
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        attending,
        numberOfGuests: attending ? values.numberOfGuests : 0,
        message: values.message || undefined,
        dietaryRestrictions: values.dietaryRestrictions || undefined,
      });

      // Marcar como enviado
      setSubmitted(true);

      // Llamar al callback de éxito
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Error saving RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar mensaje de éxito después de enviar
  if (submitted) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg space-y-4">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">¡Gracias por tu respuesta!</h3>
        <p className="text-muted-foreground">
          Hemos registrado tu confirmación y se ha notificado a los anfitriones.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Enviar otra respuesta
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        {/* Nombre completo */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo *</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ejemplo@correo.com" type="email" {...field} />
              </FormControl>
              <FormDescription>Opcional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Ej. 555-123-4567" {...field} />
              </FormControl>
              <FormDescription>Opcional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Asistencia */}
        <FormField
          control={form.control}
          name="attending"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>¿Asistirás al evento? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí, asistiré</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No podré asistir</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número de invitados adicionales */}
        {form.watch('attending') === 'yes' && (
          <FormField
            control={form.control}
            name="numberOfGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de acompañantes</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(11)].map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i === 0 ? 'Sin acompañantes' : i === 1 ? '1 acompañante' : `${i} acompañantes`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  <UserPlus className="h-3 w-3 inline mr-1" />
                  Incluyéndote, serán {1 + Number(field.value)} personas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Restricciones alimentarias */}
        {form.watch('attending') === 'yes' && (
          <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restricciones alimentarias</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Vegetariano, sin gluten, etc." {...field} />
                </FormControl>
                <FormDescription>Si tienes alguna restricción o preferencia alimentaria</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Mensaje */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje para los anfitriones</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Escribe un mensaje personal (opcional)" 
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de envío */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Confirmar asistencia'
          )}
        </Button>
      </form>
    </Form>
  );
} 