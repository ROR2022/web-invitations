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

-- Habilitar RLS
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Los propietarios de la invitación pueden ver sus asistentes
CREATE POLICY "Propietarios pueden ver asistentes de sus invitaciones"
ON attendees FOR SELECT
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden actualizar asistentes
CREATE POLICY "Propietarios pueden actualizar asistentes de sus invitaciones"
ON attendees FOR UPDATE
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los propietarios de la invitación pueden eliminar asistentes
CREATE POLICY "Propietarios pueden eliminar asistentes de sus invitaciones"
ON attendees FOR DELETE
USING (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE user_id = auth.uid()
    )
);

-- Los administradores pueden ver todos los asistentes
CREATE POLICY "Administradores pueden ver todos los asistentes"
ON attendees FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Cualquier persona puede confirmar asistencia (insertar) a invitaciones publicadas
CREATE POLICY "Cualquier persona puede confirmar asistencia a invitaciones publicadas"
ON attendees FOR INSERT
WITH CHECK (
    invitation_id IN (
        SELECT id FROM invitations 
        WHERE is_published = true
    )
);
