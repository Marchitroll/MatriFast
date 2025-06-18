/**
 * Este módulo exporta una función para obtener los roles de usuario permitidos.
 * Utiliza el servicio EnumService para cargar datos asincrónicamente sin bloquear
 * la carga del módulo.
 *
 * La función exportada retorna una Promise que resuelve a un array inmutable de strings:
 *   ['Docente', 'Representante legal', ...]
 *
 * En caso de error en la conexión, retorna valores por defecto para mantener
 * la funcionalidad de la aplicación.
 */

import enumService from '../../servicios/EnumService.js';

/**
 * Obtiene la lista de roles de usuario permitidos
 * @returns {Promise<string[]>} Array inmutable de roles de usuario
 */
export async function getRolesUsuario() {
  return await enumService.getRolesUsuario();
}

// Valores por defecto para compatibilidad con código existente
export const defaultValues = ['Docente', 'Representante legal'];

// Exportación por defecto para compatibilidad con importaciones existentes
export default getRolesUsuario;