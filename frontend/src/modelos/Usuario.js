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
     * Valida si el rol proporcionado es válido comparándolo con la lista de roles permitidos.
     * @private
     * @param {string} rol - El rol que se desea validar.
     * @returns {string} El rol normalizado desde la lista de roles permitidos.
     * @throws {Error} Si el rol no es una cadena de texto o si no está en la lista de roles permitidos.
     */
    #validarRolInterno(rol) { 
        if (typeof rol !== 'string') {
            throw new Error("El rol debe ser una cadena de texto.");
        }
        const rolEntradaNormalizado = rol.trim().toLowerCase();
        
        for (const rolPermitido of listaDeRolesPermitidos) {
            if (rolPermitido.toLowerCase() === rolEntradaNormalizado) {
                return rolPermitido; // Devuelve el valor oficial de la lista
            }
        }
        throw new Error(`Rol inválido. Los roles permitidos son: ${listaDeRolesPermitidos.join(', ')}`);
    }
}
export default Usuario;