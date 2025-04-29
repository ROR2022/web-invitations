CREATE TABLE package_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(package_id, feature_id)
);

CREATE INDEX idx_package_features_package_id ON package_features(package_id);
CREATE INDEX idx_package_features_feature_id ON package_features(feature_id);

-- Habilitar RLS
ALTER TABLE package_features ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver las relaciones entre paquetes y características
CREATE POLICY "Todos pueden ver las relaciones de paquetes y características"
ON package_features FOR SELECT
USING (true);

-- Solo administradores pueden modificar las relaciones
CREATE POLICY "Solo administradores pueden modificar relaciones de paquetes y características"
ON package_features FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Insertar las relaciones entre paquetes y características
-- Primero, necesitamos obtener los IDs de los paquetes y características

-- Para el paquete BÁSICA (incluye las 5 primeras características)
INSERT INTO package_features (package_id, feature_id)
SELECT p.id, f.id
FROM packages p, features f
WHERE p.slug = 'basica' AND f.name IN (
    'Cuenta Regresiva',
    'Cuándo y dónde',
    'Confirmación de asistencia',
    'Opciones de regalo',
    'Código de vestimenta'
);

-- Para el paquete PREMIUM (incluye las 8 primeras características)
INSERT INTO package_features (package_id, feature_id)
SELECT p.id, f.id
FROM packages p, features f
WHERE p.slug = 'premium' AND f.name IN (
    'Cuenta Regresiva',
    'Cuándo y dónde',
    'Confirmación de asistencia',
    'Opciones de regalo',
    'Código de vestimenta',
    'Música personalizada',
    'Galería',
    'Padrinos'
);

-- Para el paquete VIP (incluye todas las características)
INSERT INTO package_features (package_id, feature_id)
SELECT p.id, f.id
FROM packages p, features f
WHERE p.slug = 'vip';
