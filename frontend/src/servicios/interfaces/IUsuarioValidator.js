/**
 * Interfaz para validadores de usuario
 * @interface
 */
export default class IUsuarioValidator {
  /**
   * Valida los campos requeridos para un usuario
   * @param {object} formData Datos del formulario a validar
   * @returns {object} { esValido, mensaje }
   */
  validarCamposRequeridos(formData) {
    throw new Error('El método validarCamposRequeridos debe ser implementado');
  }
}
