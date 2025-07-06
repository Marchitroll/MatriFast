import supabase from '../config/ClienteSupabase';
import { ServicioEducativoPersistence } from './ServicioEducativoPersistence.js';

export default {
  /**
   * Persiste Persona → Usuario (rol ESTUDIANTE) → Estudiantes
   * @return idEstudiante
   */
  async persistirEstudiante(est) {
    /* ServicioEducativo id */
    const idServicioEducativo =
      await ServicioEducativoPersistence.persistir(est.servicioEducativo);

    /* Persona */
    const { data: pRow, error: pErr } = await supabase
      .from('Persona')
      .insert([est.persona.toPlain()], { returning: 'representation' })
      .select('id')
      .single();
    if (pErr) throw pErr;
    const idPersona = pRow.id;

    /* Usuario (rol 3 = ESTUDIANTE) */
    const { data: uRow, error: uErr } = await supabase
      .from('Usuario')
      .insert([{
        email: 'generico@instituto.com',
        idRol: 3,                      // ajusta al PK real de Rol ESTUDIANTE
        idPersona
      }])
      .select('id')
      .single();
    if (uErr) throw uErr;
    const idUsuarioEst = uRow.id;

    /* Estudiantes */
    const { data: eRow, error: eErr } = await supabase
      .from('Estudiantes')
      .insert([est.toPlain(idUsuarioEst, idServicioEducativo)])
      .select('id')
      .single();
    if (eErr) throw eErr;

    return eRow.id;
  }
};
