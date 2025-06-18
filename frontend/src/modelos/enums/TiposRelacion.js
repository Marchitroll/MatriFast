/**
 * Este módulo exporta una función para obtener los tipos de relación permitidos.
 * Utiliza el servicio EnumService para cargar datos asincrónicamente sin bloquear
 * la carga del módulo.
 *
 * La función exportada retorna una Promise que resuelve a un array inmutable de strings:
 *   ['PADRE', 'MADRE', 'TUTOR', ...]
 *
 * En caso de error en la conexión, retorna valores por defecto para mantener
 * la funcionalidad de la aplicación.
 */

import enumService from '../../servicios/EnumService.js';

/**
 * Obtiene la lista de tipos de relación permitidos
 * @returns {Promise<string[]>} Array inmutable de tipos de relación
 */
export async function getTiposRelacion() {
  return await enumService.getTiposRelacion();
}

// Valores por defecto para compatibilidad con código existente
export const defaultValues = ['PADRE', 'MADRE', 'TUTOR', 'ABUELO', 'HERMANO'];

// Exportación por defecto para compatibilidad con importaciones existentes
export default getTiposRelacion;
