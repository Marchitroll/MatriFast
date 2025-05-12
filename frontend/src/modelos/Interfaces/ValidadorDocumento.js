// Interfaz para los validadores
class ValidadorDocumento {
    validar(numero) {
        throw new Error("Método abstracto, debe ser implementado");
    }
}

export default ValidadorDocumento;