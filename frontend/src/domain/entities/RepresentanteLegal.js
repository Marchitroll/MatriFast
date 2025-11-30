/**
 * Clase RepresentanteLegal - Extiende Usuario con datos adicionales
 * Refactorizada usando objeto de configuración
 */
import Usuario from './Usuario';
import Ubicacion from './Ubicacion';

const TIPOS_RELACION = ['PADRE', 'MADRE', 'TUTOR', 'ABUELO', 'HERMANO'];
const CELULAR_REGEX = /^9\d{8}$/;

class RepresentanteLegal extends Usuario {
  #tipoRelacion;
  #direccion;
  #numeroCelular;
  #viveConEstudiante;
  #estudiantes;

  constructor({ 
    id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, 
    tipoRelacion, direccion, numeroCelular, viveConEstudiante = false 
  }) {
    super({ id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol: 'REPRESENTANTE LEGAL' });

    this.tipoRelacion = tipoRelacion;
    this.direccion = direccion;
    this.numeroCelular = numeroCelular;
    this.viveConEstudiante = viveConEstudiante;
    this.#estudiantes = [];
  }

  get tipoRelacion() { return this.#tipoRelacion; }
  set tipoRelacion(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El tipo de relación es obligatorio');
    }
    const tipoNorm = valor.trim().toUpperCase();
    if (!TIPOS_RELACION.includes(tipoNorm)) {
      console.warn(`Tipo de relación "${valor}" podría no ser válido`);
    }
    this.#tipoRelacion = tipoNorm;
  }

  get direccion() { return this.#direccion; }
  set direccion(valor) {
    if (!(valor instanceof Ubicacion)) {
      throw new TypeError('La dirección debe ser instancia de Ubicacion');
    }
    this.#direccion = valor;
  }

  get numeroCelular() { return this.#numeroCelular; }
  set numeroCelular(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El número de celular es obligatorio');
    }
    const celular = valor.trim().replace(/\s+/g, '');
    if (!CELULAR_REGEX.test(celular)) {
      throw new TypeError(`Celular "${valor}" no tiene formato válido (9 dígitos, inicia con 9)`);
    }
    this.#numeroCelular = celular;
  }

  get viveConEstudiante() { return this.#viveConEstudiante; }
  set viveConEstudiante(valor) {
    this.#viveConEstudiante = !!valor;
  }

  get estudiantes() { return [...this.#estudiantes]; }

  agregarEstudiante(estudiante) {
    if (!this.#estudiantes.some(e => e.id === estudiante.id)) {
      this.#estudiantes.push(estudiante);
    }
  }

  toString() {
    return `Rep. Legal: ${super.toString()} - ${this.#tipoRelacion}`;
  }

  toPlainObject() {
    return {
      ...super.toPlainObject(),
      tipoRelacion: this.#tipoRelacion,
      direccion: this.#direccion?.toPlainObject(),
      numeroCelular: this.#numeroCelular,
      viveConEstudiante: this.#viveConEstudiante,
      tipoUsuario: 'REPRESENTANTE_LEGAL'
    };
  }
}

export default RepresentanteLegal;
