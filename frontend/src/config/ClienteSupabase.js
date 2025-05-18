import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

// Mostrar alerta si faltan las variables de entorno antes de crear el cliente
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = "ADVERTENCIA CRÍTICA: Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están definidas. Por favor, crea un archivo .env en la raíz del proyecto frontend con estas variables. La aplicación no puede continuar.";
  alert(errorMessage); // Mantener la alerta para feedback visual
  throw new Error(errorMessage);
} else {
  // Crear cliente de Supabase solo si las keys existen y no se lanzó error.
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export default supabase;