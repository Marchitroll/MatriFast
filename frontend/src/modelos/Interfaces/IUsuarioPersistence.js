/**
 * Interfaz para servicios de persistencia
 * @interface
 */
export default class IUsuarioPersistence {
  /**
   * Persiste un docente en la base de datos
   * @param {object} docente - Objeto docente a persistir
   * @returns {Promise<object>} Resultado de la operación
   */
  async persistirDocente(docente) {
    throw new Error('Método persistirDocente debe ser implementado');
  }
  
  /**
   * Persiste un representante legal en la base de datos
   * @param {object} representanteLegal - Objeto representante legal a persistir
   * @param {object} objetos - Objetos adicionales relacionados (ej: { direccion: Ubicacion })
   * @returns {Promise<object>} Resultado de la operación
   */
  async persistirRepresentanteLegal(representanteLegal, objetos) {
    throw new Error('Método persistirRepresentanteLegal debe ser implementado');
  }
}
