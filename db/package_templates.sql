CREATE TABLE package_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(package_id, template_id)
);

CREATE INDEX idx_package_templates_package_id ON package_templates(package_id);
CREATE INDEX idx_package_templates_template_id ON package_templates(template_id);

-- Habilitar RLS
ALTER TABLE package_templates ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver las relaciones entre paquetes y plantillas
CREATE POLICY "Todos pueden ver las relaciones de paquetes y plantillas"
ON package_templates FOR SELECT
USING (true);

-- Solo administradores pueden modificar las relaciones
CREATE POLICY "Solo administradores pueden modificar relaciones de paquetes y plantillas"
ON package_templates FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Asignar todas las plantillas al paquete VIP
INSERT INTO package_templates (package_id, template_id)
SELECT p.id, t.id
FROM packages p, templates t
WHERE p.slug = 'vip';

-- Asignar plantillas específicas al paquete PREMIUM (todas menos corporativo)
INSERT INTO package_templates (package_id, template_id)
SELECT p.id, t.id
FROM packages p, templates t
WHERE p.slug = 'premium' AND t.event_type != 'corporativo';

-- Asignar plantillas básicas al paquete BÁSICA (solo una de cada tipo)
INSERT INTO package_templates (package_id, template_id)
SELECT DISTINCT ON (t.event_type) p.id, t.id
FROM packages p, templates t
WHERE p.slug = 'basica'
ORDER BY t.event_type, t.name;
