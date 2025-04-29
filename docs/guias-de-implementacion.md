
# 7. Guías de Implementación

## Implementación de Supabase

### Configuración Inicial

1. **Creación de Proyecto en Supabase**

```bash
# Instalación de la CLI de Supabase (opcional)
npm install -g supabase

# Iniciar un proyecto localmente
supabase init

# O crear el proyecto desde la interfaz web en https://app.supabase.io
```

2. **Configuración en Next.js**

```bash
# Instalación de los paquetes necesarios
npm install @supabase/supabase-js
```

3. **Configuración de Variables de Entorno**

```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role
```

4. **Configuración del Cliente de Supabase**

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Para operaciones del lado del servidor que requieren mayores privilegios
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### Implementación de Autenticación

1. **Registro de Usuarios**

```javascript
// components/auth/RegisterForm.jsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Registro de usuario en Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Si el registro es exitoso, redirigir o mostrar mensaje
      alert('Revisa tu correo para confirmar tu cuenta');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // JSX del formulario...
}
```

2. **Inicio de Sesión**

```javascript
// components/auth/LoginForm.jsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // JSX del formulario...
}
```

3. **Middleware para Proteger Rutas**

```javascript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si no hay sesión y la ruta requiere autenticación
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Verificar permisos de administrador
  if (
    session &&
    req.nextUrl.pathname.startsWith('/admin') &&
    session.user.user_metadata.role !== 'admin'
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### Configuración de Base de Datos

1. **Creación de Tablas (Migración SQL)**

Crear un archivo SQL con las definiciones de las tablas presentadas en la sección de modelo de datos.

```sql
-- migrations/001_create_initial_schema.sql
-- Ejemplo parcial usando las definiciones presentadas en el modelo de datos

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla packages
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Otros CREATE TABLE statements...

-- Configurar RLS (Row Level Security)
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propias invitaciones
CREATE POLICY "Users can view their own invitations" 
ON invitations FOR SELECT 
USING (auth.uid() = user_id);

-- Política para que los usuarios solo puedan crear sus propias invitaciones
CREATE POLICY "Users can insert their own invitations" 
ON invitations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Otras políticas de seguridad...
```

2. **Aplicar la Migración**

```bash
# Usando la CLI de Supabase
supabase db push

# O ejecutando directamente en la UI del SQL Editor de Supabase
```

### Implementación de Almacenamiento

1. **Configuración de Buckets**

```javascript
// scripts/setup-storage.js
import { supabaseAdmin } from '@/lib/supabase';

async function setupStorage() {
  // Crear bucket para imágenes de invitación
  const { data: invitationImages, error: error1 } = await supabaseAdmin
    .storage
    .createBucket('invitation-images', {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2, // 2MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

  // Crear bucket para música
  const { data: music, error: error2 } = await supabaseAdmin
    .storage
    .createBucket('invitation-music', {
      public: true,
      fileSizeLimit: 1024 * 1024 * 5, // 5MB
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3']
    });

  console.log('Storage buckets created');
}

setupStorage().catch(console.error);
```

2. **Subida de Archivos**

```javascript
// components/MediaUploader.jsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MediaUploader({ invitationId, type, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const bucketName = type === 'image' ? 'invitation-images' : 'invitation-music';
    const filePath = `${invitationId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

    setUploading(true);
    setError(null);

    try {
      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Guardar referencia en la base de datos
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          invitation_id: invitationId,
          type: type,
          url: urlData.publicUrl,
          filename: file.name,
          size: file.size,
        });

      if (dbError) throw dbError;

      onSuccess(urlData.publicUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // JSX del componente...
}
```

## Implementación de MercadoPago

### Configuración Inicial

1. **Registrarse como Desarrollador**

- Crear una cuenta en [MercadoPago Developers](https://developers.mercadopago.com)
- Obtener credenciales de prueba y producción

2. **Instalación de SDK**

```bash
npm install mercadopago
```

3. **Configuración de Claves API**

```
# .env.local
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. **Inicialización del SDK**

```javascript
// lib/mercadopago.js
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const mercadoPagoClient = {
  payment: new Payment(mercadoPagoConfig),
  preference: new Preference(mercadoPagoConfig),
};
```

### Implementación del Checkout

1. **Creación de Preferencia de Pago**

```javascript
// app/api/create-payment/route.js
import { NextResponse } from 'next/server';
import { mercadoPagoClient } from '@/lib/mercadopago';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { invitationId, packageId } = await request.json();

    // Obtener información del paquete
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError) throw packageError;

    // Obtener información de la invitación
    const { data: invitationData, error: invitationError } = await supabase
      .from('invitations')
      .select('title, user_id')
      .eq('id', invitationId)
      .single();

    if (invitationError) throw invitationError;

    // Crear preferencia de pago
    const preference = {
      items: [
        {
          id: packageId,
          title: `Invitación ${packageData.name} - ${invitationData.title}`,
          quantity: 1,
          unit_price: parseFloat(packageData.price),
          currency_id: 'MXN',
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
      },
      auto_return: 'approved',
      external_reference: invitationId,
      metadata: {
        invitation_id: invitationId,
        user_id: invitationData.user_id,
        package_id: packageId,
      },
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    };

    const response = await mercadoPagoClient.preference.create({ body: preference });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error('MercadoPago error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

2. **Implementación del Botón de Pago**

```javascript
// components/PaymentButton.jsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PaymentButton({ invitationId, packageId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Llamar a la API para crear la preferencia de pago
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationId,
          packageId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el pago');
      }

      const { init_point } = await response.json();

      // Redirigir al usuario a MercadoPago
      window.location.href = init_point;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={handlePayment} 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
```

### Implementación de Webhooks

1. **Configuración del Webhook**

```javascript
// app/api/webhooks/mercadopago/route.js
import { NextResponse } from 'next/server';
import { mercadoPagoClient } from '@/lib/mercadopago';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verificar que la notificación sea de un pago
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Not a payment notification' });
    }

    // Obtener los detalles del pago
    const paymentId = body.data.id;
    const paymentInfo = await mercadoPagoClient.payment.get({ id: paymentId });

    // Verificar que el pago esté aprobado
    if (paymentInfo.status !== 'approved') {
      return NextResponse.json({ message: `Payment status: ${paymentInfo.status}` });
    }

    // Extraer el ID de la invitación
    const invitationId = paymentInfo.external_reference;
    
    // Actualizar el estado de la invitación
    const { error } = await supabase
      .from('invitations')
      .update({
        payment_status: 'paid',
        payment_id: paymentId,
        is_published: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invitationId);

    if (error) throw error;

    // Obtener datos de la invitación y el usuario para enviar notificación
    const { data: invitationData, error: invError } = await supabase
      .from('invitations')
      .select(`
        title,
        url_key,
        users (
          email,
          full_name
        )
      `)
      .eq('id', invitationId)
      .single();

    if (invError) throw invError;

    // Aquí iría la lógica para enviar notificación por correo con Resend
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Necesario para que Mercado Pago pueda enviar notificaciones
export const config = {
  api: {
    bodyParser: false,
  },
};
```

2. **Manejo de Redirección Post-Pago**

```javascript
// app/payment/success/page.jsx
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    // Verificar el estado del pago (opcional, ya que el webhook debe haberlo hecho)
    const verifyPayment = async () => {
      try {
        // Verificar en nuestra base de datos si el pago ya fue procesado
        const { data, error } = await supabase
          .from('invitations')
          .select('payment_status, url_key')
          .eq('id', externalReference)
          .single();

        if (error) throw error;

        // Si el webhook ya procesó el pago, mostrar la invitación
        if (data.payment_status === 'paid') {
          // Redirigir al usuario a su invitación
          router.push(`/dashboard/invitations/${data.url_key}`);
        } else {
          // Esperar un momento y verificar de nuevo (podría implementarse mejor con polling)
          setTimeout(verifyPayment, 3000);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    };

    if (paymentId && externalReference) {
      verifyPayment();
    }
  }, [paymentId, externalReference, router]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-4">¡Pago Exitoso!</h1>
      <p className="text-center mb-8">
        Estamos procesando tu pago y preparando tu invitación.
      </p>
      <div className="flex justify-center">
        {/* Spinner de carga */}
      </div>
    </div>
  );
}
```

### Pruebas y Depuración

1. **Tarjetas de Prueba**

```javascript
// Información para pruebas en ambiente de desarrollo
const TEST_CARDS = {
  visa: {
    number: '4507990000004905',
    cvv: '123',
    expDate: '12/25',
    holder: 'APRO TESTUSER',
  },
  mastercard: {
    number: '5031433215406351',
    cvv: '123',
    expDate: '12/25',
    holder: 'APRO TESTUSER',
  },
  american_express: {
    number: '371180303257522',
    cvv: '1234',
    expDate: '12/25',
    holder: 'APRO TESTUSER',
  },
};

// Usuarios de prueba
// Vendedor: TEST_USER_123456789@testuser.com
// Comprador: TEST_USER_987654321@testuser.com
```

2. **Supervisión de Webhooks**

```javascript
// Guardar logs de webhooks para depuración
const logWebhookEvent = async (event) => {
  try {
    await supabase.from('webhook_logs').insert({
      source: 'mercadopago',
      event_type: event.type,
      payload: event,
      processed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging webhook:', error);
  }
};
```

## Recomendaciones y Mejores Prácticas

### Supabase

1. **Seguridad**:
   - Activar RLS (Row Level Security) en todas las tablas.
   - Configurar políticas de acceso a datos para limitar qué puede ver y modificar cada usuario.
   - No exponer claves de servicio en el cliente.

2. **Rendimiento**:
   - Crear índices para campos frecuentemente consultados.
   - Utilizar funciones de búsqueda de texto completo para búsquedas complejas.
   - Implementar paginación para listas largas.

3. **Migración y Versionado**:
   - Mantener archivos SQL con todas las migraciones.
   - Usar comentarios para documentar cambios en el esquema.
   - Probar las migraciones en un entorno de desarrollo antes de aplicarlas a producción.

### MercadoPago

1. **Seguridad**:
   - Validar siempre las notificaciones de webhook.
   - No almacenar información sensible de tarjetas.
   - Implementar HTTPS para todas las comunicaciones.

2. **Experiencia de Usuario**:
   - Mostrar información clara sobre el proceso de pago.
   - Implementar páginas de éxito/error con instrucciones claras.
   - Proporcionar confirmaciones por correo electrónico después del pago.

3. **Monitoreo**:
   - Implementar sistema de alertas para pagos fallidos.
   - Registrar todos los eventos de webhook para depuración.
   - Verificar regularmente la tasa de conversión del checkout.

4. **Cumplimiento**:
   - Asegurar que los términos y condiciones cumplen con la regulación local.
   - Incluir políticas de reembolso claras.
   - Mantener registros de transacciones para fines fiscales.
