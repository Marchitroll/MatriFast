/**
 * Servicio de persistencia de usuarios
 * Usa repositorios específicos según el rol
 */
import { DocenteRepository, RepresentanteLegalRepository } from './repositories';
import { ROLES } from '../domain';
import supabase from '../config/ClienteSupabase';

class UsuarioPersistence {
  constructor(
    docenteRepo = new DocenteRepository(supabase),
    representanteLegalRepo = new RepresentanteLegalRepository(supabase)
  ) {
    this.docenteRepo = docenteRepo;
    this.representanteLegalRepo = representanteLegalRepo;

    this.repos = {
      [ROLES.DOCENTE]: this.docenteRepo,
      [ROLES.REPRESENTANTE_LEGAL]: this.representanteLegalRepo
    };
  }

  /**
   * Persiste un usuario según su rol
   */
  async persistir(usuario) {
    const role = usuario.role || usuario.rol;
    const repo = this.repos[role];
    if (!repo) {
      return { success: false, error: `Rol "${role}" no soportado para persistencia` };
    }
    return repo.persistir(usuario);
  }

  /**
   * Actualiza un usuario según su rol
   */
  async actualizar(datosUsuario) {
    const role = datosUsuario.role || datosUsuario.rol;
    const repo = this.repos[role];
    if (!repo) {
      return { success: false, error: `Rol "${role}" no soportado para actualización` };
    }
    return repo.actualizar(datosUsuario);
  }
}

export default UsuarioPersistence;
