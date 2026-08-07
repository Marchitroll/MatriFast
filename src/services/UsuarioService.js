/**
 * Servicio unificado de usuarios
 * Combina creación, validación y persistencia
 */
import UsuarioCreator from './UsuarioCreator';
import UsuarioPersistence from './UsuarioPersistence';
import { ROLES } from '../domain';
import supabase from '../config/ClienteSupabase';

class UsuarioService {
  constructor(creator = new UsuarioCreator(), persistence = new UsuarioPersistence()) {
    this.creator = creator;
    this.persistence = persistence;
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

    // 2. Persistir usuario
    const { usuario } = createResult.data;
    return this.persistence.persistir(usuario);
  }

  /**
   * Actualiza un usuario existente
   */
  async actualizar(datosUsuario) {
    return this.persistence.actualizar(datosUsuario);
  }

  /**
   * Obtiene el perfil de usuario por ID y rol
   */
  async obtenerPerfil(userId, roleInput) {
    try {
      const role = roleInput;
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
        tipoDocumento: usuario.Persona?.TipoDocumento?.valor,
        numeroDocumento: usuario.Persona?.nroDocumento,
        documento: {
          tipo: usuario.Persona?.TipoDocumento?.valor,
          numero: usuario.Persona?.nroDocumento
        },
        role,
        rol: role
      };

      // Datos adicionales según rol
      if (role === ROLES.REPRESENTANTE_LEGAL) {
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
      console.error('Error obteniendo perfil:', error);
      return { success: false, error: error.message };
    }
  }
}

const usuarioService = new UsuarioService();
export { UsuarioService };
export default usuarioService;
