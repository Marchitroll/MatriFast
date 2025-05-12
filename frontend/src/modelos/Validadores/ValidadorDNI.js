import ValidadorDocumento from '../Interfaces/ValidadorDocumento';

class ValidadorDNI extends ValidadorDocumento {
    validar(numero) {
        // DNI peruano: 8 dígitos numéricos
        const regex = /^\d{8}$/;
        return regex.test(numero);
    }
}

export default ValidadorDNI;