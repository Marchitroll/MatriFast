/**
 * Builder para crear objetos RepresentanteLegal de forma fluida
 * Patrón Builder - extiende UsuarioBuilder
 */
import UsuarioBuilder from './UsuarioBuilder';
import RepresentanteLegal from '../entities/RepresentanteLegal';
import { ROLES } from '../constants/Roles';

class RepresentanteLegalBuilder extends UsuarioBuilder {
  constructor() {
    super(ROLES.REPRESENTANTE_LEGAL);
  }

  reset() {
    super.reset();
    this._data = {
      ...this._data,
      tipoRelacion: '',
      direccion: null,
      numeroCelular: '',
      viveConEstudiante: false
    };
    return this;
  }

  conRelacion(tipoRelacion) {
    this._data.tipoRelacion = tipoRelacion;
    return this;
  }

  conDireccion(direccion) {
    this._data.direccion = direccion;
    return this;
  }

  conCelular(numeroCelular) {
    this._data.numeroCelular = numeroCelular;
    return this;
  }

  conViveConEstudiante(vive) {
    this._data.viveConEstudiante = !!vive;
    return this;
  }

  /**
   * Construye el objeto RepresentanteLegal con los datos configurados
   * @returns {RepresentanteLegal}
   */
  build() {
    return new RepresentanteLegal(this._data);
  }

  /**
   * Crea un RepresentanteLegal desde datos de formulario
   * @param {Object} formData - Datos del formulario
   * @param {string} email - Email del usuario
   * @returns {RepresentanteLegal}
   */
  static fromFormData(formData, email) {
    return new RepresentanteLegalBuilder()
      .conPersona({
        nombres: formData.nombres,
        aPaterno: formData.aPaterno,
        aMaterno: formData.aMaterno || null
      })
      .conFechaNacimiento(formData.fechaNacimiento)
      .conSexo(formData.sexo)
      .conDocumento(formData.tipoDocumento, formData.numeroDocumento)
      .conEmail(email)
      .conRelacion(formData.tipoRelacion)
      .conDireccion(formData.direccion)
      .conCelular(formData.numeroCelular)
      .conViveConEstudiante(formData.viveConEstudiante)
      .build();
  }
}

export default RepresentanteLegalBuilder;
