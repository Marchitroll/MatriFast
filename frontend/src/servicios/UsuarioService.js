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
   * @param {object} datosCompletos Datos completos incluyendo email, password, role
   * @param {object} datosEspecificos Datos específicos según el rol
   * @returns {Promise<object>} Resultado del registro
   */
  async registrarUsuarioCompleto(datosCompletos, datosEspecificos) {
    const { email, password, role, ...datosUsuario } = datosCompletos;
    
    try {
      // 1. Validación exhaustiva
      logger.info(`Iniciando registro completo para rol: ${role}`);
      
      // 2. Validar campos específicos
      const validacion = this.validator.validarCamposRequeridos(role, datosEspecificos);
      if (!validacion.esValido) {
        return { success: false, error: validacion.mensaje };
      }
      
      // 3. Crear objetos de dominio
      const datosParaCreacion = { email, role, ...datosUsuario };
      const resultado = await this.registrarUsuario(datosParaCreacion, datosEspecificos);
      if (!resultado.success) {
        return resultado;
      }
      
      // 4. Persistir según el rol
      const persistenciaResult = await this.persistirSegunRol(role, resultado.data);
      
      return persistenciaResult;
      
    } catch (error) {
      logger.error('Error en registro completo:', error);
      return { success: false, error: error.message };
    }  }

  /**
   * Extrae la lógica de persistencia según el rol
   * @param {string} role Rol del usuario
   * @param {object} objetos Objetos de dominio creados
   * @returns {Promise<object>} Resultado de la persistencia
   */
  async persistirSegunRol(role, objetos) {
    switch (role) {
      case 'DOCENTE':
        logger.info('Iniciando persistencia de docente');
        return await this.persistence.persistirDocente(objetos.docente);
        
      case 'ESTUDIANTE':
        logger.info('Iniciando persistencia de estudiante');
        return await this.persistence.persistirEstudiante(
          objetos.estudiante, 
          {
            lugarNacimiento: objetos.lugarNacimiento,
            domicilioActual: objetos.domicilioActual,
            representanteLegalInscriptor: objetos.representanteLegal
          }
        );
        
      case 'REPRESENTANTE LEGAL':
        logger.info('Iniciando persistencia de representante legal');
        return await this.persistence.persistirRepresentanteLegal(
          objetos.representanteLegal,
          { direccion: objetos.direccion }
        );
        
      default:
        return { success: false, error: `Rol no soportado: ${role}` };
    }
  }
}

// Exportar la clase para usarla en otros módulos
export default UsuarioService;
