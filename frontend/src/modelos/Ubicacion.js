class Ubicacion {
    #codUbigeo;
    #direccion;
    #departamento;
    #provincia;
    #distrito;

    constructor(codUbigeo = '', direccion = '', departamento = '', provincia = '', distrito = '') {
        this.codUbigeo = codUbigeo;
        this.direccion = direccion;
        this.departamento = departamento;
        this.provincia = provincia;
        this.distrito = distrito;
    }

    get codUbigeo() {
        return this.#codUbigeo;
    }

    set codUbigeo(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("El código Ubigeo debe ser una cadena de texto.");
        }
        const ubigeo = valor.trim();
        // permitir vacío o 6 dígitos
        if (ubigeo !== '' && !/^\d{6}$/.test(ubigeo)) {
            throw new TypeError("El UBIGEO debe tener exactamente 6 dígitos numéricos.");
        }
        this.#codUbigeo = ubigeo;
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

    get departamento() {
        return this.#departamento;
    }

    set departamento(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("El departamento debe ser una cadena de texto.");
        }
        const dep = valor.trim();
        if (!dep) {
            throw new TypeError("El departamento es obligatorio.");
        }
        this.#departamento = dep;
    }

    get provincia() {
        return this.#provincia;
    }

    set provincia(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("La provincia debe ser una cadena de texto.");
        }
        const prov = valor.trim();
        if (!prov) {
            throw new TypeError("La provincia es obligatoria.");
        }
        this.#provincia = prov;
    }

    get distrito() {
        return this.#distrito;
    }

    set distrito(valor) {
        if (typeof valor !== 'string') {
            throw new TypeError("El distrito debe ser una cadena de texto.");
        }
        const dist = valor.trim();
        if (!dist) {
            throw new TypeError("El distrito es obligatorio.");
        }
        this.#distrito = dist;
    }

    toString() {
        return `${this.#direccion}, ${this.#distrito}, ${this.#provincia}, ${this.#departamento}${this.#codUbigeo ? ' (' + this.#codUbigeo + ')' : ''}`;
    }

    toPlainObject() {
        return {
            codUbigeo: this.#codUbigeo,
            direccion: this.#direccion,
            departamento: this.#departamento,
            provincia: this.#provincia,
            distrito: this.#distrito
        };
    }
}

export default Ubicacion;
