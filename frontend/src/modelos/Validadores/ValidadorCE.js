import ValidadorDocumento from '../Interfaces/ValidadorDocumento';

class ValidadorCE extends ValidadorDocumento {
    validar(numero) {
        // Carné de extranjería peruano: generalmente comienza con una letra 
        // Longitud variable de 9-12 caracteres alfanuméricos
        const regex = /^[A-Za-z0-9]{9,12}$/;
        return regex.test(numero);
    }
}

export default ValidadorCE;
