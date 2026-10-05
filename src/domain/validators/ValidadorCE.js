import ValidadorDocumento from './ValidadorDocumento';

class ValidadorCE extends ValidadorDocumento {
  validar(numero) {
    return /^[A-Z0-9]{9,12}$/i.test(numero);
  }
}

export default ValidadorCE;
