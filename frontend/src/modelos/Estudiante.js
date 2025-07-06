import Usuario from './Usuario.js';

/**
 * Estudiante EXTIENDE de Usuario
 *
 *  • Hereda: id, persona, role, email (y cualquier otra prop. del Usuario)
 *  • Agrega: servicioEducativo + flags + FK a representante
 *
 * Tabla Supabase que se rellena después:
 *   Estudiantes( id, idUsuario, idServicioEducativo, idNacimiento,
 *                idDireccion, tieneInternet, tieneDispositivosElectronicos,
 *                RepresentanteLegal )
 */
export default class Estudiante extends Usuario {
  constructor({
    id = null,
    persona,                       // objeto Persona   (obligatorio)
    representanteLegalId = null,   // bigint FK
    tieneDispositivosElectronicos = false,
    tieneInternet = false,
    servicioEducativo               // objeto ServicioEducativo (oblig.)
  }) {
    // ─── propiedades que maneja la clase base Usuario ─────────────
    super({
      id,                   // se rellenará tras insertar Usuario
      persona,
      role: 'ESTUDIANTE',   // fija el rol heredado
      email: 'generico@instituto.com' // correo comodín (no se crea Auth)
    });

    // ─── atributos propios de Estudiante ──────────────────────────
    this.representanteLegalId = representanteLegalId;
    this.tieneDispositivosElectronicos = tieneDispositivosElectronicos;
    this.tieneInternet = tieneInternet;
    this.servicioEducativo = servicioEducativo;
  }

  /**
   * Devuelve objeto plano listo para INSERT en la tabla Estudiantes.
   * Recibe:
   *   • idUsuario            ← PK de la fila que ya insertó Usuario
   *   • idServicioEducativo  ← PK obtenida/reutilizada antes
   */
  toPlain(idUsuario, idServicioEducativo) {
    return {
      idUsuario,
      idServicioEducativo,
      idNacimiento: this.persona.idNacimiento,
      idDireccion: this.persona.idDireccion,
      tieneInternet: this.tieneInternet,
      tieneDispositivosElectronicos: this.tieneDispositivosElectronicos,
      RepresentanteLegal: this.representanteLegalId
    };
  }
}