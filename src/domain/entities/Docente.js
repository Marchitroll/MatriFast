/**
 * Clase Docente - Extiende Usuario
 * Usa constantes centralizadas de roles
 */
import Usuario from './Usuario';
import { ROLES } from '../constants/Roles';

class Docente extends Usuario {
  constructor(config) {
    super({ ...config, role: config.role || config.rol || ROLES.DOCENTE });
  }

  toString() {
    return `Docente: ${super.toString()}`;
  }

  toPlainObject() {
    return { ...super.toPlainObject(), tipoUsuario: ROLES.DOCENTE };
  }
}

export default Docente;
