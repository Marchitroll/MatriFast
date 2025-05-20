/**
 * Servicio para crear objetos de dominio de usuario
 */
import IUsuarioCreator from '../modelos/interfaces/IUsuarioCreator';
import DocenteFactory from '../modelos/Fabricas/DocenteFactory';
import RepresentanteLegalFactory from '../modelos/Fabricas/RepresentanteLegalFactory';
import Documento from '../modelos/Documento';
import Ubicacion from '../modelos/Ubicacion';
import Lenguas from '../modelos/Lenguas';
import TIPOS_LENGUAS from '../modelos/enums/TiposLenguas';
import logger from './Logger';

class UsuarioCreator extends IUsuarioCreator {
  /**
   * Constructor del creador de usuarios
   * @param {DocenteFactory} docenteFactory - Fabrica de docentes 
   * @param {RepresentanteLegalFactory} representanteLegalFactory - Fabrica de representantes
   */
  constructor(docenteFactory = null, representanteLegalFactory = null) {
    super();
    this.docenteFactory = docenteFactory || new DocenteFactory();
    this.representanteLegalFactory = representanteLegalFactory || new RepresentanteLegalFactory();
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
      const ubicacion = new Ubicacion(
        formData.codUbigeo || '',
        formData.direccion,
        formData.departamento,
        formData.provincia,
        formData.distrito
      );
      return { ubicacion, error: null };
    } catch (error) {
      logger.error('Error al crear ubicación', error);
      return { ubicacion: null, error: error.message };
    }
  }

  /**
   * Crea un objeto Lenguas a partir de los datos del formulario
   * @param {object} formData Datos del formulario
   * @returns {object} { perfilLinguistico, error }
   * @private
   */
  #crearPerfilLinguistico(formData) {
    try {
      const lenguaPrincipalValue = TIPOS_LENGUAS[formData.lenguaPrincipal];
      const lenguaSecundariaValue = formData.lenguaSecundaria ? TIPOS_LENGUAS[formData.lenguaSecundaria] : null;

      if (!lenguaPrincipalValue) {
        const error = `Valor de lengua principal no encontrado: ${formData.lenguaPrincipal}`;
        return { perfilLinguistico: null, error };
      }

      if (formData.lenguaSecundaria && !lenguaSecundariaValue) {
        const error = `Valor de lengua secundaria no encontrado: ${formData.lenguaSecundaria}`;
        return { perfilLinguistico: null, error };
      }

      const perfilLinguistico = new Lenguas(lenguaPrincipalValue, lenguaSecundariaValue);
      return { perfilLinguistico, error: null };
    } catch (error) {
      logger.error('Error al crear perfil lingüístico', error);
      return { perfilLinguistico: null, error: error.message };
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
    
    // Crear perfil lingüístico
    const { perfilLinguistico, error: lenguasError } = this.#crearPerfilLinguistico(datosRL);
    if (lenguasError) {
      return { success: false, error: `Error al crear el perfil lingüístico: ${lenguasError}` };
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
        etnia,
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
        perfilLinguistico,
        etnia || null,
        numeroCelular,
        !!viveConEstudiante
      );
      
      return { 
        success: true, 
        data: { 
          representanteLegal: nuevoRL, 
          documento, 
          ubicacion, 
          perfilLinguistico 
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
    } else {
      logger.error(`Rol no soportado: ${role}`);
      return { success: false, error: `Rol "${role}" no reconocido.` };
    }
  }
}

export default UsuarioCreator;
