/**
 * Clase abstracta Creadora para el patrón Factory Method.
 * Define la interfaz factoryMethod (crearUsuario) que las subclases concretas deben implementar.
 */
class UsuarioFactory {
  crearUsuario(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol) {
    throw new Error('UsuarioFactory.factoryMethod() debe ser implementado por la subclase');
  }
}

export default UsuarioFactory;
