/**
 * Servicio unificado de usuarios
 * Combina creación, validación y persistencia
 */
import UsuarioCreator from './UsuarioCreator';
import UsuarioPersistence from './UsuarioPersistence';
import supabase from '../config/ClienteSupabase';
import logger from './Logger';

class UsuarioService {
  constructor() {
    this.creator = new UsuarioCreator();
    this.persistence = new UsuarioPersistence();
  }

  /**
   * Registra un nuevo usuario completo
   */
  async registrar(datosUsuario, datosEspecificos) {
    // 1. Crear objetos de dominio
    const createResult = await this.creator.crearUsuario(datosUsuario, datosEspecificos);
    if (!createResult.success) {
      return createResult;
    }

    // 2. Persistir según rol
    const { role } = datosUsuario;
    const { usuario } = createResult.data;

    if (role === 'DOCENTE') {
      return this.persistence.persistirDocente(usuario);
    } else if (role === 'REPRESENTANTE LEGAL') {
      return this.persistence.persistirRepresentanteLegal(usuario);
    }

    return { success: false, error: 'Rol no soportado para persistencia' };
  }

  /**
   * Actualiza un usuario existente
   */
  async actualizar(datosUsuario) {
    const { rol } = datosUsuario;

    if (rol === 'DOCENTE') {
      return this.persistence.actualizarDocente(datosUsuario);
    } else if (rol === 'REPRESENTANTE LEGAL') {
      return this.persistence.actualizarRepresentanteLegal(datosUsuario);
    }

    return { success: false, error: 'Rol no soportado para actualización' };
  }

  /**
   * Obtiene el perfil de usuario por ID y rol
   */
  async obtenerPerfil(userId, rol) {
    try {
      // Obtener datos base del usuario
      const { data: usuario, error: userError } = await supabase
        .from('Usuario')
        .select(`
          id,
          email,
          Persona (
            nombres,
            aPaterno,
            aMaterno,
            fechaNacimiento,
            nroDocumento,
            Sexo (valor),
            TipoDocumento (valor)
          )
        `)
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const perfil = {
        id: usuario.id,
        email: usuario.email,
        nombres: usuario.Persona?.nombres,
        aPaterno: usuario.Persona?.aPaterno,
        aMaterno: usuario.Persona?.aMaterno,
        fechaNacimiento: usuario.Persona?.fechaNacimiento,
        sexo: usuario.Persona?.Sexo?.valor,
        documento: {
          tipo: usuario.Persona?.TipoDocumento?.valor,
          numero: usuario.Persona?.nroDocumento
        },
        rol
      };

      // Datos adicionales según rol
      if (rol === 'REPRESENTANTE LEGAL') {
        const { data: rl } = await supabase
          .from('RepresentanteLegal')
          .select(`
            celular,
            viveConEstudiante,
            TipoRelacion (valor),
            Ubicacion (id, direccion)
          `)
          .eq('idUsuario', userId)
          .single();

        if (rl) {
          perfil.numeroCelular = rl.celular;
          perfil.viveConEstudiante = rl.viveConEstudiante;
          perfil.tipoRelacion = rl.TipoRelacion?.valor;
          perfil.direccion = rl.Ubicacion;
        }
      }

      return { success: true, data: perfil };
    } catch (error) {
      logger.error('Error obteniendo perfil', error);
      return { success: false, error: error.message };
    }
  }
}

const usuarioService = new UsuarioService();
export default usuarioService;
