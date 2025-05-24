/**
 * Implementación de validador de datos de usuario
 */
import IUsuarioValidator from '../modelos/interfaces/IUsuarioValidator';
import logger from './Logger';

class UsuarioValidator extends IUsuarioValidator {
  /**
   * Validador de campos de usuario
   */
  constructor() {
    super();
    // Mapa de campos requeridos por rol
    this.camposRequeridos = {
      'DOCENTE': [
        'nombres', 'aPaterno', 'fechaNacimiento', 'sexo',
        'tipoDocumento', 'numeroDocumento'
      ],
      'REPRESENTANTE LEGAL': [
        'nombres', 'aPaterno', 'fechaNacimiento', 'sexo', // Persona
        'tipoDocumento', 'numeroDocumento', // Documento
        'tipoRelacion', 'numeroCelular', // RepresentanteLegal específico
        'departamento', 'provincia', 'distrito', 'direccion', // Ubicacion
        'lenguaPrincipal' // Lenguas
      ],
      'ESTUDIANTE': [
        'nombres', 'aPaterno', 'fechaNacimiento', 'sexo',  // Persona
        'tipoDocumento', 'numeroDocumento',               // Documento
        'lugarNacimientoDepartamento', 'lugarNacimientoProvincia', 'lugarNacimientoDistrito', 'lugarNacimientoDireccion', // Lugar nacimiento (Ubicacion)
        'domicilioActualDepartamento', 'domicilioActualProvincia', 'domicilioActualDistrito', 'domicilioActualDireccion',   // Domicilio actual (Ubicacion)
        'lenguaPrincipal',        // Lenguas
        'tieneDispositivosElectronicos', 'tieneInternet'  // Datos adicionales
        // 'etnia' y 'discapacidad' pueden ser opcionales
      ]
    };
  }

  /**
   * Valida los campos requeridos para el registro
   * @param {string} role Rol del usuario
   * @param {object} formData Datos del formulario
   * @returns {object} { esValido, mensaje }
   */
  validarCamposRequeridos(role, formData) {
    const requiredFields = this.camposRequeridos[role];
    
    if (!requiredFields) {
      logger.error(`Rol no soportado para validación: ${role}`);
      return { esValido: false, mensaje: `Rol ${role} no soportado para validación` };
    }
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        logger.error(`Campo requerido no completado: ${fieldName}`);
        return { 
          esValido: false, 
          mensaje: `Por favor, complete el campo requerido: ${fieldName}.` 
        };
      }
    }

    if (role === 'ESTUDIANTE' && typeof formData.representanteLegal !== 'object') {
      logger.error('Datos del representante legal no proporcionados o inválidos');
      return {
        esValido: false,
        mensaje: 'Por favor, complete los datos del representante legal del estudiante.'
      };
    }

    
    return { esValido: true, mensaje: null };
  }
}

export default UsuarioValidator;
