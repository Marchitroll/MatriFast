import Persona from './Persona';
import Ubicacion from './Ubicacion';
import Lenguas from './Lenguas';
import Discapacidad from './Discapacidad';
import RepresentanteLegal from './RepresentanteLegal';

class Estudiante extends Persona {
    #lugarNacimiento;
    #lengua;
    #etnia;
    #discapacidad;
    #domicilioActual;
    #tieneDispositivosElectronicos;
    #tieneInternet;
    #representanteLegalInscriptor;
    #hermanos;
    constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, lugarNacimiento, lengua, etnia = null, discapacidad = null, domicilioActual, tieneDispositivosElectronicos, tieneInternet, representanteLegalInscriptor, hermanos = []) {
        super(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento);
        this.lugarNacimiento = lugarNacimiento;
        this.lengua = lengua;
        this.etnia = etnia;
        this.discapacidad = discapacidad;
        this.domicilioActual = domicilioActual;
        this.tieneDispositivosElectronicos = tieneDispositivosElectronicos;
        this.tieneInternet = tieneInternet;
        this.representanteLegalInscriptor = representanteLegalInscriptor;
        this.hermanos = hermanos;
    }

    get lugarNacimiento() {
        return this.#lugarNacimiento;
    }

    set lugarNacimiento(valor) {
        if (!(valor instanceof Ubicacion)) {
            throw new TypeError('El lugar de nacimiento debe ser una instancia de Ubicacion.');
        }
        this.#lugarNacimiento = valor;
    }

    get lengua() {
        return this.#lengua;
    }

    set lengua(valor) {
        if (!(valor instanceof Lenguas)) {
            throw new TypeError('La lengua debe ser una instancia de Lenguas.');
        }
        this.#lengua = valor;
    }

    get etnia() {
        return this.#etnia;
    }

    set etnia(valor) {
        if (valor === null || valor === undefined) {
            this.#etnia = null;
        } else if (typeof valor === 'string') {
            const etniaRecortada = valor.trim();
            // Si después de recortar es una cadena vacía, se considera como null (opcional)
            this.#etnia = etniaRecortada === '' ? null : etniaRecortada;
        } else {
            throw new TypeError('La etnia debe ser una cadena de texto o nula.');
        }
    }

    get discapacidad() {
        return this.#discapacidad;
    }

    set discapacidad(valor) {
        if (valor === null || valor === undefined) {
            this.#discapacidad = null;
        } else if (!(valor instanceof Discapacidad)) {
            throw new TypeError('El atributo discapacidad debe ser una instancia de Discapacidad o nulo.');
        } else {
            this.#discapacidad = valor;
        }
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
    }

    get hermanos() {
        return this.#hermanos;
    }

    set hermanos(valor) {
        if (!Array.isArray(valor) || !valor.every(h => h instanceof Estudiante)) {
            throw new TypeError('El atributo hermanos debe ser un array de instancias de Estudiante.');
        }
        this.#hermanos = valor;
    }

    tieneCertificadoValido() {
        return this.#discapacidad !== null && this.#discapacidad !== undefined;
    }

    tieneHermanos() {
        return this.#hermanos && this.#hermanos.length > 0;
    }

    agregarHermano(hermano) {
        if (!(hermano instanceof Estudiante)) {
            throw new TypeError('El hermano debe ser una instancia de Estudiante.');
        }
        if (!this.#hermanos) {
            this.#hermanos = [];
        }
        this.#hermanos.push(hermano);
    }

    toString() {
        return `Estudiante: ${super.toString()} - Lugar de nacimiento: ${this.#lugarNacimiento ? this.#lugarNacimiento.direccion : 'No especificado'} - Domicilio actual: ${this.#domicilioActual ? this.#domicilioActual.direccion : 'No especificado'} - Lengua: ${this.#lengua ? this.#lengua.toString() : 'No especificado'} - Etnia: ${this.#etnia || 'No especificado'} - Discapacidad: ${this.#discapacidad ? this.#discapacidad.toString() : 'No especificado'} - Dispositivos electrónicos: ${this.#tieneDispositivosElectronicos ? 'Sí' : 'No'} - Internet: ${this.#tieneInternet ? 'Sí' : 'No'} - Representante legal inscriptor: ${this.#representanteLegalInscriptor ? this.#representanteLegalInscriptor.toString() : 'No especificado'} - Hermanos: ${this.#hermanos && this.#hermanos.length > 0 ? this.#hermanos.length : 'Ninguno'}`;
    }

    toPlainObject() {
        return {
            ...super.toPlainObject(),
            lugarNacimiento: this.#lugarNacimiento
                ? this.#lugarNacimiento.toPlainObject()
                : null,
            domicilioActual: this.#domicilioActual
                ? this.#domicilioActual.toPlainObject()
                : null,
            lengua: this.#lengua ? this.#lengua.toPlainObject() : null,
            etnia: this.#etnia || null,
            discapacidad: this.#discapacidad ? this.#discapacidad.toPlainObject() : null,
            tieneDispositivosElectronicos: this.#tieneDispositivosElectronicos,
            tieneInternet: this.#tieneInternet,
            representanteLegalInscriptor: this.#representanteLegalInscriptor ? this.#representanteLegalInscriptor.toPlainObject() : null,
            hermanos: this.#hermanos ? this.#hermanos.map(h => h.toPlainObject()) : []
        };
    }
}

export default Estudiante;
