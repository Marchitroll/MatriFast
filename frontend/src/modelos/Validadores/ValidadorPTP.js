import ValidadorDocumento from '../Interfaces/ValidadorDocumento';

class ValidadorPTP extends ValidadorDocumento {
    validar(numero) {
        // Permiso Temporal de Permanencia peruano
        const regex = /^[A-Za-z0-9]{8,12}$/;
        return regex.test(numero);
    }
}

export default ValidadorPTP;
