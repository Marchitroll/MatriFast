import ValidadorDocumento from '../Interfaces/ValidadorDocumento';

class ValidadorCodigoEstudiante extends ValidadorDocumento {
    validar(numero) {
        // Código de estudiante según SIAGIE para niños en Perú
        // Formato típico: numérico de 7-8 dígitos
        const regex = /^\d{7,8}$/;
        return regex.test(numero);
    }
}

export default ValidadorCodigoEstudiante;
