import { describe, it, expect } from 'vitest';
import Persona from '../../../src/domain/entities/Persona';
import Documento from '../../../src/domain/entities/Documento';

// Crear una subclase concreta para probar Persona abstracta
class PersonaConcreta extends Persona {
  constructor(config) {
    super(config);
  }
}

describe('Persona (Clase Abstracta)', () => {
  const datosValidos = {
    id: 1,
    nombres: 'Juan Carlos',
    aPaterno: 'Pérez',
    aMaterno: 'Gómez',
    fechaNacimiento: '1990-05-15',
    sexo: 'M',
    documento: new Documento('DNI', '12345678')
  };

  describe('instanciación', () => {
    it('debería rechazar la instanciación directa de la clase abstracta', () => {
      expect(() => new Persona(datosValidos)).toThrow('No se puede instanciar la clase abstracta Persona');
    });

    it('debería permitir la instanciación desde una subclase', () => {
      const persona = new PersonaConcreta(datosValidos);
      expect(persona.nombres).toBe('Juan Carlos');
      expect(persona.aPaterno).toBe('Pérez');
      expect(persona.aMaterno).toBe('Gómez');
      expect(persona.sexo).toBe('M');
      expect(persona.documento.numero).toBe('12345678');
    });
  });

  describe('validaciones de getters/setters', () => {
    it('debería validar nombres obligatorios', () => {
      expect(() => new PersonaConcreta({ ...datosValidos, nombres: '' })).toThrow('El nombre es obligatorio');
    });

    it('debería validar apellido paterno obligatorio', () => {
      expect(() => new PersonaConcreta({ ...datosValidos, aPaterno: '' })).toThrow('El apellido paterno es obligatorio');
    });

    it('debería validar fecha de nacimiento obligatoria', () => {
      expect(() => new PersonaConcreta({ ...datosValidos, fechaNacimiento: null })).toThrow('La fecha de nacimiento es obligatoria');
    });

    it('debería validar que la fecha no sea futura', () => {
      const fechaFutura = '2099-01-01';
      expect(() => new PersonaConcreta({ ...datosValidos, fechaNacimiento: fechaFutura })).toThrow('futura');
    });

    it('debería formatear nombreCompleto() correctamente con aMaterno', () => {
      const persona = new PersonaConcreta(datosValidos);
      expect(persona.nombreCompleto()).toBe('Juan Carlos Pérez Gómez');
    });

    it('debería formatear nombreCompleto() correctamente sin aMaterno', () => {
      const persona = new PersonaConcreta({ ...datosValidos, aMaterno: null });
      expect(persona.nombreCompleto()).toBe('Juan Carlos Pérez');
    });
  });

  describe('toPlainObject() y toString()', () => {
    it('debería retornar un objeto plano serializable', () => {
      const persona = new PersonaConcreta(datosValidos);
      const obj = persona.toPlainObject();

      expect(obj.id).toBe(1);
      expect(obj.nombres).toBe('Juan Carlos');
      expect(obj.documento).toEqual({ tipo: 'DNI', numero: '12345678' });
    });

    it('debería retornar representación en texto descriptiva', () => {
      const persona = new PersonaConcreta(datosValidos);
      expect(persona.toString()).toContain('Juan Carlos Pérez Gómez');
      expect(persona.toString()).toContain('DNI: 12345678');
    });
  });
});
