/**
 * Matricula: une al representante (idUsuario) con el estudiante inscrito (idEstudiante)
 * id y created_at los genera Postgres automáticamente.
 */
export default class Matricula {
  constructor({ id = null, idEstudiante, idUsuario }) {
    this.id = id;
    this.idEstudiante = idEstudiante;
    this.idUsuario = idUsuario;
  }

  toPlain() {
    return {
      id: this.id,
      idEstudiante: this.idEstudiante,
      idUsuario: this.idUsuario
    };
  }
}
