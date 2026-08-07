/**
 * Base Builder para construir objetos Usuario de forma fluida
 * Patrón Builder - encapsula la lógica común de construcción
 */
import Documento from '../entities/Documento';

class UsuarioBuilder {
  constructor(defaultRol = '') {
    this.defaultRol = defaultRol;
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
      rol: this.defaultRol
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
}

export default UsuarioBuilder;
