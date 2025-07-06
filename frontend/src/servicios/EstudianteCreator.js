import Persona                 from '../modelos/Persona.js';
import Estudiante              from '../modelos/Estudiante.js';
import { ServicioEducativoCreator } from './ServicioEducativoCreator.js';

function crear(dto) {
  /* ─ Persona (solo campos que la tabla requiere) */
  const persona = new Persona({
    nombres:        dto.nombres,
    aPaterno:       dto.aPaterno,
    aMaterno:       dto.aMaterno,
    fechaNacimiento:dto.fechaNacimiento,
    idSexo:         dto.idSexo,
    idDocumento:    dto.idDocumento,
    nroDocumento:   dto.nroDocumento,
    idNacimiento:   dto.idNacimiento,
    idDireccion:    dto.idDireccion
  });

  /* ─ ServicioEducativo */
  const servicioEducativo = ServicioEducativoCreator.crear({
    idModalidad: dto.idModalidad,
    idNivel:     dto.idNivel,
    solicitaExoneracionReligion: dto.solicitaExoneracionReligion,
    motivoExoneracionReligion:   dto.motivoExoneracionReligion,
    solicitaExoneracionEdFisica: dto.solicitaExoneracionEdFisica,
    motivoExoneracionEdFisica:   dto.motivoExoneracionEdFisica
  });

  /* ─ Estudiante (extiende Usuario) */
  return new Estudiante({
    persona,
    representanteLegalId:            dto.representanteLegalId,
    tieneDispositivosElectronicos:   dto.tieneDispositivosElectronicos,
    tieneInternet:                   dto.tieneInternet,
    servicioEducativo
  });
}

export default { crear };
