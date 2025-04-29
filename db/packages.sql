CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_is_active ON packages(is_active);

-- Habilitar RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver los paquetes (especialmente los activos)
CREATE POLICY "Todos pueden ver los paquetes"
ON packages FOR SELECT
USING (true);

-- Solo administradores pueden insertar/actualizar/eliminar paquetes
CREATE POLICY "Solo administradores pueden modificar paquetes"
ON packages FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Insertar paquetes iniciales
INSERT INTO packages (name, slug, price, description)
VALUES 
('BÁSICA', 'basica', 299, 'Paquete básico con funcionalidades esenciales para tu invitación digital'),
('PREMIUM', 'premium', 499, 'Paquete intermedio con todas las características básicas más galería y música personalizada'),
('VIP', 'vip', 699, 'Paquete completo con todas las características y 5 pases para invitados VIP');