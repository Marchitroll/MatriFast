import '@testing-library/jest-dom';

// Proveer variables de entorno dummy durante la ejecución de tests si no existen
if (!process.env.VITE_SUPABASE_URL) {
  process.env.VITE_SUPABASE_URL = 'https://mock.supabase.co';
}
if (!process.env.VITE_SUPABASE_ANON_KEY) {
  process.env.VITE_SUPABASE_ANON_KEY = 'mock-anon-key';
}

if (typeof window !== 'undefined') {
  window.alert = window.alert || (() => {});
}
