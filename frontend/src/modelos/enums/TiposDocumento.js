/**
 * Este módulo obtiene y exporta la lista de tipos de documento permitidos desde la base de datos Supabase.
 * Utiliza top-level await para realizar la consulta de manera síncrona al cargar el módulo.
 *
 * NOTA: Este enfoque bloquea la carga del módulo hasta que la consulta a la base de datos finalice.
 * Es adecuado para proyectos pequeños, prototipos o trabajos académicos donde la simplicidad es prioritaria.
 *
 * La lista exportada es un array inmutable (Object.freeze) de strings, por ejemplo:
 *   ['DNI', 'CE', 'PTP', ...]
 *
 * Si ocurre un error en la consulta, se lanzará una excepción y la aplicación no continuará cargando.
 */

import supabase from '../../config/ClienteSupabase';

// Variable para almacenar la lista de tipos de documento permitidos
let listaDeTiposDocumentoPermitidos = null;

// Consulta a la base de datos para obtener los tipos de documento
if (!listaDeTiposDocumentoPermitidos) {
  const { data, error } = await supabase
    .from('TipoDocumento')
    .select('valor');
  if (error) throw new Error(error.message);
  // Se crea un array inmutable solo con los valores no vacíos y sin espacios
  listaDeTiposDocumentoPermitidos = Object.freeze(
    (data || []).map(r => r.valor.trim()).filter(Boolean)
  );
}

// Exporta la lista de tipos de documento para ser usada en otros módulos
export default listaDeTiposDocumentoPermitidos;
