/**
 * Interfaz para servicios de validación de usuario
 * @interface
 */
export default class IUsuarioValidator {
  /**
   * Valida los campos requeridos para el registro
   * @param {string} role Rol del usuario
   * @param {object} formData Datos del formulario
   * @returns {object} { esValido, mensaje }
   */
  validarCamposRequeridos(role, formData) {
    throw new Error('Método validarCamposRequeridos debe ser implementado');
  }
}
