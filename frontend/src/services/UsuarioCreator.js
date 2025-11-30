/**
 * Servicio de creación de usuarios usando Strategy Pattern
 * Reemplaza los if/else por un mapa de estrategias (OCP)
 */
import { DocenteBuilder, RepresentanteLegalBuilder } from '../domain';
import { Documento, Ubicacion } from '../domain';
import logger from './Logger';

// Estrategias de creación por rol
const ESTRATEGIAS = {
  'DOCENTE': (datosUsuario, datosEspecificos) => {
    try {
      const docente = DocenteBuilder.fromFormData(datosEspecificos, datosUsuario.email);
      return { 
        success: true, 
        data: { 
          usuario: docente, 
          documento: docente.documento 
        } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  'REPRESENTANTE LEGAL': (datosUsuario, datosEspecificos) => {
    try {
      const rl = RepresentanteLegalBuilder.fromFormData(datosEspecificos, datosUsuario.email);
      return { 
        success: true, 
        data: { 
          usuario: rl, 
          documento: rl.documento,
          ubicacion: rl.direccion
        } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

class UsuarioCreator {
  /**
   * Crea un usuario según su rol usando la estrategia correspondiente
   */
  async crearUsuario(datosUsuario, datosEspecificos) {
    const { role } = datosUsuario;
    const estrategia = ESTRATEGIAS[role];

    if (!estrategia) {
      logger.error(`Rol no soportado: ${role}`);
      return { success: false, error: `Rol "${role}" no reconocido` };
    }

    return estrategia(datosUsuario, datosEspecificos);
  }

  /**
   * Registra una nueva estrategia de creación (extensibilidad OCP)
   */
  static registrarEstrategia(rol, estrategia) {
    ESTRATEGIAS[rol] = estrategia;
  }
}

export default UsuarioCreator;
