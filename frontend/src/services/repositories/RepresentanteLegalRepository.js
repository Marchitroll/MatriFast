/**
 * Repositorio para persistencia de RepresentanteLegal
 */
import UsuarioRepository from './UsuarioRepository';
import logger from '../Logger';

class RepresentanteLegalRepository extends UsuarioRepository {
  /**
   * Persiste una ubicación
   */
  async #persistirUbicacion(direccion) {
    return this.insert('Ubicacion', { direccion: direccion.direccion || direccion });
  }

  /**
   * Persiste un representante legal completo
   */
  async persistir(rl) {
    try {
      // 1. Crear ubicación
      const ubicacion = await this.#persistirUbicacion(rl.direccion);
      
      // 2. Crear usuario base
      const usuario = await this.crear(rl, 'REPRESENTANTE LEGAL');
      
      // 3. Obtener id tipo relación
      const idTipoRelacion = await this.getEnumId('TipoRelacion', rl.tipoRelacion);
      
      // 4. Crear registro específico de representante legal
      const rlData = {
        idUsuario: usuario.id,
        idRelacion: idTipoRelacion,
        idDireccion: ubicacion.id,
        celular: rl.numeroCelular,
        viveConEstudiante: rl.viveConEstudiante,
        idEstudiante: null
      };

      const rlResult = await this.insert('RepresentanteLegal', rlData);

      logger.info('Representante legal persistido', { id: usuario.id });
      return { 
        success: true, 
        data: { 
          id: usuario.id, 
          idPersona: usuario.idPersona,
          idRepresentanteLegal: rlResult.id,
          idDireccion: ubicacion.id
        } 
      };
    } catch (error) {
      logger.error('Error persistiendo representante legal', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualiza un representante legal existente
   */
  async actualizar(rl) {
    try {
      // 1. Actualizar datos de persona
      await this.actualizarPersona(rl.id, rl);
      
      // 2. Actualizar datos específicos de RL si existen
      const rlData = {};
      if (rl.celular !== undefined) rlData.celular = rl.celular;
      if (rl.viveConEstudiante !== undefined) rlData.viveConEstudiante = rl.viveConEstudiante;

      if (Object.keys(rlData).length > 0) {
        const { error } = await this.supabase
          .from('RepresentanteLegal')
          .update(rlData)
          .eq('idUsuario', rl.id);

        if (error) throw new Error(error.message);
      }

      // 3. Actualizar dirección si existe
      if (rl.direccion?.id && rl.direccion?.direccion) {
        await this.update('Ubicacion', rl.direccion.id, { direccion: rl.direccion.direccion });
      }

      return { success: true };
    } catch (error) {
      logger.error('Error actualizando representante legal', error);
      return { success: false, error: error.message };
    }
  }
}

export default RepresentanteLegalRepository;
