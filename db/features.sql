CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver las características
CREATE POLICY "Todos pueden ver las características"
ON features FOR SELECT
USING (true);

-- Solo administradores pueden insertar/actualizar/eliminar características
CREATE POLICY "Solo administradores pueden modificar características"
ON features FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Insertar características iniciales según la documentación
INSERT INTO features (name, description, icon)
VALUES 
('Cuenta Regresiva', 'Muestra un contador con los días, horas y minutos restantes hasta el evento', 'clock'),
('Cuándo y dónde', 'Información detallada sobre la fecha, hora y ubicación del evento', 'map-pin'),
('Confirmación de asistencia', 'Formulario para que los invitados confirmen su asistencia', 'check-square'),
('Opciones de regalo', 'Información sobre mesa de regalos, cuenta bancaria u otras opciones', 'gift'),
('Código de vestimenta', 'Indicaciones sobre el código de vestimenta para los invitados', 'shirt'),
('Música personalizada', 'Posibilidad de añadir música de fondo a la invitación', 'music'),
('Galería', 'Espacio para compartir fotos con los invitados', 'image'),
('Padrinos', 'Sección para mostrar los padrinos o personas importantes del evento', 'users'),
('Hospedaje', 'Información sobre opciones de hospedaje para invitados', 'home'),
('Itinerario', 'Cronograma detallado de las actividades del evento', 'calendar'),
('Pases invitados', 'Pases digitales personalizados para invitados VIP', 'ticket');
