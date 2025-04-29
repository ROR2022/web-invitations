# Resumen del Funcionamiento de Invitaciones Interactivas

## Proceso de Creación
1. Registro e inicio de sesión con Supabase.
2. Selección de paquete (BÁSICA, PREMIUM, VIP).
3. Elección de plantilla según el evento.
4. Personalización según las características del paquete.
5. Pago mediante MercadoPago.
6. Entrega de la invitación personalizada.

## Niveles de Personalización
- **BÁSICA ($499)**: Textos básicos, colores limitados, cuenta regresiva, confirmación de asistencia, etc.
- **PREMIUM ($699)**: Todo lo de BÁSICA + música, galería, padrinos.
- **VIP ($899)**: Todo lo de PREMIUM + hospedaje, itinerario, 5 pases de invitados.

## Integración de MercadoPago
- Redirección a pasarela de pago tras personalización.
- Confirmación automática vía API para entrega inmediata.

## Autenticación
- Registro obligatorio con correo y contraseña vía Supabase.

## Tipos de Eventos
- Bodas, cumpleaños, XV años, bautizos, eventos corporativos, etc.

## Panel de Administración
- Gestión de paquetes y plantillas por parte del administrador.