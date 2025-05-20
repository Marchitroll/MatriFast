/**
 * Interfaz para implementaciones de logging
 * @interface
 */
export default class ILogger {
  /**
   * Registra un mensaje de información
   * @param {string} message - Mensaje a registrar
   * @param {object} [data] - Datos adicionales
   */
  info(message, data) {
    throw new Error('Método info debe ser implementado');
  }
  
  /**
   * Registra un mensaje de error
   * @param {string} message - Mensaje de error
   * @param {object|Error} [error] - Objeto de error o datos adicionales
   */
  error(message, error) {
    throw new Error('Método error debe ser implementado');
  }
}
