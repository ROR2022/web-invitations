import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Cookies | Invitaciones Interactivas',
  description: 'Información sobre cómo utilizamos cookies en Invitaciones Interactivas',
};

const CookiesPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Política de Cookies</h1>
        
        <div className="prose prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground max-w-none">
          <p className="text-lg mb-6">
            Última actualización: 25 de abril de 2025
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet, teléfono móvil) cuando visitas determinados sitios web. Las cookies nos permiten reconocer tu dispositivo y recordar información sobre tu visita (por ejemplo, tu idioma preferido, el tamaño de fuente y otras preferencias).
            </p>
            <p>
              Las cookies no son dañinas y no contienen ningún tipo de virus o malware. Son una tecnología estándar que la mayoría de los sitios web utilizan para mejorar la experiencia de navegación, analizar el tráfico y personalizar el contenido.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Tipos de cookies que utilizamos</h2>
            <p>
              En Invitaciones Interactivas utilizamos los siguientes tipos de cookies:
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Cookies esenciales</h3>
            <p>
              Estas cookies son necesarias para el funcionamiento de nuestro sitio web y no pueden ser desactivadas en nuestros sistemas. Generalmente solo se configuran en respuesta a acciones realizadas por ti, como establecer tus preferencias de privacidad, iniciar sesión o completar formularios.
            </p>
            <p>
              Puedes configurar tu navegador para bloquear estas cookies, pero algunas partes del sitio no funcionarán correctamente.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Cookies de rendimiento</h3>
            <p>
              Estas cookies nos permiten contar las visitas y fuentes de tráfico para que podamos medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares y ver cómo navegan los visitantes por el sitio.
            </p>
            <p>
              Toda la información que recogen estas cookies es agregada y, por lo tanto, anónima. Si no permites estas cookies, no sabremos cuándo has visitado nuestro sitio.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">2.3 Cookies de funcionalidad</h3>
            <p>
              Estas cookies permiten que el sitio proporcione una funcionalidad y personalización mejoradas. Pueden ser establecidas por nosotros o por proveedores externos cuyos servicios hemos agregado a nuestras páginas.
            </p>
            <p>
              Si no permites estas cookies, es posible que algunos o todos estos servicios no funcionen correctamente.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">2.4 Cookies de publicidad</h3>
            <p>
              Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. Pueden ser utilizadas por estas empresas para construir un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios.
            </p>
            <p>
              No almacenan directamente información personal, sino que se basan en la identificación única de tu navegador y dispositivo de internet. Si no permites estas cookies, experimentarás publicidad menos dirigida.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">2.5 Cookies de terceros</h3>
            <p>
              Nuestro sitio incluye funcionalidades proporcionadas por terceros, como botones para compartir contenido en redes sociales o videos incrustados. Estos terceros pueden colocar cookies en tu dispositivo cuando utilizas nuestra plataforma.
            </p>
            <p>
              No tenemos control sobre estas cookies de terceros. Te recomendamos consultar las políticas de privacidad de estos servicios para entender cómo utilizan las cookies.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cookies específicas que utilizamos</h2>
            <p>
              Estas son algunas de las principales cookies que utilizamos en Invitaciones Interactivas:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full mt-4 border-collapse">
                <thead>
                  <tr className="bg-secondary/30">
                    <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Propósito</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">supabase-auth-token</td>
                    <td className="border border-gray-300 px-4 py-2">Esencial</td>
                    <td className="border border-gray-300 px-4 py-2">Autenticación y gestión de sesiones</td>
                    <td className="border border-gray-300 px-4 py-2">Sesión</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">next-auth.session-token</td>
                    <td className="border border-gray-300 px-4 py-2">Esencial</td>
                    <td className="border border-gray-300 px-4 py-2">Mantener el estado de sesión del usuario</td>
                    <td className="border border-gray-300 px-4 py-2">2 semanas</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">_ga</td>
                    <td className="border border-gray-300 px-4 py-2">Rendimiento</td>
                    <td className="border border-gray-300 px-4 py-2">Google Analytics - Distinguir usuarios</td>
                    <td className="border border-gray-300 px-4 py-2">2 años</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">_gid</td>
                    <td className="border border-gray-300 px-4 py-2">Rendimiento</td>
                    <td className="border border-gray-300 px-4 py-2">Google Analytics - Distinguir usuarios</td>
                    <td className="border border-gray-300 px-4 py-2">24 horas</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">mp_*</td>
                    <td className="border border-gray-300 px-4 py-2">Funcionalidad</td>
                    <td className="border border-gray-300 px-4 py-2">MercadoPago - Procesamiento de pagos</td>
                    <td className="border border-gray-300 px-4 py-2">Sesión</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">theme</td>
                    <td className="border border-gray-300 px-4 py-2">Funcionalidad</td>
                    <td className="border border-gray-300 px-4 py-2">Almacenar preferencias de tema (claro/oscuro)</td>
                    <td className="border border-gray-300 px-4 py-2">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. ¿Cómo administrar las cookies?</h2>
            <p>
              La mayoría de los navegadores web permiten controlar las cookies a través de sus preferencias de configuración. A continuación, te explicamos cómo gestionar las cookies en los navegadores más populares:
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Google Chrome</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>Haz clic en el menú de Chrome en la barra de herramientas.</li>
              <li>Selecciona &quot;Configuración&quot;.</li>
              <li>Haz clic en &quot;Privacidad y seguridad&quot;.</li>
              <li>Haz clic en &quot;Cookies y otros datos de sitios&quot;.</li>
              <li>Aquí puedes elegir bloquear todas las cookies o configuraciones más específicas.</li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Mozilla Firefox</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>Haz clic en el menú de Firefox en la barra de herramientas.</li>
              <li>Selecciona &quot;Opciones&quot; o &quot;Preferencias&quot;.</li>
              <li>Haz clic en &quot;Privacidad y seguridad&quot;.</li>
              <li>En la sección &quot;Cookies y datos del sitio&quot;, puedes elegir las configuraciones deseadas.</li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Safari</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>Haz clic en &quot;Safari&quot; en la barra de menú.</li>
              <li>Selecciona &quot;Preferencias&quot;.</li>
              <li>Haz clic en la pestaña &quot;Privacidad&quot;.</li>
              <li>En la sección &quot;Cookies y datos de sitios web&quot;, configura tus preferencias.</li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Microsoft Edge</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>Haz clic en el menú de Edge en la barra de herramientas.</li>
              <li>Selecciona &quot;Configuración&quot;.</li>
              <li>Haz clic en &quot;Privacidad, búsqueda y servicios&quot;.</li>
              <li>En &quot;Cookies&quot;, elige el nivel de control deseado.</li>
            </ol>
            
            <p className="mt-4">
              Ten en cuenta que al restringir las cookies, es posible que algunas funciones de nuestro sitio web no funcionen correctamente.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies y tu privacidad</h2>
            <p>
              La información recopilada a través de las cookies se utiliza de acuerdo con nuestra <Link href="/privacy" className="text-primary hover:underline">Política de Privacidad</Link>. 
            </p>
            <p>
              No utilizamos cookies para recopilar información personal identificable sin tu consentimiento explícito. Sin embargo, algunas cookies de rendimiento y funcionalidad pueden recopilar información anónima que, en combinación con otra información, podría permitir la identificación de usuarios individuales.
            </p>
            <p>
              Si tienes alguna pregunta sobre nuestro uso de cookies, por favor contáctanos utilizando la información proporcionada al final de esta política.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cambios en nuestra política de cookies</h2>
            <p>
              Podemos actualizar nuestra política de cookies de vez en cuando para reflejar cambios en nuestras prácticas o por otros motivos operativos, legales o regulatorios. Te recomendamos visitar esta página periódicamente para estar al tanto de cualquier cambio.
            </p>
            <p>
              La fecha de &quot;última actualización&quot; al principio de esta política indica cuándo se revisó por última vez.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contacto</h2>
            <p>
              Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Por correo electrónico: privacy@invitacionesinteractivas.mx</li>
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

export default CookiesPage;
