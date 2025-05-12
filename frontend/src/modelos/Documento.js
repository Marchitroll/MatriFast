import ValidadorDNI from './Validadores/ValidadorDNI';
import ValidadorCE from './Validadores/ValidadorCE';
import ValidadorPTP from './Validadores/ValidadorPTP';
import ValidadorCodigoEstudiante from './Validadores/ValidadorCodigoEstudiante';
import ValidadorGenerico from './Validadores/ValidadorGenerico';
import TIPOS_DOCUMENTO from './enums/TiposDocumento.js'; // Nueva importación

class Documento {
    #tipo;
    #numero;
    #validador;

    static #validadoresMap = {
        'DNI': ValidadorDNI,
        'CE': ValidadorCE,
        'PTP': ValidadorPTP,
        'CODIGO_ESTUDIANTE': ValidadorCodigoEstudiante,
        // OTRO usará ValidadorGenerico por defecto si no está en el mapa
    };

    constructor(tipo, numero) {
        if (tipo == null) throw new Error("El tipo de documento no puede ser nulo o indefinido");
        if (typeof tipo !== 'string') throw new Error("El tipo de documento debe ser una cadena de texto");
        const t = tipo.trim().toUpperCase();
        // La validación ahora usará el nuevo getTiposDocumento basado en el enum
        if (!Documento.getTiposDocumento().includes(t)) {
            throw new Error(`Tipo de documento inválido: "${tipo}"`);
        }
        if (numero == null) throw new Error("El número de documento no puede ser nulo o indefinido");
        
        this.#tipo = t;
        this.#numero = String(numero).trim(); // Asignar primero para que esté disponible para el validador
        this.#validador = this.#obtenerValidador(this.#tipo); // Luego obtener validador

        // Validar después de que todo esté configurado
        if (!this.#validador.validar(this.#numero)) {
            throw new Error(`El número "${this.#numero}" no es válido para el tipo de documento "${this.#tipo}".`);
        }
    }

    get tipo() { return this.#tipo; }
    set tipo(valor) {
        if (valor == null) throw new Error("El tipo de documento no puede ser nulo o indefinido");
        if (typeof valor !== 'string') throw new Error("El tipo de documento debe ser una cadena de texto");
        const t = valor.trim().toUpperCase();
        // La validación ahora usará el nuevo getTiposDocumento basado en el enum
        if (!Documento.getTiposDocumento().includes(t)) {
            throw new Error(`Tipo de documento inválido: "${valor}"`);
        }

        // 1) Validar *antes* de mutar el estado
        const candidato = this.#obtenerValidador(t);
        if (!candidato.validar(this.#numero)) {
            throw new Error(
                `El número actual "${this.#numero}" no es válido para el nuevo tipo "${t}".`
            );
        }

        // 2) Ahora sí, asigno
        this.#tipo = t;
        this.#validador = candidato;
    }

    get numero() { return this.#numero; }
    set numero(valor) { 
        if (valor == null) throw new Error("El número de documento no puede ser nulo o indefinido");
        const numeroLimpio = String(valor).trim(); 

        // this.#validador debe existir si el objeto fue construido correctamente.
        if (!this.#validador) {
            // Este caso teóricamente no debería ocurrir si el constructor funciona como se espera.
            throw new Error("No hay un validador configurado. El objeto Documento puede no estar inicializado correctamente.");
        }

        // Validar el numeroLimpio con el validador actual ANTES de asignarlo
        if (!this.#validador.validar(numeroLimpio)) {
            throw new Error(`El número "${numeroLimpio}" no es válido para el tipo de documento "${this.#tipo}".`);
        }
        this.#numero = numeroLimpio; 
    }

    /**
     * Selecciona el validador apropiado según el tipo de documento
     * @param {string} tipo - Tipo de documento
     * @returns {ValidadorDocumento} - Validador correspondiente
     */
    #obtenerValidador(tipo) {
        const ValidadorClase = Documento.#validadoresMap[tipo]; // tipo ya está en mayúsculas
        if (ValidadorClase) {
            return new ValidadorClase();
        }
        return new ValidadorGenerico(); // Validador por defecto
    }

    /**
     * Valida el número de documento usando el validador apropiado
     * @returns {boolean} - Resultado de la validación
     */
    validar() {
        if (!this.#validador) {
            throw new Error("No hay un validador disponible para este tipo de documento");
        }
        return this.#validador.validar(this.#numero);
    }

    toString() {
        return `${this.#tipo}: ${this.#numero}`;
    }

    toPlainObject() {
        return {
            tipo: this.#tipo,
            numero: this.#numero
        };
    }
    /**
     * Devuelve los tipos de documento soportados desde el enum.
     * @returns {string[]}
     */
    static getTiposDocumento() {
        return Object.values(TIPOS_DOCUMENTO);
    }
}

export default Documento;