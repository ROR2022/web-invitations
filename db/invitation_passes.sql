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

-- Habilitar RLS
ALTER TABLE invitation_passes ENABLE ROW LEVEL SECURITY;

-- Los propietarios de la invitación pueden ver sus pases
CREATE POLICY "Propietarios pueden ver pases de sus invitaciones"
ON invitation_passes FOR SELECT
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden insertar pases
CREATE POLICY "Propietarios pueden insertar pases en sus invitaciones"
ON invitation_passes FOR INSERT
WITH CHECK (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden actualizar pases
CREATE POLICY "Propietarios pueden actualizar pases de sus invitaciones"
ON invitation_passes FOR UPDATE
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden eliminar pases
CREATE POLICY "Propietarios pueden eliminar pases de sus invitaciones"
ON invitation_passes FOR DELETE
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los administradores pueden ver todos los pases
CREATE POLICY "Administradores pueden ver todos los pases"
ON invitation_passes FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Verificación de pase y límite de 5 pases por invitación del paquete VIP
CREATE OR REPLACE FUNCTION check_invitation_pass_limit()
RETURNS TRIGGER AS $$
DECLARE
    package_slug TEXT;
    current_pass_count INTEGER;
BEGIN
    -- Obtener el slug del paquete de la invitación
    SELECT p.slug INTO package_slug
    FROM packages p
    JOIN invitations i ON i.package_id = p.id
    WHERE i.id = NEW.invitation_id;
    
    -- Verificar si es paquete VIP
    IF package_slug != 'vip' THEN
        RAISE EXCEPTION 'Solo las invitaciones con paquete VIP pueden tener pases';
    END IF;
    
    -- Contar pases actuales
    SELECT COUNT(*) INTO current_pass_count
    FROM invitation_passes
    WHERE invitation_id = NEW.invitation_id;
    
    -- Verificar límite de 5 pases
    IF current_pass_count >= 5 THEN
        RAISE EXCEPTION 'No se pueden crear más de 5 pases por invitación';
    END IF;
    
    -- Generar pass_key único si no se proporcionó
    IF NEW.pass_key IS NULL THEN
        NEW.pass_key = LOWER(SUBSTRING(MD5(NEW.name || NOW()::TEXT || RANDOM()::TEXT), 1, 12));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar límite de pases y generar pass_key
CREATE TRIGGER check_pass_limit
BEFORE INSERT ON invitation_passes
FOR EACH ROW
EXECUTE FUNCTION check_invitation_pass_limit();
