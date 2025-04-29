import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | Invitaciones Interactivas',
  description: 'Política de privacidad y protección de datos para los usuarios de Invitaciones Interactivas',
};

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Política de Privacidad</h1>
        
        <div className="prose prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground max-w-none">
          <p className="text-lg mb-6">
            Última actualización: 25 de abril de 2025
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
            <p>
              En Invitaciones Interactivas, accesible desde invitacionesinteractivas.mx, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Esta Política de Privacidad documenta los tipos de información que recopilamos y registramos y cómo la utilizamos.
            </p>
            <p>
              Si tienes preguntas adicionales o requieres más información sobre nuestra Política de Privacidad, no dudes en contactarnos a través de correo electrónico a privacy@invitacionesinteractivas.mx.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Información que recopilamos</h2>
            <p>
              Para proporcionar y mejorar nuestros servicios, recopilamos varios tipos de información:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Información de registro:</strong> Cuando creas una cuenta, recopilamos tu dirección de correo electrónico, nombre completo y contraseña encriptada.
              </li>
              <li>
                <strong>Información de perfil:</strong> Puedes proporcionar información adicional como número de teléfono.
              </li>
              <li>
                <strong>Contenido generado por el usuario:</strong> Recopilamos la información que proporcionas al crear invitaciones, incluyendo textos, imágenes, música y otros elementos multimedia.
              </li>
              <li>
                <strong>Información sobre invitados:</strong> Cuando tus invitados confirman su asistencia, recopilamos nombres, correos electrónicos y preferencias según las opciones que hayas configurado.
              </li>
              <li>
                <strong>Información de pago:</strong> Cuando realizas un pago, nuestro procesador de pagos (MercadoPago) recopila la información necesaria para procesar la transacción. No almacenamos datos completos de tarjetas de crédito en nuestros servidores.
              </li>
              <li>
                <strong>Información técnica:</strong> Recopilamos automáticamente información sobre tu dispositivo, navegador, dirección IP y patrones de uso cuando interactúas con nuestro sitio.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cómo utilizamos tu información</h2>
            <p>
              Utilizamos la información que recopilamos para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Proporcionar, mantener y mejorar nuestros servicios</li>
              <li>Crear y personalizar las invitaciones según tus preferencias</li>
              <li>Procesar pagos y enviar confirmaciones</li>
              <li>Enviar notificaciones relacionadas con tu cuenta o invitaciones</li>
              <li>Analizar el uso de nuestro servicio para mejorar la experiencia del usuario</li>
              <li>Prevenir actividades fraudulentas y proteger la seguridad de nuestros usuarios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Compartición de información</h2>
            <p>
              Podemos compartir tu información en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Con proveedores de servicios:</strong> Trabajamos con terceros que nos ayudan a operar nuestro servicio, como proveedores de alojamiento (Supabase), procesadores de pago (MercadoPago) y servicios de análisis.
              </li>
              <li>
                <strong>Con invitados:</strong> La información incluida en tus invitaciones será compartida con las personas a quienes tú decidas enviar el enlace de invitación.
              </li>
              <li>
                <strong>Por requisitos legales:</strong> Podemos divulgar información si estamos obligados por ley o en respuesta a solicitudes legales válidas.
              </li>
            </ul>
            <p>
              No vendemos tu información personal a terceros.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies y tecnologías similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio, entender cómo interactúas con nuestros servicios y mostrar publicidad relevante.
            </p>
            <p>
              Puedes configurar tu navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie. Sin embargo, si no aceptas cookies, es posible que no puedas utilizar algunas partes de nuestro servicio.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Seguridad de datos</h2>
            <p>
              Implementamos medidas de seguridad diseñadas para proteger tu información personal, incluyendo:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encriptación de datos sensibles</li>
              <li>Almacenamiento seguro mediante Supabase con Row Level Security (RLS)</li>
              <li>Acceso restringido a la información personal por parte de nuestros empleados</li>
              <li>Protocolos de transmisión segura mediante HTTPS</li>
            </ul>
            <p>
              A pesar de nuestros esfuerzos, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Tus derechos</h2>
            <p>
              Dependiendo de tu ubicación, puedes tener determinados derechos con respecto a tu información personal:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Eliminar tu información en determinadas circunstancias</li>
              <li>Oponerte al procesamiento de tu información</li>
              <li>Portar tu información a otro servicio</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, contáctanos a privacy@invitacionesinteractivas.mx.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Retención de datos</h2>
            <p>
              Conservamos tu información personal durante el tiempo que sea necesario para proporcionarte nuestros servicios y cumplir con nuestras obligaciones legales. Cuando ya no necesitemos usar tu información y no estemos obligados a conservarla por razones legales, la eliminaremos de nuestros sistemas o la anonimizaremos.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Menores de edad</h2>
            <p>
              Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos a sabiendas información personal de niños. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos para que podamos tomar las medidas adecuadas.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Cambios a esta política</h2>
            <p>
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y, si los cambios son significativos, te enviaremos una notificación por correo electrónico.
            </p>
            <p>
              Te recomendamos revisar esta Política de Privacidad periódicamente para cualquier cambio.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Por correo electrónico: privacy@invitacionesinteractivas.mx</li>
              <li>Por WhatsApp: +52 55 1234 5678</li>
              <li>Por correo postal: [Dirección física de la empresa]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
