import UsuarioFactory from '../Interfaces/UsuarioFactory';
import RepresentanteLegal from '../RepresentanteLegal';

/**
 * Creador concreto para instanciar RepresentanteLegal.
 * Implementa el método crearUsuario de la interfaz UsuarioFactory.
 */
class RepresentanteLegalFactory extends UsuarioFactory {  /**
   * Crea una instancia completa de RepresentanteLegal con todos sus atributos específicos
   * 
   * @param {string|number} id - Identificador único del usuario
   * @param {string} nombres - Nombres del usuario
   * @param {string} aPaterno - Apellido paterno del usuario
   * @param {string} aMaterno - Apellido materno del usuario
   * @param {Date} fechaNacimiento - Fecha de nacimiento del usuario
   * @param {string} sexo - Sexo del usuario
   * @param {Object} documento - Objeto que representa el documento de identidad
   * @param {string} email - Correo electrónico del usuario
   * @param {string} rol - Rol del usuario en el sistema
   * @param {string} tipoRelacion - Tipo de relación con el estudiante (PADRE, MADRE, TUTOR, etc.)
   * @param {Ubicacion} direccion - Dirección del representante legal
   * @param {string} numeroCelular - Número de celular del representante
   * @param {boolean} viveConEstudiante - Indica si vive con el estudiante
   * @returns {RepresentanteLegal} Nueva instancia de RepresentanteLegal
   */
  crearUsuario(
    id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol,
    tipoRelacion, direccion, numeroCelular, viveConEstudiante = false
  ) {
    return new RepresentanteLegal(
      id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol,
      tipoRelacion, direccion, numeroCelular, viveConEstudiante
    );
  }
}

export default RepresentanteLegalFactory;
