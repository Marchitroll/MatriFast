/**
 * Servicio de persistencia de usuarios
 * Usa repositorios específicos según el rol
 */
import { DocenteRepository, RepresentanteLegalRepository } from './repositories';
import supabase from '../config/ClienteSupabase';
import logger from './Logger';

class UsuarioPersistence {
  constructor() {
    this.docenteRepo = new DocenteRepository(supabase);
    this.representanteLegalRepo = new RepresentanteLegalRepository(supabase);
  }

  /**
   * Persiste un docente
   */
  async persistirDocente(docente) {
    return this.docenteRepo.persistir(docente);
  }

  /**
   * Persiste un representante legal
   */
  async persistirRepresentanteLegal(representanteLegal) {
    return this.representanteLegalRepo.persistir(representanteLegal);
  }

  /**
   * Actualiza un docente
   */
  async actualizarDocente(docente) {
    return this.docenteRepo.actualizar(docente);
  }

  /**
   * Actualiza un representante legal
   */
  async actualizarRepresentanteLegal(representante) {
    return this.representanteLegalRepo.actualizar(representante);
  }
}

export default UsuarioPersistence;
