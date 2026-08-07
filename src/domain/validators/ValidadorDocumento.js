/**
 * Interfaz base para validadores de documento
 */
class ValidadorDocumento {
  validar(_numero) {
    throw new Error('Método validar() debe ser implementado');
  }
}

export default ValidadorDocumento;
