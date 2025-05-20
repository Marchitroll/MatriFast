/**
 * Servicio para la creación y manejo de objetos de usuario
 */
import DocenteFactory from '../modelos/Fabricas/DocenteFactory';
import RepresentanteLegalFactory from '../modelos/Fabricas/RepresentanteLegalFactory';
import Documento from '../modelos/Documento';
import Ubicacion from '../modelos/Ubicacion';
import Lenguas from '../modelos/Lenguas';
import TIPOS_LENGUAS from '../modelos/enums/TiposLenguas';

/**
 * Clase que implementa el servicio para la creación y manejo de objetos de usuario
 */
class UsuarioService {
  /**
   * Constructor del servicio
   */
  constructor() {
    // Se podría inicializar dependencias aquí si fuera necesario
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
      console.error('Error al crear documento:', error);
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
      console.error('Error al crear ubicación:', error);
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
      console.error('Error al crear perfil lingüístico:', error);
      return { perfilLinguistico: null, error: error.message };
    }
  }
  /**
   * Crea un objeto Docente a partir de los datos del formulario
   * @param {object} datosUsuario Datos comunes del usuario
   * @param {object} datosDocente Datos específicos del docente
   * @param {Documento} documento Objeto Documento
   * @returns {object} { docente, error }
   * @private
   */
  #crearDocente(datosUsuario, datosDocente, documento) {
    try {
      const { email, role } = datosUsuario;
      const { nombres, aPaterno, aMaterno, fechaNacimiento, sexo } = datosDocente;
      
      // Aplicación del Patrón Factory Method:
      // Se instancia la fábrica específica para Docentes.
      const docenteFactory = new DocenteFactory();
      const userId = 'id-temporal-para-pruebas';
      
      // La fábrica se encarga de la creación del objeto Docente.
      const nuevoDocente = docenteFactory.crearUsuario(
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
      
      return { docente: nuevoDocente, error: null };
    } catch (error) {
      console.error('Error al crear docente:', error);
      return { docente: null, error: error.message };
    }
  }
  /**
   * Crea un objeto RepresentanteLegal a partir de los datos del formulario
   * @param {object} datosUsuario Datos comunes del usuario
   * @param {object} datosRL Datos específicos del representante legal
   * @param {Documento} documento Objeto Documento
   * @param {Ubicacion} ubicacion Objeto Ubicacion
   * @param {Lenguas} perfilLinguistico Objeto Lenguas
   * @returns {object} { representanteLegal, error }
   * @private
   */
  #crearRepresentanteLegal(datosUsuario, datosRL, documento, ubicacion, perfilLinguistico) {
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
      
      // Aplicación del Patrón Factory Method:
      // Se instancia la fábrica específica para Representantes Legales.
      const representanteLegalFactory = new RepresentanteLegalFactory();
      const userId = 'id-temporal-para-pruebas';
      
      // La fábrica se encarga de la creación del objeto RepresentanteLegal.
      const nuevoRL = representanteLegalFactory.crearUsuario(
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
      
      return { representanteLegal: nuevoRL, error: null };
    } catch (error) {
      console.error('Error al crear representante legal:', error);
      return { representanteLegal: null, error: error.message };
    }
  }  /**
   * Valida los campos requeridos para el registro
   * @param {string} role Rol del usuario
   * @param {object} formData Datos del formulario
   * @returns {object} { esValido, mensaje }
   */
  validarCamposRequeridos(role, formData) {
    let requiredFields = [];
    
    if (role === 'DOCENTE') {
      requiredFields = [
        'nombres', 'aPaterno', 'fechaNacimiento', 'sexo',
        'tipoDocumento', 'numeroDocumento'
      ];
    } else if (role === 'REPRESENTANTE LEGAL') {
      requiredFields = [
        'nombres', 'aPaterno', 'fechaNacimiento', 'sexo', // Persona
        'tipoDocumento', 'numeroDocumento', // Documento
        'tipoRelacion', 'numeroCelular', // RepresentanteLegal específico
        'departamento', 'provincia', 'distrito', 'direccion', // Ubicacion
        'lenguaPrincipal' // Lenguas
      ];
    } else {
      return { esValido: false, mensaje: `Rol ${role} no soportado para validación` };
    }
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        return { 
          esValido: false, 
          mensaje: `Por favor, complete el campo requerido: ${fieldName}.` 
        };
      }
    }
    
    return { esValido: true, mensaje: null };
  }

  /**
   * Registra un nuevo usuario (solo para testeo)
   * @param {object} datosUsuario Datos comunes del usuario
   * @param {object} datosEspecificos Datos específicos según el rol
   * @returns {object} Resultado del registro
   */
  async registrarUsuario(datosUsuario, datosEspecificos) {    const { role } = datosUsuario;
    let resultado = { success: false, error: null, data: null };
    
    // Validar campos antes de cualquier otra operación
    const validacion = this.validarCamposRequeridos(role, datosEspecificos);
    if (!validacion.esValido) {
      resultado.error = validacion.mensaje;
      return resultado;
    }
    
    if (role === 'DOCENTE') {
      // Crear documento
      const { documento, error: docError } = this.#crearDocumento(datosEspecificos);
      if (docError) {
        resultado.error = `Error al crear el documento: ${docError}`;
        return resultado;
      }
      
      // Crear docente
      const { docente, error: docenteError } = this.#crearDocente(datosUsuario, datosEspecificos, documento);
      if (docenteError) {
        resultado.error = `Error al procesar datos del docente: ${docenteError}`;
        return resultado;
      }
      
      // Éxito
      resultado.success = true;
      resultado.data = { docente, documento };
      console.log('Objeto Documento creado:', documento);
      console.log('Objeto Docente creado:', docente);
      console.log('Objeto Docente (plain):', docente.toPlainObject());
        } else if (role === 'REPRESENTANTE LEGAL') {
      // Crear documento
      const { documento, error: docError } = this.#crearDocumento(datosEspecificos);
      if (docError) {
        resultado.error = `Error al crear el documento: ${docError}`;
        return resultado;
      }
      
      // Crear ubicación
      const { ubicacion, error: ubicacionError } = this.#crearUbicacion(datosEspecificos);
      if (ubicacionError) {
        resultado.error = `Error al crear la ubicación: ${ubicacionError}`;
        return resultado;
      }
      
      // Crear perfil lingüístico
      const { perfilLinguistico, error: lenguasError } = this.#crearPerfilLinguistico(datosEspecificos);
      if (lenguasError) {
        resultado.error = `Error al crear el perfil lingüístico: ${lenguasError}`;
        return resultado;
      }
      
      // Crear representante legal
      const { representanteLegal, error: rlError } = this.#crearRepresentanteLegal(
        datosUsuario, 
        datosEspecificos, 
        documento, 
        ubicacion, 
        perfilLinguistico
      );
      if (rlError) {
        resultado.error = `Error al procesar datos del Representante Legal: ${rlError}`;
        return resultado;
      }
      
      // Éxito
      resultado.success = true;
      resultado.data = { representanteLegal, documento, ubicacion, perfilLinguistico };
      console.log('Objeto Documento creado (RL):', documento);
      console.log('Objeto Ubicacion creado (RL):', ubicacion);
      console.log('Objeto Lenguas creado (RL):', perfilLinguistico);
      console.log('Objeto RepresentanteLegal creado:', representanteLegal);
      console.log('Objeto RepresentanteLegal (plain):', representanteLegal.toPlainObject());
    } else {
      resultado.error = `Rol "${role}" no reconocido.`;
    }
    
    return resultado;
  }
}

// Exportar la clase para usarla en otros módulos
export default UsuarioService;
