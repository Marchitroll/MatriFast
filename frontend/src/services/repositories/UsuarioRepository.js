/**
 * Repositorio para persistencia de Usuario
 */
import BaseRepository from './BaseRepository';
import PersonaRepository from './PersonaRepository';
import logger from '../Logger';

class UsuarioRepository extends BaseRepository {
  constructor(supabase) {
    super(supabase);
    this.personaRepo = new PersonaRepository(supabase);
  }

  /**
   * Crea un usuario con su persona asociada
   */
  async crear(usuario, rolValor) {
    // 1. Crear persona
    const persona = await this.personaRepo.crear(usuario);
    
    // 2. Obtener id del rol
    const idRol = await this.getEnumId('Rol', rolValor);
    
    // 3. Crear usuario
    const usuarioData = {
      idPersona: persona.id,
      email: usuario.email,
      idRol
    };

    const result = await this.insert('Usuario', usuarioData);
    logger.info('Usuario creado', { id: result.id });
    
    return { ...result, idPersona: persona.id };
  }

  /**
   * Obtiene idPersona desde idUsuario
   */
  async getIdPersona(idUsuario) {
    const { data, error } = await this.supabase
      .from('Usuario')
      .select('idPersona')
      .eq('id', idUsuario)
      .single();

    if (error || !data) {
      throw new Error('No se encontró la persona asociada');
    }
    return data.idPersona;
  }

  /**
   * Actualiza datos de persona asociada a usuario
   */
  async actualizarPersona(idUsuario, datosPersona) {
    const idPersona = await this.getIdPersona(idUsuario);
    return this.personaRepo.actualizar(idPersona, datosPersona);
  }
}

export default UsuarioRepository;
