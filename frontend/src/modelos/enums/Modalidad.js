/**
 * Este módulo exporta una función para obtener las modalidades permitidas.
 * Utiliza el servicio EnumService para cargar datos asincrónicamente sin bloquear
 * la carga del módulo.
 *
 * La función exportada retorna una Promise que resuelve a un array inmutable de strings:
 *   ['PRESENCIAL', 'VIRTUAL', 'SEMIPRESENCIAL', ...]
 *
 * En caso de error en la conexión, retorna valores por defecto para mantener
 * la funcionalidad de la aplicación.
 */

import enumService from '../../servicios/EnumService.js';

/**
 * Obtiene la lista de modalidades permitidas
 * @returns {Promise<string[]>} Array inmutable de modalidades
 */
export async function getModalidades() {
  return await enumService.getModalidades();
}

// Valores por defecto para compatibilidad con código existente
export const defaultValues = ['PRESENCIAL', 'VIRTUAL', 'SEMIPRESENCIAL'];

// Exportación por defecto para compatibilidad con importaciones existentes
export default getModalidades;
