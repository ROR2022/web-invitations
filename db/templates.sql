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

-- Habilitar RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver las plantillas (especialmente las activas)
CREATE POLICY "Todos pueden ver las plantillas"
ON templates FOR SELECT
USING (true);

-- Solo administradores pueden insertar/actualizar/eliminar plantillas
CREATE POLICY "Solo administradores pueden modificar plantillas"
ON templates FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Insertar plantillas iniciales
INSERT INTO templates (name, event_type, slug, thumbnail_url, html_content)
VALUES 
('Elegante Dorado', 'boda', 'elegante-dorado', 'https://ejemplos-invitaciones.s3.amazonaws.com/boda-dorada.jpg', '<div class="invitation-template"><!-- Contenido HTML básico de la plantilla --></div>'),
('Floral Rosa', 'boda', 'floral-rosa', 'https://ejemplos-invitaciones.s3.amazonaws.com/boda-floral.jpg', '<div class="invitation-template"><!-- Contenido HTML básico de la plantilla --></div>'),
('Moderna Azul', 'xv-anos', 'moderna-azul', 'https://ejemplos-invitaciones.s3.amazonaws.com/xv-moderna.jpg', '<div class="invitation-template"><!-- Contenido HTML básico de la plantilla --></div>'),
('Rosa Clásica', 'xv-anos', 'rosa-clasica', 'https://ejemplos-invitaciones.s3.amazonaws.com/xv-clasica.jpg', '<div class="invitation-template"><!-- Contenido HTML básico de la plantilla --></div>'),
('Infantil Colorida', 'bautizo', 'infantil-colorida', 'https://ejemplos-invitaciones.s3.amazonaws.com/bautizo-color.jpg', '<div class="invitation-template"><!-- Contenido HTML básico de la plantilla --></div>'),
('Ejecutiva Minimalista', 'corporativo', 'ejecutiva-minimalista', 'https://ejemplos-invitaciones.s3.amazonaws.com/corp-minimal.jpg', '<div class="invitation-template"><!-- Contenido HTML básico de la plantilla --></div>');
