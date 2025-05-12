import ValidadorDNI from './Validadores/ValidadorDNI';
import ValidadorCE from './Validadores/ValidadorCE';
import ValidadorPTP from './Validadores/ValidadorPTP';
import ValidadorCodigoEstudiante from './Validadores/ValidadorCodigoEstudiante';
import ValidadorGenerico from './Validadores/ValidadorGenerico';

class Documento {
    constructor(tipo, numero) {
        this._tipo = tipo;
        this._numero = numero;
        this._validador = this._obtenerValidador(tipo);
    }

    get tipo() { return this._tipo; }
    set tipo(valor) { 
        this._tipo = valor;
        this._validador = this._obtenerValidador(valor);
    }

    get numero() { return this._numero; }
    set numero(valor) { this._numero = valor; }

    /**
     * Selecciona el validador apropiado según el tipo de documento
     * @param {string} tipo - Tipo de documento
     * @returns {ValidadorDocumento} - Validador correspondiente
     */
    _obtenerValidador(tipo) {
        switch(tipo.toUpperCase()) {
            case 'DNI': 
                return new ValidadorDNI();
            case 'CE': 
                return new ValidadorCE();
            case 'PTP': 
                return new ValidadorPTP();
            case 'CODIGO_ESTUDIANTE': 
                return new ValidadorCodigoEstudiante();
            default: 
                return new ValidadorGenerico();
        }
    }

    /**
     * Valida el número de documento usando el validador apropiado
     * @returns {boolean} - Resultado de la validación
     */
    validar() {
        return this._validador.validar(this._numero);
    }

    toString() {
        return `${this._tipo}: ${this._numero}`;
    }

    // Método estático para obtener los tipos de documento disponibles
    static getTiposDocumento() {
        return [
            'DNI', 
            'CE', 
            'PTP',
            'CODIGO_ESTUDIANTE',
            'OTRO'
        ];
    }
}

export default Documento;