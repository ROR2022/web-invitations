"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ComponentProperty } from '../../types';
import { attendanceSchema } from '../componentSchemas';
import { createConfigurableProperties } from '../../utils/componentUtils';

/**
 * Componente Attendance configurable para el editor de plantillas
 * Formulario para que los invitados confirmen su asistencia
 */

// Definir el tipo de propiedades basado en el esquema
export type AttendanceProps = {
  // Propiedades configurables
  title: string;
  description: string;
  rsvpDeadline: string;
  showAdditionalGuests: boolean;
  maxAdditionalGuests: number;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  includeDietaryRestrictions: boolean;
  includeComments: boolean;
  
  // Props adicionales para el editor
  isEditing?: boolean;
  onPropertyChange?: (property: string, value: any) => void;
};

const ConfigurableAttendance: React.FC<AttendanceProps> = ({
  title,
  description,
  rsvpDeadline,
  showAdditionalGuests,
  maxAdditionalGuests,
  backgroundColor,
  textColor,
  buttonColor,
  buttonTextColor,
  includeDietaryRestrictions,
  includeComments,
  isEditing = false,
  onPropertyChange
}) => {
  // Estados para el formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Formatear la fecha límite de RSVP
  const formatRsvpDeadline = () => {
    if (!rsvpDeadline) return '';
    
    try {
      const date = new Date(rsvpDeadline);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return rsvpDeadline;
    }
  };
  
  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // En modo edición, solo simular el envío
      console.log('Simulando envío del formulario de asistencia (modo edición)');
      return;
    }
    
    // Aquí iría el código para enviar los datos al servidor
    console.log({
      name,
      email,
      attending,
      guestCount,
      dietaryRestrictions,
      comments
    });
    
    // Mostrar mensaje de confirmación
    setSubmitted(true);
    
    // Limpiar el formulario
    setTimeout(() => {
      setName('');
      setEmail('');
      setAttending(null);
      setGuestCount(0);
      setDietaryRestrictions('');
      setComments('');
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section 
      className={`py-16 md:py-24 w-full relative ${isEditing ? 'editing-mode' : ''}`}
      style={{ backgroundColor }}
      data-component-type="attendance"
      id="attendance-section"
    >
      <motion.div 
        className="container mx-auto px-4 max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-10">
          <h2 
            className="text-3xl md:text-4xl font-medium mb-4"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          
          <p 
            className="text-lg"
            style={{ color: textColor }}
          >
            {description.replace('[fecha]', formatRsvpDeadline())}
          </p>
        </div>
        
        {submitted ? (
          <motion.div 
            className="bg-white bg-opacity-20 p-8 rounded-lg shadow-md text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 
              className="text-2xl font-medium mb-4"
              style={{ color: textColor }}
            >
              ¡Gracias por confirmar!
            </h3>
            <p style={{ color: textColor }}>
              Hemos recibido tu confirmación. Nos vemos pronto.
            </p>
          </motion.div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-20 p-8 rounded-lg shadow-md"
          >
            <div className="space-y-6">
              {/* Nombre */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tu nombre"
                  required
                  disabled={isEditing}
                />
              </div>
              
              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tu correo"
                  required
                  disabled={isEditing}
                />
              </div>
              
              {/* Asistencia */}
              <div>
                <p 
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  ¿Asistirás? *
                </p>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={attending === true}
                      onChange={() => setAttending(true)}
                      className="h-4 w-4"
                      disabled={isEditing}
                    />
                    <span 
                      className="ml-2"
                      style={{ color: textColor }}
                    >
                      Sí, asistiré
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={attending === false}
                      onChange={() => setAttending(false)}
                      className="h-4 w-4"
                      disabled={isEditing}
                    />
                    <span 
                      className="ml-2"
                      style={{ color: textColor }}
                    >
                      No podré asistir
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Invitados adicionales */}
              {showAdditionalGuests && attending === true && (
                <div>
                  <label 
                    htmlFor="guestCount" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: textColor }}
                  >
                    Número de acompañantes (máximo {maxAdditionalGuests})
                  </label>
                  <select
                    id="guestCount"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isEditing}
                  >
                    {Array.from({ length: maxAdditionalGuests + 1 }, (_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Restricciones alimentarias */}
              {includeDietaryRestrictions && attending === true && (
                <div>
                  <label 
                    htmlFor="dietaryRestrictions" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: textColor }}
                  >
                    Restricciones alimentarias o alergias
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Vegetariano, vegano, sin gluten, etc."
                    disabled={isEditing}
                  />
                </div>
              )}
              
              {/* Comentarios adicionales */}
              {includeComments && (
                <div>
                  <label 
                    htmlFor="comments" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: textColor }}
                  >
                    Comentarios adicionales
                  </label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Si tienes algún comentario o mensaje para los anfitriones"
                    disabled={isEditing}
                  />
                </div>
              )}
              
              {/* Botón de envío */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  style={{ 
                    backgroundColor: buttonColor,
                    color: buttonTextColor
                  }}
                  disabled={isEditing}
                >
                  Confirmar asistencia
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
      
      {/* Modo de edición: marcadores */}
      {isEditing && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Attendance Section
        </div>
      )}
    </section>
  );
};

// Exportar propiedades disponibles para el editor
export const configurableProperties = createConfigurableProperties(attendanceSchema);

export default ConfigurableAttendance;
