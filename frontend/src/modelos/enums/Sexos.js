/**
 * Este módulo exporta una función para obtener los sexos permitidos.
 * Utiliza el servicio EnumService para cargar datos asincrónicamente sin bloquear
 * la carga del módulo.
 *
 * La función exportada retorna una Promise que resuelve a un array inmutable de strings:
 *   ['M', 'F', 'O']
 *
 * En caso de error en la conexión, retorna valores por defecto para mantener
 * la funcionalidad de la aplicación.
 */

import enumService from '../../servicios/EnumService.js';

/**
 * Obtiene la lista de sexos permitidos
 * @returns {Promise<string[]>} Array inmutable de sexos
 */
export async function getSexos() {
  return await enumService.getSexos();
}

// Valores por defecto para compatibilidad con código existente
export const defaultValues = ['M', 'F'];

// Exportación por defecto para compatibilidad con importaciones existentes
export default getSexos;
