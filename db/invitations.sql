CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Habilitar RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propias invitaciones
CREATE POLICY "Usuarios pueden ver sus propias invitaciones"
ON invitations FOR SELECT
USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propias invitaciones
CREATE POLICY "Usuarios pueden crear sus propias invitaciones"
ON invitations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propias invitaciones
CREATE POLICY "Usuarios pueden actualizar sus propias invitaciones"
ON invitations FOR UPDATE
USING (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propias invitaciones
CREATE POLICY "Usuarios pueden eliminar sus propias invitaciones"
ON invitations FOR DELETE
USING (auth.uid() = user_id);

-- Cualquier persona puede ver invitaciones publicadas utilizando el url_key
CREATE POLICY "Invitaciones publicadas son visibles con url_key"
ON invitations FOR SELECT
USING (is_published = true);

-- Los administradores pueden ver todas las invitaciones
CREATE POLICY "Administradores pueden ver todas las invitaciones"
ON invitations FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Función para generar automáticamente una url_key única
CREATE OR REPLACE FUNCTION generate_unique_invitation_key()
RETURNS TRIGGER AS $$
DECLARE
    base_key TEXT;
    final_key TEXT;
    key_exists BOOLEAN;
BEGIN
    -- Crear una clave base usando un timestamp y aleatorización
    base_key := LOWER(
        SUBSTRING(
            REPLACE(
                CAST(NEW.title AS TEXT), ' ', '-'
            ) FROM 1 FOR 20
        ) || '-' ||
        SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)
    );
    
    final_key := base_key;
    
    -- Verificar si la clave ya existe
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM invitations WHERE url_key = final_key
        ) INTO key_exists;
        
        EXIT WHEN NOT key_exists;
        
        -- Si existe, añadir más aleatoriedad
        final_key := base_key || '-' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 4);
    END LOOP;
    
    NEW.url_key := final_key;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar automáticamente url_key al insertar
CREATE TRIGGER set_invitation_url_key
BEFORE INSERT ON invitations
FOR EACH ROW
WHEN (NEW.url_key IS NULL)
EXECUTE FUNCTION generate_unique_invitation_key();
