import Estudiante from '../Estudiante';
import UsuarioFactory from '../Interfaces/UsuarioFactory';

/**
 * Fábrica para crear objetos de tipo Estudiante
 */
class EstudianteFactory extends UsuarioFactory {
  /**
   * Crea un nuevo objeto Estudiante
   * 
   * @param {string} id - ID del usuario (puede ser temporalmente 'id-pendiente')
   * @param {string} nombres
   * @param {string} aPaterno
   * @param {string|null} aMaterno
   * @param {string} fechaNacimiento - en formato ISO (yyyy-mm-dd)
   * @param {string} sexo
   * @param {Documento} documento
   * @param {Ubicacion} lugarNacimiento
   * @param {Lenguas} lengua
   * @param {string|null} etnia
   * @param {Discapacidad|null} discapacidad
   * @param {Ubicacion} domicilioActual
   * @param {boolean} tieneDispositivosElectronicos
   * @param {boolean} tieneInternet
   * @param {RepresentanteLegal} representanteLegalInscriptor
   * 
   * @returns {Estudiante}
   */
  crearUsuario(
    id,
    nombres,
    aPaterno,
    aMaterno,
    fechaNacimiento,
    sexo,
    documento,
    lugarNacimiento,
    lengua,
    etnia,
    discapacidad,
    domicilioActual,
    tieneDispositivosElectronicos,
    tieneInternet,
    representanteLegalInscriptor
  ) {
    return new Estudiante(
      id,
      nombres,
      aPaterno,
      aMaterno,
      fechaNacimiento,
      sexo,
      documento,
      lugarNacimiento,
      lengua,
      etnia,
      discapacidad,
      domicilioActual,
      tieneDispositivosElectronicos,
      tieneInternet,
      representanteLegalInscriptor
    );
  }
}

export default EstudianteFactory;
