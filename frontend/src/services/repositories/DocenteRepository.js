/**
 * Repositorio para persistencia de Docente
 */
import UsuarioRepository from './UsuarioRepository';
import logger from '../Logger';

class DocenteRepository extends UsuarioRepository {
  /**
   * Persiste un docente completo
   */
  async persistir(docente) {
    try {
      // 1. Crear usuario base
      const usuario = await this.crear(docente, 'DOCENTE');
      
      // 2. Crear registro específico de docente
      await this.insert('Docente', { idUsuario: usuario.id });

      logger.info('Docente persistido', { id: usuario.id });
      return { 
        success: true, 
        data: { idUsuario: usuario.id, idPersona: usuario.idPersona } 
      };
    } catch (error) {
      logger.error('Error persistiendo docente', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualiza un docente existente
   */
  async actualizar(docente) {
    try {
      await this.actualizarPersona(docente.id, docente);
      return { success: true };
    } catch (error) {
      logger.error('Error actualizando docente', error);
      return { success: false, error: error.message };
    }
  }
}

export default DocenteRepository;
