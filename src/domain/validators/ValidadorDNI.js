import ValidadorDocumento from './ValidadorDocumento';

class ValidadorDNI extends ValidadorDocumento {
  validar(numero) {
    return /^\d{8}$/.test(numero);
  }
}

export default ValidadorDNI;
