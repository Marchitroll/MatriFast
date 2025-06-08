import Usuario from './Usuario';
import Ubicacion from './Ubicacion';
import RepresentanteLegal from './RepresentanteLegal';

class Estudiante extends Usuario {
    #lugarNacimiento;
    #tieneDiscapacidad;
    #domicilioActual;
    #tieneDispositivosElectronicos;
    #tieneInternet;
    #representanteLegalInscriptor;    constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, lugarNacimiento, tieneDiscapacidad = false, domicilioActual, tieneDispositivosElectronicos, tieneInternet, representanteLegalInscriptor) {
        super(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento);
        this.lugarNacimiento = lugarNacimiento;
        this.tieneDiscapacidad = tieneDiscapacidad;
        this.domicilioActual = domicilioActual;
        this.tieneDispositivosElectronicos = tieneDispositivosElectronicos;
        this.tieneInternet = tieneInternet;
        this.representanteLegalInscriptor = representanteLegalInscriptor;
    }

    get lugarNacimiento() {
        return this.#lugarNacimiento;
    }

    set lugarNacimiento(valor) {
        if (!(valor instanceof Ubicacion)) {
            throw new TypeError('El lugar de nacimiento debe ser una instancia de Ubicacion.');
        }
        this.#lugarNacimiento = valor;    }

    get tieneDiscapacidad() {
        return this.#tieneDiscapacidad;
    }

    set tieneDiscapacidad(valor) {
        if (typeof valor !== 'boolean') {
            throw new TypeError('El atributo tieneDiscapacidad debe ser booleano.');
        }
        this.#tieneDiscapacidad = valor;
    }

    get domicilioActual() {
        return this.#domicilioActual;
    }

    set domicilioActual(valor) {
        if (!(valor instanceof Ubicacion)) {
            throw new TypeError('El domicilio actual debe ser una instancia de Ubicacion.');
        }
        this.#domicilioActual = valor;
    }

    get tieneDispositivosElectronicos() {
        return this.#tieneDispositivosElectronicos;
    }

    set tieneDispositivosElectronicos(valor) {
        if (typeof valor !== 'boolean') {
            throw new TypeError('El atributo tieneDispositivosElectronicos debe ser booleano.');
        }
        this.#tieneDispositivosElectronicos = valor;
    }

    get tieneInternet() {
        return this.#tieneInternet;
    }

    set tieneInternet(valor) {
        if (typeof valor !== 'boolean') {
            throw new TypeError('El atributo tieneInternet debe ser booleano.');
        }
        this.#tieneInternet = valor;
    }

    get representanteLegalInscriptor() {
        return this.#representanteLegalInscriptor;
    }

    set representanteLegalInscriptor(valor) {
        if (!(valor instanceof RepresentanteLegal)) {
            throw new TypeError('El representante legal inscriptor debe ser una instancia de RepresentanteLegal.');
        }
        this.#representanteLegalInscriptor = valor;
    }    toString() {
        return `Estudiante: ${super.toString()} - Lugar de nacimiento: ${this.#lugarNacimiento ? this.#lugarNacimiento.direccion : 'No especificado'} - Domicilio actual: ${this.#domicilioActual ? this.#domicilioActual.direccion : 'No especificado'} - Tiene discapacidad: ${this.#tieneDiscapacidad ? 'Sí' : 'No'} - Dispositivos electrónicos: ${this.#tieneDispositivosElectronicos ? 'Sí' : 'No'} - Internet: ${this.#tieneInternet ? 'Sí' : 'No'} - Representante legal inscriptor: ${this.#representanteLegalInscriptor ? this.#representanteLegalInscriptor.toString() : 'No especificado'}`;
    }    toPlainObject() {
        return {
            ...super.toPlainObject(),
            lugarNacimiento: this.#lugarNacimiento
                ? this.#lugarNacimiento.toPlainObject()
                : null,
            domicilioActual: this.#domicilioActual
                ? this.#domicilioActual.toPlainObject()
                : null,
            tieneDiscapacidad: this.#tieneDiscapacidad,
            tieneDispositivosElectronicos: this.#tieneDispositivosElectronicos,
            tieneInternet: this.#tieneInternet,
            representanteLegalInscriptor: this.#representanteLegalInscriptor ? this.#representanteLegalInscriptor.toPlainObject() : null
        };
    }
}

export default Estudiante;
