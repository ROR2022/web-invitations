
# 6. Flujos de Usuario

## Flujo Principal: Creación de Invitación

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Registro/  │     │  Selección  │     │  Selección  │     │Personaliza- │     │    Pago     │     │   Entrega   │
│   Login     ├────►│  de Paquete ├────►│ de Plantilla├────►│    ción     ├────►│  MercadoPago├────►│ y Compartir │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 1. Registro e Inicio de Sesión

**Acciones del usuario:**
- Visita la página principal
- Hace clic en "Registrarse" o "Iniciar Sesión"
- Para registro: proporciona email, contraseña y nombre completo
- Para inicio de sesión: ingresa email y contraseña

**Respuesta del sistema:**
- Valida las credenciales
- Crea cuenta de usuario (si es registro)
- Autentica al usuario a través de Supabase
- Redirige al panel de usuario

### 2. Selección de Paquete

**Acciones del usuario:**
- Visualiza los tres paquetes disponibles (BÁSICA, PREMIUM, VIP)
- Revisa precios y características de cada paquete
- Selecciona un paquete haciendo clic en su botón correspondiente

**Respuesta del sistema:**
- Destaca el paquete seleccionado
- Actualiza la interfaz para mostrar sólo las plantillas disponibles para ese paquete
- Guarda temporalmente la selección del usuario

### 3. Selección de Plantilla

**Acciones del usuario:**
- Filtra plantillas por tipo de evento (bodas, XV años, bautizos, etc.)
- Previsualiza las plantillas disponibles
- Selecciona una plantilla haciendo clic en su miniatura

**Respuesta del sistema:**
- Muestra una vista previa más detallada de la plantilla seleccionada
- Ofrece la opción de cambiar la selección o continuar
- Registra la selección de plantilla

### 4. Personalización

**Acciones del usuario para paquete BÁSICA:**
- Completa textos básicos (nombres, fechas, lugares)
- Selecciona colores de entre opciones predefinidas
- Configura:
  * Cuenta regresiva
  * Información de "Cuándo y dónde"
  * Opciones para confirmación de asistencia
  * Opciones de regalo
  * Código de vestimenta

**Acciones adicionales para paquete PREMIUM:**
- Sube música personalizada (mp3)
- Sube fotos para la galería (hasta el límite establecido)
- Agrega información de padrinos

**Acciones adicionales para paquete VIP:**
- Agrega información de hospedaje
- Crea itinerario detallado del evento
- Configura hasta 5 pases para invitados especiales

**Respuesta del sistema:**
- Muestra una vista previa en tiempo real de los cambios
- Valida el contenido ingresado
- Guarda automáticamente cambios en progreso

### 5. Pago

**Acciones del usuario:**
- Revisa el resumen de su selección y personalización
- Hace clic en "Pagar"
- Es redirigido a la plataforma de MercadoPago
- Selecciona método de pago e ingresa datos
- Completa la transacción

**Respuesta del sistema:**
- Genera solicitud de pago con el monto correspondiente al paquete
- Procesa la respuesta de MercadoPago
- Actualiza estado de la invitación a "pagada" si la transacción es exitosa
- Notifica al usuario vía email sobre el pago exitoso

### 6. Entrega y Compartir

**Acciones del usuario:**
- Recibe enlace a su invitación finalizada
- Accede al panel donde puede ver y gestionar su invitación
- Comparte el enlace con sus invitados (email, WhatsApp, redes sociales)
- Monitorea confirmaciones de asistencia

**Respuesta del sistema:**
- Genera un enlace único para la invitación
- Envía email de confirmación con el enlace
- Activa el sistema de seguimiento de invitados

## Flujo Secundario: Interacción del Invitado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Recepción  │     │ Visualiza-  │     │   Interac-  │     │ Confirmación│
│  de Enlace  ├────►│    ción     ├────►│    ción     ├────►│ de Asistencia│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 1. Recepción de Enlace

**Acciones del invitado:**
- Recibe enlace por WhatsApp, email, redes sociales, etc.
- Hace clic en el enlace

**Respuesta del sistema:**
- Valida el enlace
- Carga la invitación personalizada

### 2. Visualización

**Acciones del invitado:**
- Explora la invitación interactiva
- Ve la cuenta regresiva
- Lee detalles del evento
- Visualiza galería de fotos (si disponible)
- Escucha música (si disponible)

**Respuesta del sistema:**
- Muestra contenido según el dispositivo (responsivo)
- Reproduce elementos multimedia
- Registra la visita

### 3. Interacción

**Acciones del invitado:**
- Explora las diferentes secciones de la invitación
- Accede a información de hospedaje (si disponible)
- Consulta itinerario (si disponible)
- Revisa información de padrinos (si disponible)
- Consulta código de vestimenta
- Decide sobre regalo

**Respuesta del sistema:**
- Responde a interacciones con animaciones o transiciones
- Muestra información detallada según solicitud
- Registra interacciones para análisis

### 4. Confirmación de Asistencia

**Acciones del invitado:**
- Completa formulario de confirmación
- Indica si asistirá
- Especifica número de acompañantes (si permitido)
- Selecciona opción de regalo (si disponible)
- Envía confirmación

**Respuesta del sistema:**
- Valida datos ingresados
- Registra confirmación en la base de datos
- Muestra mensaje de agradecimiento
- Notifica al creador de la invitación

## Flujo de Administración

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Login como │     │ Gestión de  │     │ Gestión de  │     │  Monitoreo  │
│  Admin      ├────►│  Paquetes   ├────►│ Plantillas  ├────►│ y Reportes  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 1. Inicio de Sesión como Administrador

**Acciones del administrador:**
- Accede a la URL de administración
- Ingresa credenciales con privilegios de administrador

**Respuesta del sistema:**
- Valida credenciales
- Verifica rol de administrador
- Redirige al panel de administración

### 2. Gestión de Paquetes

**Acciones del administrador:**
- Visualiza lista de paquetes existentes
- Crea nuevo paquete (nombre, precio, descripción)
- Edita paquete existente
- Asigna o elimina características de un paquete
- Activa/desactiva paquetes

**Respuesta del sistema:**
- Actualiza la base de datos
- Muestra confirmación de cambios
- Refleja cambios inmediatamente en el frontend

### 3. Gestión de Plantillas

**Acciones del administrador:**
- Visualiza lista de plantillas existentes
- Sube nueva plantilla (HTML, CSS, imágenes)
- Categoriza plantilla por tipo de evento
- Asigna plantilla a paquetes específicos
- Edita o desactiva plantillas existentes

**Respuesta del sistema:**
- Procesa archivos subidos
- Almacena plantilla en la base de datos
- Actualiza asignaciones de paquete-plantilla
- Muestra vista previa para confirmación

### 4. Monitoreo y Reportes

**Acciones del administrador:**
- Visualiza estadísticas de ventas
- Filtra datos por período, tipo de evento o paquete
- Genera reportes de transacciones
- Monitorea usuarios registrados y actividad
- Revisa pagos procesados por MercadoPago

**Respuesta del sistema:**
- Recopila y procesa datos de la base de datos
- Genera gráficos y visualizaciones
- Permite exportar reportes en CSV/PDF
- Muestra métricas de rendimiento del sistema

## Diagrama de Estados de una Invitación

```
                    ┌───────────┐
                    │           │
                    │ Borrador  │
                    │           │
                    └─────┬─────┘
                          │
                          ▼
┌───────────┐      ┌───────────┐
│           │      │           │
│ Cancelada ◄──────┤ Pendiente │
│           │      │   Pago    │
└───────────┘      │           │
                   └─────┬─────┘
                         │
                         ▼
                   ┌───────────┐
                   │           │
                   │  Pagada   │
                   │           │
                   └─────┬─────┘
                         │
                         ▼
                   ┌───────────┐
                   │           │
                   │ Publicada │
                   │           │
                   └─────┬─────┘
                         │
                         ▼
                   ┌───────────┐
                   │           │
                   │ Archivada │
                   │           │
                   └───────────┘
```

### Estados de la Invitación:

1. **Borrador**: Estado inicial cuando el usuario está creando/editando la invitación.
2. **Pendiente Pago**: La invitación está personalizada pero aún no se ha completado el pago.
3. **Cancelada**: El usuario ha cancelado la invitación o el pago ha sido rechazado/cancelado.
4. **Pagada**: El pago ha sido procesado exitosamente pero la invitación aún no está publicada.
5. **Publicada**: La invitación está activa y puede ser visitada por los invitados.
6. **Archivada**: La invitación ha expirado o ha sido archivada por el usuario después del evento.

Cada transición entre estados desencadena acciones específicas en el sistema, como notificaciones por correo electrónico, actualizaciones en la base de datos o cambios en la visibilidad de la invitación.
