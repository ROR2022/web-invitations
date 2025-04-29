# 4. Arquitectura Técnica

## Tecnologías y Herramientas

### Frontend
- **Next.js**: Framework de React utilizado para el desarrollo del frontend y la implementación de rutas de API, aprovechando el renderizado del lado del servidor y la generación estática para mejorar el rendimiento.
- **React**: Biblioteca JavaScript para construir interfaces de usuario interactivas.
- **Tailwind CSS**: Framework de utilidades CSS para el diseño responsivo y personalización visual.
- **Shadcn**: Biblioteca de componentes UI reutilizables basados en Radix UI, proporcionando elementos accesibles y altamente personalizables.
- **Lucide React**: Biblioteca de iconos utilizada para la interfaz gráfica.

### Backend
- **Next.js API Routes**: Para la implementación de endpoints del backend.
- **Supabase**: Plataforma de desarrollo que proporciona:
  - Base de datos PostgreSQL para almacenar usuarios, plantillas, invitaciones y configuraciones.
  - Sistema de autenticación para registro e inicio de sesión de usuarios.
  - Almacenamiento de archivos para imágenes y multimedia de las invitaciones.
  - Funciones Edge para lógica específica del servidor.

### Procesamiento de Pagos
- **MercadoPago**: API de pagos integrada para procesar transacciones, generando checkouts personalizados y gestionando notificaciones de pagos exitosos.

### Comunicaciones
- **Resend**: Servicio para el envío de correos electrónicos transaccionales y notificaciones a usuarios.

## Diagrama de Arquitectura

```
┌─────────────────────────────┐
│        Cliente/Navegador    │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│          Next.js App        │
│  ┌─────────────────────┐    │
│  │  Componentes React  │    │
│  │  (Tailwind/Shadcn)  │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │    API Routes       │    │
│  └──────────┬──────────┘    │
└─────────────┼───────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌────────────┐    ┌────────────┐    ┌────────────┐
│  Supabase  │    │MercadoPago │    │   Resend   │
│ Auth & DB  │    │  Payment   │    │   Email    │
└────────────┘    └────────────┘    └────────────┘
```

## Justificación de Tecnologías

- **Next.js**: Seleccionado por su capacidad de renderizado híbrido, optimizaciones de rendimiento, y la combinación de frontend y backend en un solo proyecto, simplificando la arquitectura y el despliegue.

- **Supabase**: Elegido como alternativa a Firebase por:
  - Base de datos PostgreSQL que ofrece mayor flexibilidad en comparación con soluciones NoSQL.
  - Sistema de autenticación integrado con manejo de sesiones y permisos.
  - Almacenamiento de archivos optimizado para contenido multimedia.
  - Integración nativa con Next.js y ecosistema React.
  - Reducción de complejidad al proporcionar múltiples servicios en una sola plataforma.

- **MercadoPago**: Seleccionado por:
  - Alta adopción en el mercado latinoamericano, especialmente México.
  - Múltiples opciones de pago para los usuarios finales.
  - API robusta y bien documentada.
  - Comisiones competitivas en el mercado.
  - Gestión automática de webhooks para notificaciones de pagos.

- **Tailwind CSS + Shadcn**: Combinación elegida por:
  - Desarrollo rápido de interfaces mediante utilidades CSS.
  - Componentes accesibles y personalizables que mantienen la consistencia visual.
  - Optimización de tamaño de bundle mediante purging de clases no utilizadas.
  - Mayor control sobre el diseño en comparación con bibliotecas de componentes monolíticas.

- **Resend**: Implementado para:
  - Alta entregabilidad de correos electrónicos.
  - Plantillas HTML responsivas.
  - Seguimiento de métricas de entrega y apertura.
  - Integración sencilla con Next.js a través de su SDK.

## Configuraciones Técnicas Específicas

### Supabase
- **Estructura de Tablas Principales**:
  - `users`: Información de usuario y autenticación
  - `packages`: Detalles de los paquetes disponibles
  - `templates`: Plantillas de invitaciones categorizadas por evento
  - `invitations`: Invitaciones creadas por los usuarios
  - `attendees`: Confirmaciones de asistencia de invitados

### MercadoPago
- Implementación de checkout personalizado mediante API
- Webhooks configurados para manejar eventos de pago:
  - `payment.created`: Cuando se crea un pago
  - `payment.approved`: Cuando se aprueba un pago
  - `payment.rejected`: Cuando se rechaza un pago

### Next.js
- Estructura de carpetas:
  - `/app`: Componentes y rutas de la aplicación
  - `/components`: Componentes reutilizables
  - `/lib`: Utilidades y funciones comunes
  - `/public`: Archivos estáticos
- Implementación de middleware para protección de rutas
- Uso de Server Components para optimizar rendimiento