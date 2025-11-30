import ValidadorDocumento from './ValidadorDocumento';

class ValidadorCodigoEstudiante extends ValidadorDocumento {
  validar(numero) {
    return /^[A-Z0-9]{5,20}$/i.test(numero);
  }
}

export default ValidadorCodigoEstudiante;
