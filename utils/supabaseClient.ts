/* import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Verificar si las variables de entorno están disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las variables de entorno para Supabase. Asegúrate de que están configuradas correctamente.');
}

// Crear el cliente de Supabase
const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export default supabase; */
