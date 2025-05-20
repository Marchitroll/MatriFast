/**
 * Interfaz para servicios de creación de objetos de dominio
 * @interface
 */
export default class IUsuarioCreator {
  /**
   * Crea objetos de dominio a partir de datos de formulario
   * @param {object} datosUsuario - Datos comunes del usuario
   * @param {object} datosEspecificos - Datos específicos según rol
   * @returns {Promise<object>} Resultado con objetos de dominio creados
   */
  async crearUsuario(datosUsuario, datosEspecificos) {
    throw new Error('Método crearUsuario debe ser implementado');
  }
}
