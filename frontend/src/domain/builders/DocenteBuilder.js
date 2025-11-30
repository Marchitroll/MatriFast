/**
 * Builder para crear objetos Docente de forma fluida
 * Patrón Builder - simplifica la creación de objetos con muchos parámetros
 */
import Docente from '../entities/Docente';
import Documento from '../entities/Documento';

class DocenteBuilder {
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
      rol: 'DOCENTE'
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
