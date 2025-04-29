import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | Invitaciones Interactivas',
  description: 'Términos y condiciones de uso para los usuarios de Invitaciones Interactivas',
};

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Términos y Condiciones</h1>
        
        <div className="prose prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground max-w-none">
          <p className="text-lg mb-6">
            Última actualización: 25 de abril de 2025
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
            <p>
              Estos Términos y Condiciones rigen el uso de Invitaciones Interactivas, accesible desde invitacionesinteractivas.mx. Al utilizar nuestro servicio, aceptas cumplir con estos términos. Por favor, léelos detenidamente antes de utilizar nuestra plataforma.
            </p>
            <p>
              Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Definiciones</h2>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>&quot;Servicio&quot;</strong> se refiere a la plataforma Invitaciones Interactivas.</li>
              <li><strong>&quot;Usuario&quot;</strong> se refiere a la persona que se registra en nuestra plataforma para utilizar el Servicio.</li>
              <li><strong>&quot;Invitados&quot;</strong> se refiere a las personas que reciben y visualizan las invitaciones creadas por los Usuarios.</li>
              <li><strong>&quot;Contenido del Usuario&quot;</strong> se refiere a cualquier texto, imagen, música u otro material que el Usuario sube o introduce en el Servicio.</li>
              <li><strong>&quot;Invitación&quot;</strong> se refiere al producto digital final creado mediante nuestra plataforma.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cuentas de Usuario</h2>
            <p>
              Para utilizar ciertos aspectos de nuestro servicio, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, y aceptas la responsabilidad de todas las actividades que ocurran bajo tu cuenta.
            </p>
            <p>
              Debes proporcionar información precisa, completa y actualizada durante el proceso de registro y mantener actualizada esta información. El uso de información falsa o la suplantación de identidad de otra persona u organización podría resultar en la terminación inmediata de tu cuenta.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Paquetes y Pagos</h2>
            <p>
              Ofrecemos diferentes paquetes (BÁSICA, PREMIUM, VIP) con distintas características y precios. Al seleccionar un paquete y proceder al pago, aceptas abonar la cantidad correspondiente.
            </p>
            <p>
              Todos los pagos se procesan a través de MercadoPago y están sujetos a sus términos de servicio. No almacenamos datos completos de tarjetas de crédito en nuestros servidores.
            </p>
            <p>
              Una vez completado el pago, tendrás acceso inmediato a las características del paquete seleccionado. Los pagos realizados no son reembolsables, excepto en circunstancias específicas detalladas en nuestra política de reembolsos.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
            <h3 className="text-xl font-semibold mb-2">5.1 Nuestro Contenido</h3>
            <p>
              El Servicio y su contenido original, características y funcionalidad son propiedad de Invitaciones Interactivas y están protegidos por derechos de autor, marcas registradas, patentes, secretos comerciales y otras leyes de propiedad intelectual.
            </p>
            <p>
              Las plantillas proporcionadas por nuestro servicio están licenciadas, no vendidas. La compra de un paquete te otorga el derecho a utilizar la plantilla seleccionada para crear tu invitación personal, pero no te transfiere la propiedad de la plantilla.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">5.2 Contenido del Usuario</h3>
            <p>
              Mantienes todos los derechos sobre el Contenido del Usuario que publicas en nuestro Servicio. Al publicar Contenido del Usuario, nos otorgas una licencia mundial, no exclusiva, libre de regalías para usar, reproducir, procesar, adaptar, publicar, transmitir y mostrar dicho contenido únicamente con el propósito de proporcionar el Servicio.
            </p>
            <p>
              Declaras y garantizas que: (i) eres propietario del Contenido del Usuario o tienes derecho a usarlo y otorgarnos los derechos y licencias establecidos en estos Términos, y (ii) la publicación de tu Contenido del Usuario no viola los derechos de privacidad, derechos de publicidad, derechos de autor, derechos contractuales o cualquier otro derecho de cualquier persona.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contenido Prohibido</h2>
            <p>
              No puedes usar nuestro Servicio para ningún propósito ilegal o no autorizado. No puedes publicar contenido que:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Sea ilegal, dañino, amenazante, abusivo, acosador, difamatorio, vulgar, obsceno, calumnioso o invasivo de la privacidad de otra persona.</li>
              <li>Infrinja cualquier patente, marca registrada, secreto comercial, derecho de autor u otro derecho de propiedad intelectual.</li>
              <li>Contenga software malicioso, código, archivos o programas diseñados para interrumpir, dañar o limitar el funcionamiento de cualquier software o hardware.</li>
              <li>Recopile o almacene información personal de otros usuarios sin su consentimiento.</li>
              <li>Promueva actividades ilegales o conductas abusivas, amenazantes, obscenas, difamatorias o calumniosas.</li>
            </ul>
            <p>
              Nos reservamos el derecho a eliminar cualquier Contenido del Usuario que consideremos que viola estas restricciones, y a terminar tu acceso al Servicio.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Uso del Servicio</h2>
            <p>
              Nuestro servicio está diseñado para crear invitaciones digitales para eventos personales. No está permitido:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Utilizar técnicas de ingeniería inversa, descompilar o desensamblar cualquier parte del Servicio.</li>
              <li>Eludir, deshabilitar o interferir con características relacionadas con la seguridad del Servicio.</li>
              <li>Utilizar robots, arañas o cualquier otro dispositivo, proceso o medio automático para acceder al Servicio.</li>
              <li>Introducir virus, troyanos, gusanos, bombas lógicas o cualquier otro material malicioso o tecnológicamente dañino.</li>
              <li>Intentar obtener acceso no autorizado, interferir, dañar o interrumpir partes del Servicio, el servidor en el que se almacena o cualquier servidor, computadora o base de datos conectada al Servicio.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitación de Responsabilidad</h2>
            <p>
              Invitaciones Interactivas y sus directores, empleados, socios, agentes, proveedores o afiliados no serán responsables por:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Cualquier pérdida o daño indirecto, incidental, especial, consecuente o punitivo, incluyendo sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de tu acceso o uso o incapacidad para acceder o usar el Servicio.</li>
              <li>Cualquier conducta o contenido de terceros en el Servicio, incluyendo sin limitación, cualquier contenido difamatorio, ofensivo o ilegal.</li>
              <li>Acceso no autorizado, uso o alteración de tus transmisiones o contenido.</li>
              <li>Errores o omisiones en cualquier contenido o por cualquier pérdida o daño incurrido como resultado del uso de cualquier contenido publicado, enviado por correo electrónico, transmitido o de otro modo disponible a través del Servicio.</li>
              <li>La disponibilidad, retrasos, errores de entrega o no entrega de las invitaciones debido a problemas técnicos fuera de nuestro control razonable.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnización</h2>
            <p>
              Aceptas defender, indemnizar y mantener indemne a Invitaciones Interactivas y sus licenciantes, afiliados y sus respectivos directores, funcionarios, empleados y agentes de y contra cualquier reclamo, daño, obligación, pérdida, responsabilidad, costo o deuda, y gastos (incluidos, entre otros, honorarios de abogados) que surjan de: (i) tu uso y acceso al Servicio; (ii) tu violación de cualquier término de estos Términos; (iii) tu violación de cualquier derecho de terceros, incluidos, entre otros, cualquier derecho de autor, propiedad o derecho de privacidad; o (iv) cualquier reclamo de que tu Contenido del Usuario causó daño a un tercero.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho a modificar o descontinuar, temporal o permanentemente, el Servicio o cualquier característica o parte del mismo sin previo aviso. No seremos responsables ante ti ni ante terceros por cualquier modificación, suspensión o interrupción del Servicio.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Modificaciones de los Términos</h2>
            <p>
              Podemos revisar y actualizar estos Términos de vez en cuando a nuestra exclusiva discreción. Todos los cambios son efectivos inmediatamente cuando los publicamos y se aplican a todo acceso y uso del Servicio a partir de entonces.
            </p>
            <p>
              Tu uso continuado del Servicio después de la publicación de los Términos revisados significa que aceptas y consientes los cambios. Se espera que revises esta página con frecuencia para estar al tanto de cualquier cambio.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Ley Aplicable</h2>
            <p>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de México, sin dar efecto a ningún principio de conflictos de leyes.
            </p>
            <p>
              Cualquier disputa legal que surja de o en relación con estos Términos o el Servicio estará sujeta a la jurisdicción exclusiva de los tribunales de la Ciudad de México.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Separabilidad</h2>
            <p>
              Si alguna disposición de estos Términos se considera inválida, ilegal o inaplicable por cualquier razón por un tribunal o otra autoridad competente, dicha disposición se eliminará o limitará al mínimo de modo que las disposiciones restantes continúen en pleno vigor y efecto.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Renuncia</h2>
            <p>
              Ninguna renuncia por parte de la Compañía a cualquier término o condición establecida en estos Términos será considerada como una renuncia adicional o continua de dicho término o condición o una renuncia a cualquier otro término o condición, y cualquier falla de la Compañía para hacer valer un derecho o disposición bajo estos Términos no constituirá una renuncia a tal derecho o disposición.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Por correo electrónico: legal@invitacionesinteractivas.mx</li>
              <li>Por WhatsApp: +52 55 1234 5678</li>
              <li>Por correo postal: [Dirección física de la empresa]</li>
            </ul>
          </section>
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
