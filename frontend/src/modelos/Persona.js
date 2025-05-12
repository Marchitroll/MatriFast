import Documento from './Documento';

class Persona {
    #id;
    #nombres;
    #aPaterno;
    #aMaterno;
    #fechaNacimiento;
    #sexo;
    #documento;

    constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento) {
        if (new.target === Persona) {
            throw new TypeError("No se puede instanciar la clase abstracta Persona directamente.");
        }
        
        this.#id = id; // ID es inmutable, no se proporciona setter
        
        // Usar los setters para aprovechar las validaciones
        this.nombres = nombres;
        this.aPaterno = aPaterno;
        this.aMaterno = aMaterno;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.documento = documento;
    }

    get id() { return this.#id; }
    // No se proporciona setter para id (inmutable)

    get nombres() { return this.#nombres; }
    set nombres(valor) { 
        if (!valor || typeof valor !== 'string') {
            throw new TypeError("El nombre debe ser una cadena no vacía");
        }
        this.#nombres = valor.trim(); 
    }

    get aPaterno() { return this.#aPaterno; }
    set aPaterno(valor) { 
        if (!valor || typeof valor !== 'string') {
            throw new TypeError("El apellido paterno debe ser una cadena no vacía");
        }
        this.#aPaterno = valor.trim(); 
    }

    get aMaterno() { return this.#aMaterno; }
    set aMaterno(valor) {
        if (valor === undefined) {
            throw new TypeError("El apellido materno no puede ser undefined");
        }
        if (valor !== null && typeof valor !== 'string') {
            throw new TypeError("El apellido materno debe ser cadena o null");
        }
        this.#aMaterno = valor === null ? null : valor.trim();
    }

    get fechaNacimiento() { return this.#fechaNacimiento; }
    set fechaNacimiento(valor) {
        if (valor == null) { // Rechaza tanto null como undefined
            throw new TypeError("La fecha de nacimiento es obligatoria y no puede ser nula o indefinida.");
        }
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) {
            throw new TypeError("La fecha de nacimiento debe ser válida.");
        }
        // Validar que no sea futura
        const hoy = new Date();
        if (fecha.getTime() > hoy.getTime()) {
            throw new TypeError("La fecha de nacimiento no puede ser futura.");
        }
        // Almacenar como objeto Date para consistencia
        this.#fechaNacimiento = fecha; 
    }

    get sexo() { return this.#sexo; }
    set sexo(valor) { 
        const sexosValidos = ['M', 'F', 'O']; // Masculino, Femenino, Otro
        if (!sexosValidos.includes(valor)) {
            throw new TypeError(`El valor de sexo debe ser uno de: ${sexosValidos.join(', ')}`);
        }
        this.#sexo = valor; 
    }

    get documento() { return this.#documento; }
    set documento(valor) {
        if (valor !== null && !(valor instanceof Documento)) {
            throw new TypeError("El atributo 'documento' debe ser una instancia de la clase Documento o null.");
        }
        this.#documento = valor;
    }

    calcularEdad() {
        const hoy = new Date();
        const nacimiento = this.#fechaNacimiento;
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    toString() {
        const docStr = this.#documento ? this.#documento.toString() : "Sin documento";
        return `${this.#nombres} ${this.#aPaterno} ${this.#aMaterno || ''}`.trim() + ` - Documento: ${docStr}`;
    }

    toPlainObject() {
        return {
            id: this.#id,
            nombres: this.#nombres,
            aPaterno: this.#aPaterno,
            aMaterno: this.#aMaterno,
            fechaNacimiento: this.#fechaNacimiento instanceof Date ? 
                this.#fechaNacimiento.toISOString() : this.#fechaNacimiento,
            sexo: this.#sexo,
            documento: this.#documento ? this.#documento.toPlainObject() : null
        };
    }
}

export default Persona;