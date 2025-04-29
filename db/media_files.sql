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

-- Habilitar RLS
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Los propietarios de la invitación pueden ver sus archivos multimedia
CREATE POLICY "Propietarios pueden ver archivos multimedia de sus invitaciones"
ON media_files FOR SELECT
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden insertar archivos multimedia
CREATE POLICY "Propietarios pueden insertar archivos multimedia en sus invitaciones"
ON media_files FOR INSERT
WITH CHECK (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden actualizar archivos multimedia
CREATE POLICY "Propietarios pueden actualizar archivos multimedia de sus invitaciones"
ON media_files FOR UPDATE
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden eliminar archivos multimedia
CREATE POLICY "Propietarios pueden eliminar archivos multimedia de sus invitaciones"
ON media_files FOR DELETE
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los administradores pueden ver todos los archivos multimedia
CREATE POLICY "Administradores pueden ver todos los archivos multimedia"
ON media_files FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Cualquier persona puede ver archivos multimedia de invitaciones publicadas
CREATE POLICY "Cualquier persona puede ver archivos multimedia de invitaciones publicadas"
ON media_files FOR SELECT
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE is_published = true
    )
);
