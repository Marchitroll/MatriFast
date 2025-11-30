/**
 * Clase Docente - Extiende Usuario
 * Simplificada usando objeto de configuración
 */
import Usuario from './Usuario';

class Docente extends Usuario {
  constructor(config) {
    super({ ...config, rol: config.rol || 'DOCENTE' });
  }

  toString() {
    return `Docente: ${super.toString()}`;
  }

  toPlainObject() {
    return { ...super.toPlainObject(), tipoUsuario: 'DOCENTE' };
  }
}

export default Docente;
