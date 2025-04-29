-- Nota: La creación del bucket se debe hacer a través de la interfaz de usuario de Supabase
-- Este script configura las políticas de seguridad para el bucket 'invitation-media'

-- Habilitar la extensión de almacenamiento si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Asegurarse de que las políticas RLS están habilitadas para objetos de almacenamiento
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Crear función auxiliar para extraer el ID de invitación del nombre del archivo
CREATE OR REPLACE FUNCTION public.get_invitation_id_from_path(path TEXT)
RETURNS TEXT AS $$
DECLARE
    segments TEXT[];
    invitation_id TEXT;
BEGIN
    segments := string_to_array(path, '/');
    
    -- Extraer el ID de invitación (formato esperado: invitation-{id}/...)
    IF array_length(segments, 1) >= 1 AND segments[1] LIKE 'invitation-%' THEN
        invitation_id := substring(segments[1] FROM 12);
        RETURN invitation_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política de lectura para todos (invitaciones publicadas)
CREATE POLICY "Archivos de invitaciones públicas son visibles para todos" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'invitation-media' AND (
    public.get_invitation_id_from_path(name) IN (
      SELECT id::text 
      FROM invitations 
      WHERE is_published = true
    )
  )
);

-- Política de lectura para propietarios
CREATE POLICY "Los usuarios pueden ver archivos de sus propias invitaciones" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'invitation-media' AND (
    public.get_invitation_id_from_path(name) IN (
      SELECT id::text 
      FROM invitations 
      WHERE user_id = auth.uid()
    )
  )
);

-- Política de inserción
CREATE POLICY "Los usuarios pueden subir archivos a sus propias invitaciones" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'invitation-media' AND (
    public.get_invitation_id_from_path(name) IN (
      SELECT id::text 
      FROM invitations 
      WHERE user_id = auth.uid()
    )
  )
);

-- Política de actualización
CREATE POLICY "Los usuarios pueden actualizar sus propios archivos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'invitation-media' AND (
    public.get_invitation_id_from_path(name) IN (
      SELECT id::text 
      FROM invitations 
      WHERE user_id = auth.uid()
    )
  )
);

-- Política de eliminación
CREATE POLICY "Los usuarios pueden eliminar sus propios archivos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'invitation-media' AND (
    public.get_invitation_id_from_path(name) IN (
      SELECT id::text 
      FROM invitations 
      WHERE user_id = auth.uid()
    )
  )
);

-- Administradores tienen control total
CREATE POLICY "Administradores tienen control total sobre los archivos" 
ON storage.objects FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Instrucciones para la integración con la aplicación frontend:

/*
Para subir archivos desde el frontend, sigue esta estructura de carpetas:

1. Para imágenes:
   invitation-{invitation_id}/images/{filename}.jpg

2. Para audio:
   invitation-{invitation_id}/audio/{filename}.mp3

3. Para video:
   invitation-{invitation_id}/video/{filename}.mp4

4. Para documentos:
   invitation-{invitation_id}/documents/{filename}.pdf

Ejemplo de código para subir un archivo desde el frontend:

```javascript
const { data, error } = await supabase.storage
  .from('invitation-media')
  .upload(
    `invitation-${invitationId}/images/${fileName}`,
    file,
    {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    }
  );
```

Para obtener la URL pública de un archivo:

```javascript
const { data } = supabase.storage
  .from('invitation-media')
  .getPublicUrl(`invitation-${invitationId}/images/${fileName}`);

const publicUrl = data.publicUrl;
```

Recuerda que para mantener la seguridad, siempre verifica que el usuario
tenga permisos para la invitación antes de permitir subidas o descargas.
*/
