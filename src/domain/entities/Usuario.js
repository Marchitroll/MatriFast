/**
 * Clase abstracta Usuario - Extiende Persona con email y rol
 * Refactorizada usando constantes de roles centralizadas
 */
import Persona from './Persona';
import { ROLES_VALIDOS } from '../constants/Roles';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

class Usuario extends Persona {
  #email;
  #role;

  constructor({ id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, role, rol }) {
    super({ id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento });

    if (new.target === Usuario) {
      throw new TypeError('No se puede instanciar la clase abstracta Usuario');
    }

    this.email = email;
    this.role = role || rol;
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

  get role() { return this.#role; }
  set role(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new TypeError('El rol es obligatorio');
    }
    const roleNorm = valor.trim().toUpperCase();
    if (!ROLES_VALIDOS.includes(roleNorm)) {
      console.warn(`Rol "${valor}" podría no ser válido`);
    }
    this.#role = roleNorm;
  }

  get rol() { return this.#role; }
  set rol(valor) { this.role = valor; }

  toString() {
    return `${super.toString()} - Email: ${this.#email}, Role: ${this.#role}`;
  }

  toPlainObject() {
    return {
      ...super.toPlainObject(),
      email: this.#email,
      role: this.#role,
      rol: this.#role
    };
  }
}

export default Usuario;
