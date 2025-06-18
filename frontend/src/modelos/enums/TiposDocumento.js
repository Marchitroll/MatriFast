/**
 * Este módulo exporta una función para obtener los tipos de documento permitidos.
 * Utiliza el servicio EnumService para cargar datos asincrónicamente sin bloquear
 * la carga del módulo.
 *
 * La función exportada retorna una Promise que resuelve a un array inmutable de strings:
 *   ['DNI', 'CE', 'PTP', ...]
 *
 * En caso de error en la conexión, retorna valores por defecto para mantener
 * la funcionalidad de la aplicación.
 */

import enumService from '../../servicios/EnumService.js';

/**
 * Obtiene la lista de tipos de documento permitidos
 * @returns {Promise<string[]>} Array inmutable de tipos de documento
 */
export async function getTiposDocumento() {
  return await enumService.getTiposDocumento();
}

// Valores por defecto para compatibilidad con código existente
export const defaultValues = ['DNI', 'CE', 'PTP'];

// Exportación por defecto para compatibilidad con importaciones existentes
export default getTiposDocumento;
