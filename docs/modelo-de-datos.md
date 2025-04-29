# 5. Modelo de Datos

## Entidades Principales y Relaciones

### Diagrama Entidad-Relación (ER)

```
┌─────────────┐       ┌────────────┐       ┌────────────────┐
│  profiles   │       │  packages  │       │   templates    │
├─────────────┤       ├────────────┤       ├────────────────┤
│ id (PK/FK)  │       │ id (PK)    │       │ id (PK)        │
│ full_name   │◄──┐   │ name       │   ┌──►│ name           │
│ phone       │   │   │ price      │   │   │ event_type     │
│ role        │   │   │ description│   │   │ thumbnail_url  │
│ created_at  │   │   │ created_at │   │   │ html_content   │
└─────────────┘   │   └────────────┘   │   └────────────────┘
                  │         ▲          │           ▲
                  │         │          │           │
                  │         │          │           │
┌─────────────────┴─┐       │          │   ┌───────┴─────────┐
│   invitations     │       │          │   │ package_templates│
├───────────────────┤       │          │   ├─────────────────┤
│ id (PK)           │       │          │   │ id (PK)         │
│ user_id (FK)      │       │          │   │ package_id (FK) │
│ template_id (FK)  ├───────┘          └───┤ template_id (FK)│
│ package_id (FK)   │                      └─────────────────┘
│ customization_data│                              ▲
│ payment_status    │                              │
│ payment_id        │                              │
│ url_key           │                              │
│ created_at        │                              │
└───────────────────┘                              │
        │                                          │
        │                       ┌──────────────────┴───────┐
        │                       │     package_features     │
        │                       ├──────────────────────────┤
        │                       │ id (PK)                  │
        │                       │ package_id (FK)          │
        ▼                       │ feature_id (FK)          │
┌────────────────┐              └──────────────────────────┘
│   attendees    │                          ▲
├────────────────┤                          │
│ id (PK)        │              ┌───────────┴────────┐
│ invitation_id  │              │      features      │
│ name           │              ├────────────────────┤
│ email          │              │ id (PK)            │
│ will_attend    │              │ name               │
│ guests_count   │              │ description        │
│ gift_option    │              │ icon               │
│ created_at     │              └────────────────────┘
└────────────────┘
        │
        ▼
┌────────────────┐              ┌────────────────────┐
│ media_files    │              │ invitation_passes  │
├────────────────┤              ├────────────────────┤
│ id (PK)        │              │ id (PK)            │
│ invitation_id  │              │ invitation_id (FK) │
│ type           │              │ name               │
│ url            │              │ email              │
│ filename       │              │ pass_key           │
│ created_at     │              │ created_at         │
└────────────────┘              └────────────────────┘
```

## Definición Detallada de Tablas

### Tabla: profiles

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
```

### Tabla: packages

```sql
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

CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_is_active ON packages(is_active);
```

### Tabla: templates

```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    thumbnail_url TEXT NOT NULL,
    html_content TEXT NOT NULL,
    css_content TEXT,
    js_content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_templates_event_type ON templates(event_type);
CREATE INDEX idx_templates_is_active ON templates(is_active);
```

### Tabla: package_templates (Relación muchos a muchos)

```sql
CREATE TABLE package_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(package_id, template_id)
);

CREATE INDEX idx_package_templates_package_id ON package_templates(package_id);
CREATE INDEX idx_package_templates_template_id ON package_templates(template_id);
```

### Tabla: features

```sql
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: package_features (Relación muchos a muchos)

```sql
CREATE TABLE package_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(package_id, feature_id)
);

CREATE INDEX idx_package_features_package_id ON package_features(package_id);
CREATE INDEX idx_package_features_feature_id ON package_features(feature_id);
```

### Tabla: invitations

```sql
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id),
    package_id UUID NOT NULL REFERENCES packages(id),
    title VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    event_location TEXT,
    customization_data JSONB NOT NULL DEFAULT '{}',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    url_key VARCHAR(100) UNIQUE NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_invitations_template_id ON invitations(template_id);
CREATE INDEX idx_invitations_package_id ON invitations(package_id);
CREATE INDEX idx_invitations_payment_status ON invitations(payment_status);
CREATE INDEX idx_invitations_url_key ON invitations(url_key);
CREATE INDEX idx_invitations_is_published ON invitations(is_published);
```

### Tabla: attendees

```sql
CREATE TABLE attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    will_attend BOOLEAN,
    guests_count INTEGER DEFAULT 0,
    gift_option VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_attendees_invitation_id ON attendees(invitation_id);
CREATE INDEX idx_attendees_will_attend ON attendees(will_attend);
```

### Tabla: media_files

```sql
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'image', 'audio', 'video'
    url TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    size INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_files_invitation_id ON media_files(invitation_id);
CREATE INDEX idx_media_files_type ON media_files(type);
```

### Tabla: invitation_passes

```sql
CREATE TABLE invitation_passes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    pass_key VARCHAR(100) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invitation_passes_invitation_id ON invitation_passes(invitation_id);
CREATE INDEX idx_invitation_passes_pass_key ON invitation_passes(pass_key);
```

## Explicación del Modelo de Datos

1. **Perfiles (profiles)**: Almacena información adicional de los usuarios autenticados. El campo `id` es tanto clave primaria como clave foránea a `auth.users`, lo que indica que se está utilizando un sistema de autenticación externo. El campo `role` permite distinguir entre clientes y administradores.

2. **Paquetes (packages)**: Define los tres niveles de servicio (BÁSICA, PREMIUM, VIP) con sus precios y descripciones.

3. **Características (features)**: Representa las funcionalidades disponibles (cuenta regresiva, galería, música, etc.).

4. **Relación package_features**: Establece qué características están disponibles en cada paquete.

5. **Plantillas (templates)**: Contiene las plantillas prediseñadas categorizadas por tipo de evento (boda, XV años, etc.).

6. **Relación package_templates**: Define qué plantillas están disponibles para cada paquete.

7. **Invitaciones (invitations)**: Representa las invitaciones creadas por los usuarios, vinculando al usuario, plantilla y paquete seleccionado. Incluye el campo `customization_data` como JSONB para almacenar toda la información personalizada.

8. **Asistentes (attendees)**: Registra las confirmaciones de asistencia de los invitados.

9. **Archivos multimedia (media_files)**: Almacena referencias a imágenes, música y otros archivos asociados a una invitación.

10. **Pases de invitación (invitation_passes)**: Para el paquete VIP, almacena los 5 pases personalizados para invitados.

Este modelo de datos permite una estructura flexible y escalable, capaz de soportar todos los requerimientos funcionales de la aplicación mientras mantiene un diseño normalizado y eficiente.
