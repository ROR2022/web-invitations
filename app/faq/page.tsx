import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Invitaciones Interactivas',
  description: 'Encuentra respuestas a las preguntas más comunes sobre nuestros servicios de invitaciones digitales interactivas.'
};

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Preguntas Frecuentes</h1>
        
        <div className="space-y-10 prose prose-headings:text-foreground prose-p:text-foreground/90 max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Sobre Nuestro Servicio</h2>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Qué es Invitaciones Interactivas?</h3>
                <p className="text-card-foreground">
                  Somos una plataforma que te permite crear invitaciones digitales personalizadas para cualquier tipo de evento (bodas, XV años, bautizos, eventos corporativos, etc.) con características interactivas como confirmación de asistencia, galería de fotos, cuenta regresiva y mucho más.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Necesito tener conocimientos técnicos para crear mi invitación?</h3>
                <p className="text-card-foreground">
                  ¡No! Nuestro sistema está diseñado para ser muy fácil de usar. Solo necesitas seleccionar una plantilla, completar la información de tu evento y personalizar los detalles según tus preferencias. El proceso es intuitivo y no requiere conocimientos de diseño o programación.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Cómo puedo ver cómo quedará mi invitación?</h3>
                <p className="text-card-foreground">
                  Durante todo el proceso de personalización, tendrás acceso a una vista previa en tiempo real que te mostrará exactamente cómo se verá tu invitación. Además, antes de realizar el pago, podrás revisar una versión completa para asegurarte de que todo esté perfecto.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Paquetes y Precios</h2>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Qué paquetes ofrecen y cuáles son sus precios?</h3>
                <p className="text-card-foreground">
                  Ofrecemos tres paquetes principales:
                </p>
                <ul className="list-disc pl-6 mt-2 text-card-foreground">
                  <li><strong>Básica ($499 MXN):</strong> Incluye textos básicos, colores limitados, cuenta regresiva, confirmación de asistencia y otras funciones esenciales.</li>
                  <li><strong>Premium ($699 MXN):</strong> Todo lo de Básica + música personalizada, galería de fotos y sección de padrinos.</li>
                  <li><strong>VIP ($899 MXN):</strong> Todo lo de Premium + información de hospedaje, itinerario detallado y hasta 5 pases para invitados especiales.</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Tienen un límite de invitados?</h3>
                <p className="text-card-foreground">
                  No, no hay límite en el número de personas que pueden recibir y ver tu invitación. Puedes compartir el enlace con todos tus invitados sin costo adicional. Lo que varía entre los paquetes son las características disponibles, no la cantidad de invitados.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Puedo cambiar de paquete después de haber pagado?</h3>
                <p className="text-card-foreground">
                  Si deseas actualizar a un paquete superior, puedes hacerlo pagando solo la diferencia. Sin embargo, no ofrecemos reembolsos por cambios a paquetes inferiores. Recomendamos que evalúes cuidadosamente tus necesidades antes de realizar la compra.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Personalización</h2>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Puedo usar mis propias fotos y música?</h3>
                <p className="text-card-foreground">
                  ¡Sí! Los paquetes Premium y VIP te permiten subir tus propias fotos para la galería. El paquete Premium incluye la opción de subir un archivo de música MP3 para ambientar tu invitación. Asegúrate de tener los derechos de uso de cualquier contenido que subas.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Qué tipo de personalizaciones puedo hacer?</h3>
                <p className="text-card-foreground">
                  Dependiendo del paquete, puedes personalizar:
                </p>
                <ul className="list-disc pl-6 mt-2 text-card-foreground">
                  <li>Textos (nombres, fechas, ubicaciones, mensajes personalizados)</li>
                  <li>Colores y estilos</li>
                  <li>Imágenes y fotos</li>
                  <li>Música de fondo</li>
                  <li>Secciones específicas (cuenta regresiva, mapa, confirmación de asistencia)</li>
                  <li>Información de hospedaje e itinerario (paquete VIP)</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Puedo editar mi invitación después de publicarla?</h3>
                <p className="text-card-foreground">
                  Sí, puedes editar tu invitación en cualquier momento, incluso después de haberla compartido con tus invitados. Los cambios se reflejarán instantáneamente para todos los que accedan al enlace. Esto es especialmente útil si necesitas actualizar información como horarios o ubicaciones.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Pago y Entrega</h2>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Qué métodos de pago aceptan?</h3>
                <p className="text-card-foreground">
                  Procesamos todos los pagos a través de MercadoPago, que ofrece una amplia variedad de opciones:
                </p>
                <ul className="list-disc pl-6 mt-2 text-card-foreground">
                  <li>Tarjetas de crédito y débito (Visa, Mastercard, American Express)</li>
                  <li>Transferencia bancaria</li>
                  <li>Pago en efectivo mediante tiendas de conveniencia</li>
                  <li>Saldo de MercadoPago</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Cuánto tiempo después del pago puedo recibir mi invitación?</h3>
                <p className="text-card-foreground">
                  Tu invitación estará lista y disponible inmediatamente después de confirmar el pago. Una vez que el sistema recibe la confirmación de MercadoPago, tendrás acceso completo a tu invitación personalizada y podrás comenzar a compartirla con tus invitados.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Ofrecen reembolsos?</h3>
                <p className="text-card-foreground">
                  Debido a la naturaleza digital de nuestro producto, no ofrecemos reembolsos una vez que hayas accedido a tu invitación completa. Sin embargo, si experimentas problemas técnicos con nuestra plataforma, contáctanos dentro de las primeras 24 horas y evaluaremos tu caso particular.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Compartir y Confirmar Asistencia</h2>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Cómo puedo compartir mi invitación?</h3>
                <p className="text-card-foreground">
                  Una vez finalizada tu invitación, recibirás un enlace único que puedes compartir a través de cualquier plataforma:
                </p>
                <ul className="list-disc pl-6 mt-2 text-card-foreground">
                  <li>WhatsApp</li>
                  <li>Correo electrónico</li>
                  <li>Redes sociales (Facebook, Instagram, etc.)</li>
                  <li>Mensajes de texto</li>
                </ul>
                <p className="mt-2 text-card-foreground">
                  También ofrecemos botones directos para compartir en las plataformas más populares desde tu panel de control.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Cómo funciona la confirmación de asistencia?</h3>
                <p className="text-card-foreground">
                  Tu invitación incluye un formulario donde los invitados pueden confirmar su asistencia indicando:
                </p>
                <ul className="list-disc pl-6 mt-2 text-card-foreground">
                  <li>Nombre completo</li>
                  <li>Si asistirán o no</li>
                  <li>Número de acompañantes (si lo permites)</li>
                  <li>Comentarios o mensajes opcionales</li>
                </ul>
                <p className="mt-2 text-card-foreground">
                  Tú recibirás estas confirmaciones en tiempo real en tu panel de control y podrás descargar un reporte completo en formato Excel.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Cuánto tiempo estará disponible mi invitación?</h3>
                <p className="text-card-foreground">
                  Tu invitación permanecerá activa durante un año completo desde la fecha de compra. Después de este período, podrás renovar su disponibilidad por un costo adicional si lo deseas.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Soporte Técnico</h2>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Qué hago si tengo problemas con mi invitación?</h3>
                <p className="text-card-foreground">
                  Contamos con un equipo de soporte técnico disponible para ayudarte. Puedes contactarnos a través de:
                </p>
                <ul className="list-disc pl-6 mt-2 text-card-foreground">
                  <li>Chat en vivo (disponible en horario laboral)</li>
                  <li>Correo electrónico: soporte@invitacionesinteractivas.mx</li>
                  <li>WhatsApp: +52 55 1234 5678</li>
                </ul>
                <p className="mt-2 text-card-foreground">
                  Nuestro tiempo de respuesta habitual es de menos de 24 horas.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿La invitación funciona en todos los dispositivos?</h3>
                <p className="text-card-foreground">
                  Sí, nuestras invitaciones son 100% responsivas y funcionan perfectamente en smartphones, tablets y computadoras. No importa desde qué dispositivo accedan tus invitados, la experiencia será óptima. Recomendamos usar navegadores actualizados para la mejor experiencia.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">¿Ofrecen asistencia para personalizar mi invitación?</h3>
                <p className="text-card-foreground">
                  Si bien nuestro sistema está diseñado para ser intuitivo, entendemos que algunas personalizaciones pueden ser más complejas. Los usuarios del paquete VIP tienen acceso a asistencia personalizada vía WhatsApp para resolver dudas específicas sobre su invitación.
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="mt-12 text-center">
          <p className="mb-6 text-foreground/80">
            ¿No encontraste respuesta a tu pregunta? Contáctanos directamente:
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="mailto:contacto@invitacionesinteractivas.mx"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Enviar Email
            </Link>
            <Link 
              href="https://wa.me/5212345678"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
