-- profiles_invitations_relation.sql
-- Establece la relación entre la tabla profiles e invitations

-- Esta migración crea una relación entre profiles (que se conecta con auth.users)
-- e invitations, cambiando la relación actual que va directamente a users

BEGIN;

-- 1. Agregar la columna profile_id a la tabla invitations
ALTER TABLE invitations 
ADD COLUMN profile_id UUID REFERENCES profiles(id);

-- 2. Actualizar los registros existentes (asumiendo que user_id corresponde a un id en profiles)
UPDATE invitations i
SET profile_id = p.id
FROM profiles p
WHERE i.user_id = p.id;

-- 3. Crear un índice para mejorar el rendimiento de consultas
CREATE INDEX idx_invitations_profile_id ON invitations(profile_id);

-- 4. Comentado: Hacer obligatorio el campo profile_id después de la migración
-- Descomentar solo después de verificar que todos los registros están actualizados correctamente
-- ALTER TABLE invitations 
-- ALTER COLUMN profile_id SET NOT NULL;

-- 5. Comentado: Eliminar la antigua relación con users
-- Descomentar solo después de verificar que la nueva relación funciona correctamente
-- ALTER TABLE invitations 
-- DROP CONSTRAINT invitations_user_id_fkey;
-- ALTER TABLE invitations 
-- DROP COLUMN user_id;

COMMIT;
