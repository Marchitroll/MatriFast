/**
 * Servicio principal de usuarios refactorizado según principios SOLID
 */
import IUsuarioValidator from '../modelos/interfaces/IUsuarioValidator';
import IUsuarioCreator from '../modelos/interfaces/IUsuarioCreator';
import IUsuarioPersistence from '../modelos/interfaces/IUsuarioPersistence';
import UsuarioValidator from './UsuarioValidator';
import UsuarioCreator from './UsuarioCreator';
import UsuarioPersistence from './UsuarioPersistence';
import supabase from '../config/ClienteSupabase';
import logger from './Logger';

/**
 * Clase que implementa el servicio para la creación y manejo de objetos de usuario
 * Refactorizado para seguir principios SOLID
 */
class UsuarioService {
  /**
   * Constructor del servicio de usuarios
   * @param {IUsuarioValidator} validator - Validador de usuarios
   * @param {IUsuarioCreator} creator - Creador de objetos de dominio
   * @param {IUsuarioPersistence} persistence - Servicio de persistencia
   */
  constructor(validator = null, creator = null, persistence = null) {
    // Inyección de dependencias
    this.validator = validator || new UsuarioValidator();
    this.creator = creator || new UsuarioCreator();
    this.persistence = persistence || new UsuarioPersistence(supabase);
  }  /**
   * Valida los campos requeridos para el registro
   * @param {string} role Rol del usuario
   * @param {object} formData Datos del formulario
   * @returns {object} { esValido, mensaje }
   */
  validarCamposRequeridos(role, formData) {
    return this.validator.validarCamposRequeridos(role, formData);
  }
  /**
   * Registra un nuevo usuario (solo crea objetos de dominio)
   * @param {object} datosUsuario Datos comunes del usuario
   * @param {object} datosEspecificos Datos específicos según el rol
   * @returns {Promise<object>} Resultado del registro
   */
  async registrarUsuario(datosUsuario, datosEspecificos) {
    // Validar campos antes de cualquier otra operación
    const validacion = this.validarCamposRequeridos(datosUsuario.role, datosEspecificos);
    if (!validacion.esValido) {
      return { success: false, error: validacion.mensaje };
    }
    
    // Delegar la creación de objetos al servicio especializado
    return await this.creator.crearUsuario(datosUsuario, datosEspecificos);
  }  /**
   * Registra un nuevo usuario (completo, incluyendo persistencia)
   * @param {object} datosUsuario Datos comunes del usuario
   * @param {object} datosEspecificos Datos específicos según el rol
   * @returns {Promise<object>} Resultado del registro
   */
  async registrarUsuarioCompleto(datosUsuario, datosEspecificos) {
    // 1. Primero crear los objetos de dominio usando el método existente
    const resultado = await this.registrarUsuario(datosUsuario, datosEspecificos);
    if (!resultado.success) {
      return resultado;
    }
    
    // 2. Luego persistir los datos según el rol
    const { role } = datosUsuario;
    
    if (role === 'DOCENTE') {
      logger.info('Iniciando persistencia de docente');
      const persistenciaResult = await this.persistence.persistirDocente(resultado.data.docente);
      
      if (!persistenciaResult.success) {
        logger.error('Error al persistir docente', persistenciaResult.error);
        return {
          success: false,
          error: `Error al guardar en base de datos: ${persistenciaResult.error}`,
          data: resultado.data // Incluir los objetos creados para posible uso
        };
      }
      
      // Combinar el resultado original con los IDs de la base de datos
      return {
        success: true,
        data: {
          ...resultado.data,
          idPersona: persistenciaResult.data.idPersona,
          idUsuario: persistenciaResult.data.idUsuario
        }
      };
    } 

    else if (role === 'ESTUDIANTE') {
    logger.info('Iniciando persistencia de estudiante');
    const persistenciaResult = await this.persistence.persistirEstudiante(resultado.data.estudiante, {
      lugarNacimiento: resultado.data.lugarNacimiento,
      domicilioActual: resultado.data.domicilioActual,
      lengua: resultado.data.lengua,
      representanteLegalInscriptor: resultado.data.representanteLegal
    });
    if (!persistenciaResult.success) {
      logger.error('Error al persistir estudiante', persistenciaResult.error);
      return {
        success: false,
        error: `Error al guardar en base de datos: ${persistenciaResult.error}`,
        data: resultado.data
      };
    }
    return {
      success: true,
      data: {
        ...resultado.data,
        idPersona: persistenciaResult.data.idPersona,
        idUsuario: persistenciaResult.data.idUsuario
      }
    };      
    }
      else if (role === 'REPRESENTANTE LEGAL') {
      // Implementar cuando se necesite
      return {
        success: false,
        error: 'Persistencia de representante legal no implementada todavía',
        data: resultado.data
      };
    }
    
    // Para otros roles, solo retornar el resultado original
    return resultado;
  }
}

// Exportar la clase para usarla en otros módulos
export default UsuarioService;
