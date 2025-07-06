import supabase from '../config/ClienteSupabase';
import { ServicioEducativoPersistence } from './ServicioEducativoPersistence.js';
export default {
  /**
   * Persiste Persona → Usuario (rol ESTUDIANTE) → Estudiantes
   * @return idEstudiante
   */
  async persistirEstudiante(est) {
    //   Validación previa: Existen los datos para persona
    if (!est?.persona || !est?.servicioEducativo) {
      throw new Error('El objeto Estudiante está incompleto.');
    }

    // Persistir el Servicio Educativo y devolver su id 
    const idServicioEducativo =
      await ServicioEducativoPersistence.persistir(est.servicioEducativo);

    if (!idServicioEducativo) {
      throw new Error('No se pudo determinar idServicioEducativo.');
    }
    //creacion de la persona y devolver su id
    const { data: pRow, error: pErr } = await supabase
      .from('Persona')
      .insert([est.persona.toPlain()], { returning: 'representation' })
      .select('id')
      .single();
    if (pErr) throw new Error('El objeto persona no pudo ser creado en la tabla');
    const idPersona = pRow.id;
    // Isertar Usuario con el id de la persona y rol y el email (se setea el rol 3 = ESTUDIANTE y email se PRE-SETEA) 
    const { data: uRow, error: uErr } = await supabase
      .from('Usuario')
      .insert([{
        email: 'generico@instituto.com',
        idRol: 3,                      // ajusta al PK real de Rol ESTUDIANTE porque la tabla Usuario le pedirá el FK del rol
        idPersona
      }])
      .select('id')
      .single();
    if (uErr) throw uErr;
    const idUsuarioEst = uRow.id;

    //Ingresar los datos y crear al ESTUDIANTE
    const { data: eRow, error: eErr } = await supabase
      .from('Estudiantes')
      .insert([est.toPlain(idUsuarioEst, idServicioEducativo)])
      .select('id')
      .single();
    if (eErr) throw eErr;

    return eRow.id;
  }
};
