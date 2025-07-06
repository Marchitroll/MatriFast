import EstudianteCreator     from './EstudianteCreator.js';
import EstudiantePersistence from './EstudiantePersistence.js';
import Matricula             from '../modelos/Matricula.js';
import supabase              from '../config/ClienteSupabase';

/**
 * @throws {Error} si ocurre cualquier fallo en la cadena de persistencia
 */
export async function registrarMatricula(dtoFormulario, idUsuarioInscriptor) {
  //0. Validaciones básicas del DTO
  if (!dtoFormulario.nombres || !dtoFormulario.idNivel || !dtoFormulario.idModalidad) {
    throw new Error('✖ Campos requeridos faltantes para crear al estudiante.');
  }

  //1. Construir la entidad Estudiante
  let estudiante;
  try {
    estudiante = EstudianteCreator.crear(dtoFormulario);
  } catch (creacionErr) {
    throw new Error(`✖ No se pudo crear la entidad Estudiante: ${creacionErr.message}`);
  }

  // ── 2. Persistir Estudiante y obtener su id 
  let idEstudiante;
  try {
    idEstudiante = await EstudiantePersistence.persistirEstudiante(estudiante);
  } catch (persistErr) {
    throw new Error(`✖ Error al guardar el estudiante: ${persistErr.message}`);
  }

  //3. Insertar Matrícula
  const matricula = new Matricula({
    idEstudiante,
    idUsuario: idUsuarioInscriptor
  });

  const { data, error } = await supabase
    .from('Matricula')
    .insert([matricula.toPlain()]);

  // Separamos los errores comunes para mensajes específicos
  if (error) {
    throw new Error('Error desconocido al insertar matrícula, revise clave foranea.');
  }

  //4. Confirmación 
  if (data && data.length > 0) {
    return { ok: true, idMatricula: data[0].id };
  } else {
    // Un caso muy raro: Supabase responde sin error pero sin filas devueltas
    throw new Error('✖ Supabase no devolvió la fila de Matrícula insertada.');
  }
}