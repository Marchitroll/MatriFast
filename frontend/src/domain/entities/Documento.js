/**
 * Clase Documento - Representa un documento de identidad
 * Implementa Strategy Pattern para validación según tipo
 */
import ValidadorDNI from './validators/ValidadorDNI';
import ValidadorCE from './validators/ValidadorCE';
import ValidadorPTP from './validators/ValidadorPTP';
import ValidadorCodigoEstudiante from './validators/ValidadorCodigoEstudiante';
import ValidadorGenerico from './validators/ValidadorGenerico';

const TIPOS_DOCUMENTO = ['DNI', 'CE', 'PTP', 'CODIGO_ESTUDIANTE', 'OTRO'];

const VALIDADORES = {
  'DNI': ValidadorDNI,
  'CE': ValidadorCE,
  'PTP': ValidadorPTP,
  'CODIGO_ESTUDIANTE': ValidadorCodigoEstudiante,
};

class Documento {
  #tipo;
  #numero;
  #validador;

  constructor(tipo, numero) {
    if (!tipo || typeof tipo !== 'string') {
      throw new Error('El tipo de documento es obligatorio');
    }
    if (!numero) {
      throw new Error('El número de documento es obligatorio');
    }

    const tipoNorm = tipo.trim().toUpperCase();
    const numeroNorm = String(numero).trim();
    
    this.#validador = this.#obtenerValidador(tipoNorm);
    
    if (!this.#validador.validar(numeroNorm)) {
      throw new Error(`El número "${numeroNorm}" no es válido para tipo "${tipoNorm}"`);
    }

    this.#tipo = tipoNorm;
    this.#numero = numeroNorm;
  }

  get tipo() { return this.#tipo; }
  get numero() { return this.#numero; }

  #obtenerValidador(tipo) {
    const ValidadorClase = VALIDADORES[tipo];
    return ValidadorClase ? new ValidadorClase() : new ValidadorGenerico();
  }

  validar() {
    return this.#validador.validar(this.#numero);
  }

  toString() {
    return `${this.#tipo}: ${this.#numero}`;
  }

  toPlainObject() {
    return { tipo: this.#tipo, numero: this.#numero };
  }
}

export default Documento;
