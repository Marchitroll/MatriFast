/**
 * Clase para representar las lenguas habladas por una persona.
 */
import TIPOS_LENGUAS from './enums/TiposLenguas';

class Lenguas {
    #lenguaPrincipal;
    #lenguaSecundaria;

    /**
     * Constructor de la clase Lenguas.
     * @param {string} lenguaPrincipal - La lengua principal hablada. Debe ser un valor de TIPOS_LENGUAS.
     * @param {string} [lenguaSecundaria=null] - La lengua secundaria hablada (opcional). Debe ser un valor de TIPOS_LENGUAS o null.
     */
    constructor(lenguaPrincipal, lenguaSecundaria = null) {
        this.lenguaPrincipal = lenguaPrincipal; // Utiliza el setter para la validación
        if (lenguaSecundaria !== null) {
            this.lenguaSecundaria = lenguaSecundaria; // Utiliza el setter para la validación
        } else {
            this.#lenguaSecundaria = null;
        }
    }

    get lenguaPrincipal() {
        return this.#lenguaPrincipal;
    }

    set lenguaPrincipal(valor) {
        if (!valor) {
            throw new TypeError("La lengua principal es obligatoria.");
        }
        if (typeof valor !== 'string') {
            throw new TypeError("La lengua principal debe ser una cadena de texto.");
        }
        if (!Object.values(TIPOS_LENGUAS).includes(valor)) {
            throw new TypeError(`La lengua principal "${valor}" no es un tipo de lengua válido.`);
        }
        this.#lenguaPrincipal = valor;
    }

    get lenguaSecundaria() {
        return this.#lenguaSecundaria;
    }

    set lenguaSecundaria(valor) {
        if (valor === null) {
            this.#lenguaSecundaria = null;
            return;
        }
        if (typeof valor !== 'string') {
            throw new TypeError("La lengua secundaria debe ser una cadena de texto o null.");
        }
        if (!Object.values(TIPOS_LENGUAS).includes(valor)) {
            throw new TypeError(`La lengua secundaria "${valor}" no es un tipo de lengua válido.`);
        }
        if (valor === this.#lenguaPrincipal) {
            throw new Error("La lengua secundaria no puede ser igual a la lengua principal.");
        }
        this.#lenguaSecundaria = valor;
    }

    /**
     * Devuelve una representación en cadena de las lenguas.
     * @returns {string}
     */
    toString() {
        let str = `Principal: ${this.#lenguaPrincipal}`;
        if (this.#lenguaSecundaria) {
            str += `, Secundaria: ${this.#lenguaSecundaria}`;
        }
        return str;
    }

    /**
     * Devuelve un objeto simple que representa las lenguas.
     * @returns {object}
     */
    toPlainObject() {
        return {
            lenguaPrincipal: this.#lenguaPrincipal,
            lenguaSecundaria: this.#lenguaSecundaria,
        };
    }
}

export default Lenguas;
