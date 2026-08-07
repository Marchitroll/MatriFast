/**
 * Builder para crear objetos Docente de forma fluida
 * Patrón Builder - extiende UsuarioBuilder
 */
import UsuarioBuilder from './UsuarioBuilder';
import Docente from '../entities/Docente';
import { ROLES } from '../constants/Roles';

class DocenteBuilder extends UsuarioBuilder {
  constructor() {
    super(ROLES.DOCENTE);
  }

  /**
   * Construye el objeto Docente con los datos configurados
   * @returns {Docente}
   */
  build() {
    const { id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol } = this._data;
    return new Docente({ id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol });
  }

  /**
   * Crea un Docente desde datos de formulario
   * @param {Object} formData - Datos del formulario
   * @param {string} email - Email del usuario
   * @returns {Docente}
   */
  static fromFormData(formData, email) {
    return new DocenteBuilder()
      .conPersona({
        nombres: formData.nombres,
        aPaterno: formData.aPaterno,
        aMaterno: formData.aMaterno || null
      })
      .conFechaNacimiento(formData.fechaNacimiento)
      .conSexo(formData.sexo)
      .conDocumento(formData.tipoDocumento, formData.numeroDocumento)
      .conEmail(email)
      .build();
  }
}

export default DocenteBuilder;
