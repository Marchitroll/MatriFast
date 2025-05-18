import Usuario from './Usuario';

class Docente extends Usuario {
    // Aquí irán propiedades y métodos específicos de Docente si los hubiera en el futuro.

    constructor(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol) {
        // Llamamos al constructor de la clase padre (Usuario)
        super(id, nombres, aPaterno, aMaterno, fechaNacimiento, sexo, documento, email, rol);
        // Aquí podríamos inicializar propiedades específicas de Docente si las hubiera
    }

    // Sobrescribimos el método toString para incluir información específica de Docente
    toString() {
        return `Docente: ${super.toString()}`;
    }

    // Sobrescribimos toPlainObject si queremos una representación específica para Docente
    toPlainObject() {
        return {
            ...super.toPlainObject(),
            // Aquí se añadirán propiedades específicas de Docente
        };
    }
}

export default Docente;
