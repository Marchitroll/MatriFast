/**
 * ServicioEducativo
 * Coincide 1 :1 con la tabla Supabase mostrada:
 *
 *   id                  (lo asigna SUPABASE)
 */
export default class ServicioEducativo {
  constructor({
    id = null,
    idModalidad,
    idNivel,
    solicitaExoneracionReligion = false,
    motivoExoneracionReligion = null,
    solicitaExoneracionEdFisica = false,
    motivoExoneracionEdFisica = null
  }) {
    this.id = id;
    this.idModalidad = idModalidad;
    this.idNivel = idNivel;
    this.solicitaExoneracionReligion = solicitaExoneracionReligion;
    this.motivoExoneracionReligion = motivoExoneracionReligion;
    this.solicitaExoneracionEdFisica = solicitaExoneracionEdFisica;
    this.motivoExoneracionEdFisica = motivoExoneracionEdFisica;
  }

  toPlain() {
    return {
      id: this.id,
      idModalidad: this.idModalidad,
      idNivel: this.idNivel,
      solicitaExoneracionReligion: this.solicitaExoneracionReligion,
      motivoExoneracionReligion: this.motivoExoneracionReligion,
      solicitaExoneracionEdFisica: this.solicitaExoneracionEdFisica,
      motivoExoneracionEdFisica: this.motivoExoneracionEdFisica
    };
  }
}