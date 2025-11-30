/**
 * Builder para crear objetos RepresentanteLegal de forma fluida
 * Patrón Builder - simplifica la creación de objetos con muchos parámetros
 */
import RepresentanteLegal from '../entities/RepresentanteLegal';
import Documento from '../entities/Documento';
import Ubicacion from '../entities/Ubicacion';

class RepresentanteLegalBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this._data = {
      id: null,
      nombres: '',
      aPaterno: '',
      aMaterno: null,
      fechaNacimiento: null,
      sexo: '',
      documento: null,
      email: '',
      rol: 'REPRESENTANTE LEGAL',
      tipoRelacion: '',
      direccion: null,
      numeroCelular: '',
      viveConEstudiante: false
    };
    return this;
  }

  conId(id) {
    this._data.id = id;
    return this;
  }

  conPersona({ nombres, aPaterno, aMaterno = null }) {
    this._data.nombres = nombres;
    this._data.aPaterno = aPaterno;
    this._data.aMaterno = aMaterno;
    return this;
  }

  conFechaNacimiento(fecha) {
    this._data.fechaNacimiento = fecha;
    return this;
  }

  conSexo(sexo) {
    this._data.sexo = sexo;
    return this;
  }

  conDocumento(tipo, numero) {
    this._data.documento = new Documento(tipo, numero);
    return this;
  }

  conDocumentoObj(documento) {
    this._data.documento = documento;
    return this;
  }

  conEmail(email) {
    this._data.email = email;
    return this;
  }

  conRelacion(tipoRelacion) {
    this._data.tipoRelacion = tipoRelacion;
    return this;
  }

  conDireccion(direccion) {
    this._data.direccion = typeof direccion === 'string' 
      ? new Ubicacion(direccion) 
      : direccion;
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
