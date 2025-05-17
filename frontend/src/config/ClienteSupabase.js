import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mostrar alerta si faltan las variables de entorno antes de crear el cliente
if (!supabaseUrl || !supabaseAnonKey) {
  alert("ADVERTENCIA: Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están definidas. Por favor, crea un archivo .env en la raíz del proyecto frontend con estas variables. La aplicación podría no funcionar correctamente.");
}

// Crear cliente de Supabase solo si las keys existen
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default supabase;