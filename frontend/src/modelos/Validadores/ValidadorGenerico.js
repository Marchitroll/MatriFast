import ValidadorDocumento from '../Interfaces/ValidadorDocumento';

class ValidadorGenerico extends ValidadorDocumento {
    validar(numero) {
        // Validación genérica para otros tipos de documento peruanos
        return numero && numero.length > 3;
    }
}

export default ValidadorGenerico;
