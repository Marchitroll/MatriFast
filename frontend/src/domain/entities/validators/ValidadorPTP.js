import ValidadorDocumento from './ValidadorDocumento';

class ValidadorPTP extends ValidadorDocumento {
  validar(numero) {
    return /^[A-Z0-9]{9,15}$/i.test(numero);
  }
}

export default ValidadorPTP;
