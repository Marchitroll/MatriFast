import ValidadorDocumento from './ValidadorDocumento';

class ValidadorGenerico extends ValidadorDocumento {
  validar(numero) {
    return numero && numero.length >= 1;
  }
}

export default ValidadorGenerico;
