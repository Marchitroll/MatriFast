import UsuarioFactory from '../Interfaces/UsuarioFactory';
import Docente from '../Docente';

/**
 * Creador concreto para instanciar Docente.
 */
class DocenteFactory extends UsuarioFactory {
  crearUsuario(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol) {
    return new Docente(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol);
  }
}

export default DocenteFactory;
