import Usuario from './Usuario';
import Ubicacion from './Ubicacion';
import { getTiposRelacion, defaultValues as tiposRelacionDefault } from './enums/TiposRelacion.js';
import Estudiante from './Estudiante';

class RepresentanteLegal extends Usuario {
  #tipoRelacion;
  #direccion;
  #numeroCelular;
  #estudiantes;
  #viveConEstudiante;

  constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol, 
              tipoRelacion, direccion, numeroCelular, viveConEstudiante = false) {
    super(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol);
    
    this.tipoRelacion = tipoRelacion;
    this.direccion = direccion;
    this.numeroCelular = numeroCelular;
    this.viveConEstudiante = viveConEstudiante;
    this.#estudiantes = [];
  }

  get tipoRelacion() {
    return this.#tipoRelacion;
  }  set tipoRelacion(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El tipo de relación debe ser una cadena no vacía.');
    }
    
    const tipoNormalizado = valor.trim().toUpperCase();
    // Validación básica usando valores por defecto
    if (!tiposRelacionDefault.includes(tipoNormalizado)) {
      console.warn(`El tipo de relación "${valor}" podría no ser válido. Se recomienda usar validateTipoRelacion() para validación completa.`);
    }
    
    this.#tipoRelacion = tipoNormalizado;
  }

  /**
   * Valida el tipo de relación de forma asíncrona contra la base de datos
   * @param {string} valor - Tipo de relación a validar
   * @returns {Promise<boolean>} - true si es válido, false en caso contrario
   */
  async validateTipoRelacion(valor) {
    if (!valor || typeof valor !== 'string') {
      return false;
    }
    
    const tipoNormalizado = valor.trim().toUpperCase();
    
    try {
      const tiposPermitidos = await getTiposRelacion();
      return tiposPermitidos.includes(tipoNormalizado);
    } catch (error) {
      console.warn('Error al validar tipo de relación:', error);
      return tiposRelacionDefault.includes(tipoNormalizado);
    }
  }

  get direccion() {
    return this.#direccion;
  }

  set direccion(valor) {
    if (!(valor instanceof Ubicacion)) {
      throw new TypeError('La dirección debe ser una instancia de Ubicacion.');
    }
    this.#direccion = valor;
  }


  get numeroCelular() {
    return this.#numeroCelular;
  }

  set numeroCelular(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El número de celular debe ser una cadena no vacía.');
    }
    
    const celularNormalizado = valor.trim().replace(/\s+/g, '');
    if (!this.validarCelular(celularNormalizado)) {
      throw new TypeError(`El número de celular "${valor}" no tiene un formato válido.`);
    }
    
    this.#numeroCelular = celularNormalizado;
  }

  get estudiantes() {
    // Devuelve una copia del array para evitar modificaciones externas directas
    return [...this.#estudiantes];
  }

  get viveConEstudiante() {
    return this.#viveConEstudiante;
  }

  set viveConEstudiante(valor) {
    if (typeof valor !== 'boolean') {
      throw new TypeError('El atributo viveConEstudiante debe ser booleano.');
    }
    this.#viveConEstudiante = valor;
  }

  /**
   * Valida si el número de celular tiene un formato válido para Perú.
   * @param {string} numeroCelular - Número de celular a validar
   * @returns {boolean} - true si el número es válido, false en caso contrario
   */
  validarCelular(numeroCelular) {
    // Valida formato peruano: 9 dígitos comenzando con 9
    const regexCelularPeru = /^9\d{8}$/;
    return regexCelularPeru.test(numeroCelular);
  }

  /**
   * Agrega un estudiante a la lista de estudiantes relacionados con este representante legal
   * @param {Estudiante} estudiante - El estudiante a agregar
   */
  agregarEstudiante(estudiante) {
    if (!estudiante || !(estudiante instanceof Estudiante)) {
      throw new TypeError('El argumento "estudiante" debe ser una instancia de la clase Estudiante.');
    }
    // Validación básica para evitar duplicados usando el ID
    if (!this.#estudiantes.some(e => e.id === estudiante.id)) {
      this.#estudiantes.push(estudiante);
    }
  }

  /**
   * Elimina un estudiante de la lista de estudiantes relacionados
   * @param {string|number} idEstudiante - El ID del estudiante a eliminar
   * @returns {boolean} - true si se eliminó, false si no se encontró
   */
  eliminarEstudiante(idEstudiante) {
    const longitudInicial = this.#estudiantes.length;
    this.#estudiantes = this.#estudiantes.filter(e => e.id !== idEstudiante);
    return this.#estudiantes.length < longitudInicial;
  }

  toString() {
    return `Representante Legal: ${super.toString()} - Relación: ${this.#tipoRelacion} - Celular: ${this.#numeroCelular} - Vive con estudiante: ${this.#viveConEstudiante ? 'Sí' : 'No'}`;
  }
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      tipoRelacion: this.#tipoRelacion,
      direccion: this.#direccion ? this.#direccion.toPlainObject() : null,
      numeroCelular: this.#numeroCelular,
      viveConEstudiante: this.#viveConEstudiante,
      estudiantes: this.#estudiantes.map(e => ({ id: e.id }))
    };
  }
}

export default RepresentanteLegal;

