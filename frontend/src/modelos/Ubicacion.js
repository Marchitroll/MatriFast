class Ubicacion {
    #direccion;

    constructor(direccion = '') {
        this.direccion = direccion;
    }

    get direccion() {
        return this.#direccion;
    }

    set direccion(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("La dirección debe ser una cadena de texto.");
        }
        const dir = valor.trim();
        if (!dir) {
            throw new TypeError("La dirección es obligatoria.");
        }
        this.#direccion = dir;
    }

    toString() {
        return this.#direccion;
    }

    toPlainObject() {
        return {
            direccion: this.#direccion
        };
    }
}

export default Ubicacion;
