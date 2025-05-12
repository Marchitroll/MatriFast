import Documento from './Documento'; // Asegúrate de que la ruta sea correcta

class Persona {
    constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento) {
        if (new.target === Persona) {
            throw new TypeError("No se puede instanciar la clase abstracta Persona directamente.");
        }
        this._id = id;
        this._nombres = nombres;
        this._aPaterno = aPaterno;
        this._aMaterno = aMaterno;
        this._fechaNacimiento = fechaNacimiento;
        this._sexo = sexo;
        // Validar al construir o asegurar que el setter sea llamado si es relevante
        if (documento !== null && !(documento instanceof Documento)) {
            throw new TypeError("El atributo 'documento' debe ser una instancia de la clase Documento o null.");
        }
        this._documento = documento;
    }

    get id() { return this._id; }
    set id(valor) { this._id = valor; }

    get nombres() { return this._nombres; }
    set nombres(valor) { this._nombres = valor; }

    get aPaterno() { return this._aPaterno; }
    set aPaterno(valor) { this._aPaterno = valor; }

    get aMaterno() { return this._aMaterno; }
    set aMaterno(valor) { this._aMaterno = valor; }

    get fechaNacimiento() { return this._fechaNacimiento; }
    set fechaNacimiento(valor) { this._fechaNacimiento = valor; }

    get sexo() { return this._sexo; }
    set sexo(valor) { this._sexo = valor; }

    get documento() { return this._documento; }
    set documento(valor) {
        if (valor !== null && !(valor instanceof Documento)) {
            throw new TypeError("El atributo 'documento' debe ser una instancia de la clase Documento o null.");
        }
        this._documento = valor;
    }

    calcularEdad() {
        const hoy = new Date();
        const nacimiento = new Date(this._fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    toString() {
        const docStr = this._documento ? this._documento.toString() : "Sin documento";
        return `${this._nombres} ${this._aPaterno} ${this._aMaterno} - Documento: ${docStr}`;
    }
}

export default Persona;