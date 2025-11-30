/**
 * Clase abstracta Usuario - Extiende Persona con email y rol
 * Refactorizada para usar objeto de configuración
 */
import Persona from './Persona';

const ROLES_VALIDOS = ['DOCENTE', 'REPRESENTANTE LEGAL', 'ESTUDIANTE'];
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

class Usuario extends Persona {
  #email;
  #rol;

  constructor({ id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol }) {
    super({ id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento });

    if (new.target === Usuario) {
      throw new TypeError('No se puede instanciar la clase abstracta Usuario');
    }

    this.email = email;
    this.rol = rol;
  }

  get email() { return this.#email; }
  set email(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El email es obligatorio');
    }
    const emailNorm = valor.trim().toLowerCase();
    if (!EMAIL_REGEX.test(emailNorm)) {
      throw new TypeError(`Email "${valor}" no tiene formato válido`);
    }
    this.#email = emailNorm;
  }

  get rol() { return this.#rol; }
  set rol(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El rol es obligatorio');
    }
    const rolNorm = valor.trim().toUpperCase();
    if (!ROLES_VALIDOS.includes(rolNorm)) {
      console.warn(`Rol "${valor}" podría no ser válido`);
    }
    this.#rol = rolNorm;
  }

  toString() {
    return `${super.toString()} - Email: ${this.#email}, Rol: ${this.#rol}`;
  }

  toPlainObject() {
    return {
      ...super.toPlainObject(),
      email: this.#email,
      rol: this.#rol
    };
  }
}

export default Usuario;
