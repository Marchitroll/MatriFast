/* ────────────────────────────────────────────────
   MatriculaService: orquesta la inscripción completa
   Usuario (inscriptor) → Estudiante → ServicioEducativo → Matrícula
   ──────────────────────────────────────────────── */
import EstudianteCreator     from './EstudianteCreator.js';
import EstudiantePersistence from './EstudiantePersistence.js';
import Matricula             from '../modelos/Matricula.js';
import supabase from '../config/ClienteSupabase';

export async function registrarMatricula(dtoFormulario, idUsuarioInscriptor) {
  /* 1. Construir entidad Estudiante (incluye ServicioEducativo) */
  const estudiante = EstudianteCreator.crear(dtoFormulario);

  /* 2. Persistir y obtener idEstudiante */
  const idEstudiante = await EstudiantePersistence.persistirEstudiante(estudiante);

  /* 3. Insertar Matrícula (idEstudiante + idUsuario inscriptor) */
  const matricula = new Matricula({ idEstudiante, idUsuario: idUsuarioInscriptor });

  const { error } = await supabase
    .from('Matricula')
    .insert([matricula.toPlain()]);
  if (error) throw error;
}
