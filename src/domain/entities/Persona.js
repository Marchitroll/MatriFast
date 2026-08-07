/**
 * Clase abstracta Persona - Base para Usuario
 * Refactorizada para usar objeto de configuración (KISS)
 */
import Documento from './Documento';

const SEXOS_VALIDOS = ['M', 'F'];

class Persona {
  #id;
  #nombres;
  #aPaterno;
  #aMaterno;
  #fechaNacimiento;
  #sexo;
  #documento;

  constructor({ id = null, nombres, aPaterno, aMaterno = null, fechaNacimiento, sexo, documento }) {
    if (new.target === Persona) {
      throw new TypeError('No se puede instanciar la clase abstracta Persona');
    }

    this.#id = id;
    this.nombres = nombres;
    this.aPaterno = aPaterno;
    this.aMaterno = aMaterno;
    this.fechaNacimiento = fechaNacimiento;
    this.sexo = sexo;
    this.documento = documento;
  }

  get id() { return this.#id; }

  get nombres() { return this.#nombres; }
  set nombres(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El nombre es obligatorio');
    }
    this.#nombres = valor.trim();
  }

  get aPaterno() { return this.#aPaterno; }
  set aPaterno(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El apellido paterno es obligatorio');
    }
    this.#aPaterno = valor.trim();
  }

  get aMaterno() { return this.#aMaterno; }
  set aMaterno(valor) {
    if (valor !== null && typeof valor !== 'string') {
      throw new TypeError('El apellido materno debe ser cadena o null');
    }
    this.#aMaterno = valor === null ? null : valor.trim();
  }

  get fechaNacimiento() { return this.#fechaNacimiento; }
  set fechaNacimiento(valor) {
    if (!valor) {
      throw new TypeError('La fecha de nacimiento es obligatoria');
    }
    const fecha = new Date(valor);
    if (isNaN(fecha.getTime())) {
      throw new TypeError('La fecha de nacimiento debe ser válida');
    }
    if (fecha > new Date()) {
      throw new TypeError('La fecha de nacimiento no puede ser futura');
    }
    this.#fechaNacimiento = fecha;
  }

  get sexo() { return this.#sexo; }
  set sexo(valor) {
    if (!SEXOS_VALIDOS.includes(valor)) {
      console.warn(`Sexo "${valor}" podría no ser válido`);
    }
    this.#sexo = valor;
  }

  get documento() { return this.#documento; }
  set documento(valor) {
    if (valor !== null && !(valor instanceof Documento)) {
      throw new TypeError('El documento debe ser instancia de Documento o null');
    }
    this.#documento = valor;
  }

  calcularEdad() {
    const hoy = new Date();
    let edad = hoy.getFullYear() - this.#fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - this.#fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < this.#fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  nombreCompleto() {
    return `${this.#nombres} ${this.#aPaterno} ${this.#aMaterno || ''}`.trim();
  }

  toString() {
    return `${this.nombreCompleto()} - ${this.#documento?.toString() || 'Sin documento'}`;
  }

  toPlainObject() {
    return {
      id: this.#id,
      nombres: this.#nombres,
      aPaterno: this.#aPaterno,
      aMaterno: this.#aMaterno,
      fechaNacimiento: this.#fechaNacimiento?.toISOString(),
      sexo: this.#sexo,
      documento: this.#documento?.toPlainObject() || null
    };
  }
}

export default Persona;
