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
   * @param {string} sexo   * @param {Documento} documento
   * @param {Ubicacion} lugarNacimiento
   * @param {boolean} tieneDiscapacidad
   * @param {Ubicacion} domicilioActual
   * @param {boolean} tieneDispositivosElectronicos
   * @param {boolean} tieneInternet
   * @param {RepresentanteLegal|null} representanteLegalInscriptor - Representante legal que inscribe, si aplica.
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
    tieneDiscapacidad,
    domicilioActual,
    tieneDispositivosElectronicos,
    tieneInternet,
    representanteLegalInscriptor
  ) {    return new Estudiante(
      id,
      nombres,
      aPaterno,
      aMaterno,
      fechaNacimiento,      sexo,
      documento,
      lugarNacimiento,
      tieneDiscapacidad,
      domicilioActual,
      tieneDispositivosElectronicos,
      tieneInternet,
      representanteLegalInscriptor
    );
  }
}

export default EstudianteFactory;
