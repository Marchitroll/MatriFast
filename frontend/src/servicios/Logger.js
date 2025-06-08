/**
 * Logger sencillo para aplicación
 */
import ILogger from '../modelos/interfaces/ILogger';

/**
 * Implementación de logger basada en console
 */
class ConsoleLogger extends ILogger {
  /**
   * Constructor del logger
   * @param {boolean} [verbose=false] - Si es true, muestra logs detallados
   */
  constructor(verbose = false) {
    super();
    this.verbose = verbose;
  }
    /**
   * Registra un mensaje informativo
   * @param {string} message - Mensaje a mostrar
   * @param {object} [data] - Datos adicionales (solo se muestran en modo verbose)
   */
  info(message, data) {
    if (this.verbose && data) {
      console.log(`INFO: ${message}`, data);
    } else {
      console.log(`INFO: ${message}`);
    }
  }
  
  /**
   * Registra un mensaje de advertencia
   * @param {string} message - Mensaje de advertencia
   * @param {object} [data] - Datos adicionales
   */
  warn(message, data) {
    if (data) {
      console.warn(`WARN: ${message}`, data);
    } else {
      console.warn(`WARN: ${message}`);
    }
  }
  
  /**
   * Registra un mensaje de error
   * @param {string} message - Mensaje de error
   * @param {Error|object} [error] - Error o datos adicionales
   */
  error(message, error) {
    if (error) {
      console.error(`ERROR: ${message}`, error);
    } else {
      console.error(`ERROR: ${message}`);
    }
  }
}

// Singleton para uso en toda la aplicación
const logger = new ConsoleLogger(true);
export default logger;
