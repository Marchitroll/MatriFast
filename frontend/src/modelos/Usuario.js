import Persona from './Persona';
import ROLES_USUARIO from './enums/RolesUsuario';

// --- Clase Usuario ---

class Usuario extends Persona {
    #email;
    #rol;

    constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol) {
        super(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento);

        if (new.target === Usuario) {
            throw new TypeError("No se puede instanciar la clase abstracta Usuario directamente.");
        }
        
        this.#email = Usuario.#validarEmail(email);
        this.#rol = Usuario.#validarRol(rol);
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
        this.#rol = Usuario.#validarRol(valor);
    }

    toString() {
        return `${super.toString()} - Email: ${this.#email}, Rol: ${this.#rol}`;
    }

    toPlainObject() {
        return {
            ...super.toPlainObject(), // Llama al método de la clase padre
            email: this.#email,
            rol: this.#rol
        };
    }
    
    /**
     * Valida y normaliza el formato de un email.
     * @param {string} email - El email a validar.
     * @returns {string} El email normalizado (en minúsculas y sin espacios extra).
     * @throws {Error} Si el email no es una cadena o el formato es inválido.
     */
    static #validarEmail(email) {
        if (typeof email !== 'string') {
            throw new Error("El email debe ser una cadena de texto.");
        }
        const trimmedEmail = email.trim(); // Eliminar espacios al inicio y final
        const normalizedEmail = trimmedEmail.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            throw new Error("Formato de email inválido.");
        }
        return normalizedEmail;
    }

    /**
     * Valida si un rol es permitido y devuelve su valor oficial.
     * @param {string} rol - El rol a validar.
     * @returns {string} El rol oficial si es válido.
     * @throws {Error} Si el rol no es uno de los permitidos.
     */
    static #validarRol(rol) {
        if (typeof rol !== 'string') {
            throw new Error("El rol debe ser una cadena de texto.");
        }
        const rolEntradaNormalizado = rol.trim().toLowerCase();
        for (const [key, value] of Object.entries(ROLES_USUARIO)) {
            if (value.toLowerCase() === rolEntradaNormalizado) {
                return value; // Devuelve el valor oficial del Enum
            }
        }
        throw new Error(`Rol inválido. Los roles permitidos son: ${Object.values(ROLES_USUARIO).join(', ')}`);
    }
}

export default Usuario;