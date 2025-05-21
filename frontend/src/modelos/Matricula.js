export default class Matricula {
  constructor({ id, fechaSolicitud, servicioEducativo, estudiante, usuarioQueRegistra }) {
    this.id = id;
    this.fechaSolicitud = fechaSolicitud;
    this.servicioEducativo = servicioEducativo;
    this.estudiante = estudiante;
    this.usuarioQueRegistra = usuarioQueRegistra;
  }

  static crear({ servicioEducativo, estudiante, usuarioQueRegistra }) {
    const id = crypto.randomUUID();
    const fechaSolicitud = new Date().toISOString();
    return new Matricula({ id, fechaSolicitud, servicioEducativo, estudiante, usuarioQueRegistra });
  }
}
