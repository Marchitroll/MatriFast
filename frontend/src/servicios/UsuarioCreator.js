/**
 * Servicio para crear objetos de dominio de usuario
 */
import IUsuarioCreator from '../modelos/interfaces/IUsuarioCreator';
import DocenteFactory from '../modelos/Fabricas/DocenteFactory';
import RepresentanteLegalFactory from '../modelos/Fabricas/RepresentanteLegalFactory';
import Documento from '../modelos/Documento';
import Ubicacion from '../modelos/Ubicacion';
import logger from './Logger';
import EstudianteFactory from '../modelos/Fabricas/EstudianteFactory';


class UsuarioCreator extends IUsuarioCreator {
  /**
   * Constructor del creador de usuarios
   * @param {DocenteFactory} docenteFactory - Fabrica de docentes 
   * @param {RepresentanteLegalFactory} representanteLegalFactory - Fabrica de representantes
   */
  constructor(docenteFactory = null, representanteLegalFactory = null, estudianteFactory = null) {
    super();
    this.docenteFactory = docenteFactory || new DocenteFactory();
    this.representanteLegalFactory = representanteLegalFactory || new RepresentanteLegalFactory();
    this.estudianteFactory = estudianteFactory || new EstudianteFactory();

  }

  /**
   * Crea un objeto Documento a partir de los datos del formulario
   * @param {object} formData Datos del formulario
   * @returns {object} { documento, error }
   * @private
   */
  #crearDocumento(formData) {
    try {
      const documento = new Documento(formData.tipoDocumento, formData.numeroDocumento);
      return { documento, error: null };
    } catch (error) {
      logger.error('Error al crear documento', error);
      return { documento: null, error: error.message };
    }
  }
  /**
   * Crea un objeto Ubicacion a partir de los datos del formulario
   * @param {object} formData Datos del formulario
   * @returns {object} { ubicacion, error }
   * @private
   */
  #crearUbicacion(formData) {
    try {
      const ubicacion = new Ubicacion(formData.direccion);
      return { ubicacion, error: null };
    } catch (error) {
      logger.error('Error al crear ubicación', error);
      return { ubicacion: null, error: error.message };
    }
  }
  /**
   * Crea un objeto Docente
   * @param {object} datosUsuario - Datos comunes del usuario
   * @param {object} datosDocente - Datos específicos del docente
   * @returns {Promise<object>} - Resultado con objeto docente y documento
   * @private
   */
  async #crearObjetoDocente(datosUsuario, datosDocente) {
    // Crear documento
    const { documento, error: docError } = this.#crearDocumento(datosDocente);
    if (docError) {
      return { success: false, error: `Error al crear el documento: ${docError}` };
    }

    try {
      const { email, role } = datosUsuario;
      const { nombres, aPaterno, aMaterno, fechaNacimiento, sexo } = datosDocente;

      const userId = 'id-pendiente'; // Este ID se establecerá después

      // La fábrica se encarga de la creación del objeto Docente
      const nuevoDocente = this.docenteFactory.crearUsuario(
        userId,
        nombres,
        aPaterno,
        aMaterno,
        fechaNacimiento,
        sexo,
        documento,
        email,
        role
      );

      return {
        success: true,
        data: { docente: nuevoDocente, documento }
      };
    } catch (error) {
      logger.error('Error al crear docente', error);
      return { success: false, error: error.message };
    }
  }
  async #crearObjetoEstudiante(datosUsuario, datosEstudiante) {
    const { documento, error: docError } = this.#crearDocumento(datosEstudiante);
    if (docError) return { success: false, error: `Error al crear documento: ${docError}` };    const { ubicacion: lugarNacimiento, error: nacimientoError } = this.#crearUbicacion({
      direccion: datosEstudiante.lugarNacimiento
    });
    if (nacimientoError) return { success: false, error: `Error en lugar de nacimiento: ${nacimientoError}` };

    const { ubicacion: domicilioActual, error: domicilioError } = this.#crearUbicacion(datosEstudiante);
    if (domicilioError) return { success: false, error: `Error en domicilio actual: ${domicilioError}` };

    // Crear representante legal
    const rlResult = await this.#crearObjetoRepresentanteLegal(datosUsuario, datosEstudiante.representanteLegalInscriptor);
    if (!rlResult.success) return { success: false, error: `Error en representante legal: ${rlResult.error}` };
    const representanteLegal = rlResult.data.representanteLegal;

    try {
      const estudiante = this.estudianteFactory.crearUsuario(
        'id-pendiente',
        datosEstudiante.nombres,
        datosEstudiante.aPaterno,
        datosEstudiante.aMaterno || null,
        datosEstudiante.fechaNacimiento,
        datosEstudiante.sexo,
        documento,
        lugarNacimiento,
        datosEstudiante.tieneDiscapacidad || false,
        domicilioActual,
        datosEstudiante.tieneDispositivosElectronicos || false,
        !!datosEstudiante.tieneInternet,
        representanteLegal
      );

      return {
        success: true,
        data: {
          estudiante,
          documento,
          lugarNacimiento,
          domicilioActual,
          representanteLegal
        }
      };
    } catch (error) {
      logger.error('Error al crear estudiante', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crea un objeto RepresentanteLegal
   * @param {object} datosUsuario - Datos comunes del usuario
   * @param {object} datosRL - Datos específicos del representante
   * @returns {Promise<object>} - Resultado con objetos creados
   * @private
   */
  async #crearObjetoRepresentanteLegal(datosUsuario, datosRL) {
    // Crear documento
    const { documento, error: docError } = this.#crearDocumento(datosRL);
    if (docError) {
      return { success: false, error: `Error al crear el documento: ${docError}` };
    }

    // Crear ubicación
    const { ubicacion, error: ubicacionError } = this.#crearUbicacion(datosRL);
    if (ubicacionError) {
      return { success: false, error: `Error al crear la ubicación: ${ubicacionError}` };
    }

    try {
      const { email, role } = datosUsuario;
      const {
        nombres,
        aPaterno,
        aMaterno,
        fechaNacimiento,
        sexo,
        tipoRelacion,
        numeroCelular,
        viveConEstudiante
      } = datosRL;

      const userId = 'id-pendiente'; // Este ID se establecerá después

      // La fábrica se encarga de la creación del objeto RepresentanteLegal
      const nuevoRL = this.representanteLegalFactory.crearUsuario(
        userId,
        nombres,
        aPaterno,
        aMaterno || null,
        fechaNacimiento,
        sexo,
        documento,
        email,
        role,
        tipoRelacion,
        ubicacion,
        numeroCelular,
        !!viveConEstudiante
      );

      return {
        success: true,
        data: {
          representanteLegal: nuevoRL,
          documento,
          ubicacion
        }
      };
    } catch (error) {
      logger.error('Error al crear representante legal', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crea un usuario según su rol
   * @param {object} datosUsuario - Datos comunes
   * @param {object} datosEspecificos - Datos según el rol
   * @returns {Promise<object>} Resultado con objetos creados
   */
  async crearUsuario(datosUsuario, datosEspecificos) {
    const { role } = datosUsuario;

    if (role === 'DOCENTE') {
      return this.#crearObjetoDocente(datosUsuario, datosEspecificos);
    } else if (role === 'REPRESENTANTE LEGAL') {
      return this.#crearObjetoRepresentanteLegal(datosUsuario, datosEspecificos);
    }
    else if (role === 'ESTUDIANTE') {
      return this.#crearObjetoEstudiante(datosUsuario, datosEspecificos);
    }
    else {
      logger.error(`Rol no soportado: ${role}`);
      return { success: false, error: `Rol "${role}" no reconocido.` };
    }
  }
}

export default UsuarioCreator;
