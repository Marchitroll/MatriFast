import Usuario from './Usuario';

class RepresentanteLegal extends Usuario {
  constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol) {
    super(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol);
  }

  
}

export default RepresentanteLegal;

