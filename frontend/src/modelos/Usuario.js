import Persona from './Persona';
import listaDeRolesPermitidos from './enums/RolesUsuario';

// --- Clase Usuario ---

class Usuario extends Persona {
    #email;
    #rol;

    constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol) {
        super(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento);

        if (new.target === Usuario) {
            throw new TypeError("No se puede instanciar la clase abstracta Usuario directamente.");
        }

        // Si no hay roles disponibles, lanzar un error
        if (!listaDeRolesPermitidos || !Array.isArray(listaDeRolesPermitidos) || listaDeRolesPermitidos.length === 0)
            throw new Error("La lista de roles permitidos no está disponible o está vacía.");

        this.#email = Usuario.#validarEmail(email);
        this.#rol = this.#validarRolInterno(rol);
    }

    get email() {
        return this.#email;
    }

    set email(valor) {
        this.#email = Usuario.#validarEmail(valor);
    }

    get rol() {
        return this.#rol;
    }

    set rol(valor) {
        this.#rol = this.#validarRolInterno(valor);
    }

    toString() {
        return `${super.toString()} - Email: ${this.#email}, Rol: ${this.#rol}`;
    }

    toPlainObject() {
        return {
            ...super.toPlainObject(),
            email: this.#email,
            rol: this.#rol
        };
    }
    
    /**
     * Valida y normaliza una dirección de correo electrónico.
     * 
     * @private
     * @static
     * @param {string} email - La dirección de correo electrónico a validar.
     * @throws {Error} Si el email no es una cadena de texto o si tiene un formato inválido.
     * @returns {string} El email normalizado (sin espacios y en minúsculas).
     */
    static #validarEmail(email) {
        if (!email) {
            throw new TypeError("El email es obligatorio.");
        }
        if (typeof email !== 'string') {
            throw new TypeError("El email debe ser una cadena de texto.");
        }
        
        const emailNormalizado = email.trim().toLowerCase();
        // Expresión regular estándar para validar emails
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        
        if (!regexEmail.test(emailNormalizado)) {
            throw new TypeError(`El email "${email}" no tiene un formato válido.`);
        }
        
        return emailNormalizado;
    }

    /**
     * Valida si el rol proporcionado es válido comparándolo con la lista de roles permitidos.
     * @private
     * @param {string} rol - El rol que se desea validar.
     * @returns {string} El rol normalizado desde la lista de roles permitidos.
     * @throws {Error} Si el rol no es una cadena de texto o si no está en la lista de roles permitidos.
     */
    #validarRolInterno(rol) { 
        if (!rol) {
            throw new TypeError("El rol es obligatorio.");
        }
        if (typeof rol !== 'string') {
            throw new TypeError("El rol debe ser una cadena de texto.");
        }
        
        const rolNormalizado = rol.trim().toUpperCase();
        if (!listaDeRolesPermitidos.includes(rolNormalizado)) {
            throw new TypeError(`El rol "${rol}" no es válido. Roles permitidos: ${listaDeRolesPermitidos.join(', ')}`);
        }
        
        return rolNormalizado;
    }
}
export default Usuario;