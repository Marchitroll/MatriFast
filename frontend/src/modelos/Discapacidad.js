import TIPOS_DISCAPACIDAD from './enums/TiposDiscapacidad';

/**
 * Clase para representar los datos de discapacidad de una persona.
 */
class Discapacidad {
    #tieneDiscapacidad;
    #tieneCertificado;
    #tipo;
    #grado;
    #codigoCertificado;

    /**
     * @param {boolean} tieneDiscapacidad - Indica si la persona tiene alguna discapacidad.
     * @param {boolean} tieneCertificado - Indica si cuenta con un certificado de discapacidad.
     * @param {string} tipo - Tipo de discapacidad
     * @param {string} grado - Grado de la discapacidad
     * @param {string} codigoCertificado - Código del certificado de discapacidad.
     */
    constructor(tieneDiscapacidad = false, tieneCertificado = false, tipo = '', grado = '', codigoCertificado = '') {
        // Validar y asignar tieneDiscapacidad primero, ya que otros campos dependen de él.
        if (typeof tieneDiscapacidad !== 'boolean') {
            throw new TypeError("El atributo 'tieneDiscapacidad' debe ser un valor booleano.");
        }
        this.#tieneDiscapacidad = tieneDiscapacidad;

        // Validar y asignar tieneCertificado, ya que codigoCertificado depende de él.
        if (typeof tieneCertificado !== 'boolean') {
            throw new TypeError("El atributo 'tieneCertificado' debe ser un valor booleano.");
        }
        // Si no tiene discapacidad, no puede tener certificado.
        this.#tieneCertificado = this.#tieneDiscapacidad ? tieneCertificado : false;

        // Usar setters para el resto de atributos para aprovechar la validación interna.
        this.tipo = tipo;
        this.grado = grado;
        this.codigoCertificado = codigoCertificado;
    }

    get tieneDiscapacidad() {
        return this.#tieneDiscapacidad;
    }

    set tieneDiscapacidad(valor) {
        if (typeof valor !== 'boolean') {
            throw new TypeError("El atributo 'tieneDiscapacidad' debe ser un valor booleano.");
        }
        this.#tieneDiscapacidad = valor;
        // Si se establece que no tiene discapacidad, los demás campos relacionados se resetean.
        if (!this.#tieneDiscapacidad) {
            this.#tieneCertificado = false;
            this.#tipo = '';
            this.#grado = '';
            this.#codigoCertificado = '';
        }
    }

    get tieneCertificado() {
        return this.#tieneCertificado;
    }

    set tieneCertificado(valor) {
        if (typeof valor !== 'boolean') {
            throw new TypeError("El atributo 'tieneCertificado' debe ser un valor booleano.");
        }
        // Solo se puede tener certificado si se tiene discapacidad.
        this.#tieneCertificado = this.#tieneDiscapacidad ? valor : false;
        if (!this.#tieneCertificado) {
            this.#codigoCertificado = ''; // Si no tiene certificado, no hay código.
        }
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("El tipo de discapacidad debe ser una cadena de texto.");
        }

        let tipoFinal = '';
        if (this.#tieneDiscapacidad) {
            const tipoNormalizado = valor.trim().toUpperCase();
            const tiposValidos = Object.values(TIPOS_DISCAPACIDAD);
            // Permite cadena vacía si no se especifica, pero si se especifica, debe ser uno de los válidos.
            if (tipoNormalizado !== '' && !tiposValidos.includes(tipoNormalizado)) {
                throw new TypeError(
                    `Tipo de discapacidad inválido: "${valor}". Valores permitidos: ${tiposValidos.join(', ')}.`
                );
            }
            tipoFinal = tipoNormalizado;
        }
        this.#tipo = tipoFinal;
    }

    get grado() {
        return this.#grado;
    }

    set grado(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("El grado de discapacidad debe ser una cadena de texto.");
        }

        let gradoFinal = '';
        if (this.#tieneDiscapacidad) {
            gradoFinal = valor.trim();
        }
        this.#grado = gradoFinal;
    }

    get codigoCertificado() {
        return this.#codigoCertificado;
    }

    set codigoCertificado(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("El código de certificado debe ser una cadena de texto.");
        }        
        let codigoFinal = '';
        if (this.#tieneCertificado) { // El código de certificado solo es relevante si tiene certificado
            codigoFinal = valor.trim();
        }
        this.#codigoCertificado = codigoFinal;
    }
    /**
     * Devuelve una representación en cadena de texto de la instancia.
     * @returns {string}
     */
    toString() {
        if (!this.#tieneDiscapacidad) {
            return "Sin discapacidad reportada.";
        }
        let str = `Discapacidad: Sí`;
        if (this.#tipo) str += `, Tipo: ${this.#tipo}`;
        if (this.#grado) str += `, Grado: ${this.#grado}`;
        if (this.#tieneCertificado) {
            str += `, Certificado: Sí`;
            if (this.#codigoCertificado) str += `, Código: ${this.#codigoCertificado}`;
            else str += `, Código: (No especificado)`;
        } else {
            str += `, Certificado: No`;
        }
        return str;
    }
    /**
     * Devuelve un objeto simple (POJO) con los datos de la instancia.
     * @returns {object}
     */
    toPlainObject() {
        return {            tieneDiscapacidad: this.#tieneDiscapacidad,
            tieneCertificado: this.#tieneCertificado,
            tipo: this.#tipo,
            grado: this.#grado,
            codigoCertificado: this.#codigoCertificado
        };
    }
}

export default Discapacidad;
