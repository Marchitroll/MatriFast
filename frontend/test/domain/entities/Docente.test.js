import { describe, it, expect } from 'vitest';
import Docente from '../../../src/domain/entities/Docente';
import Documento from '../../../src/domain/entities/Documento';

describe('Docente', () => {
  const datosValidos = {
    id: 1,
    nombres: 'Juan Carlos',
    aPaterno: 'García',
    aMaterno: 'López',
    fechaNacimiento: '1985-05-15',
    sexo: 'M',
    documento: new Documento('DNI', '12345678'),
    email: 'juan.garcia@email.com',
    rol: 'DOCENTE'
  };

  describe('constructor', () => {
    it('debería crear un docente válido con todos los datos', () => {
      const docente = new Docente(datosValidos);
      
      expect(docente.nombres).toBe('Juan Carlos');
      expect(docente.aPaterno).toBe('García');
      expect(docente.aMaterno).toBe('López');
      expect(docente.email).toBe('juan.garcia@email.com');
      expect(docente.rol).toBe('DOCENTE');
    });

    it('debería asignar rol DOCENTE por defecto', () => {
      const datos = { ...datosValidos };
      delete datos.rol;
      const docente = new Docente(datos);
      expect(docente.rol).toBe('DOCENTE');
    });

    it('debería aceptar apellido materno null', () => {
      const datos = { ...datosValidos, aMaterno: null };
      const docente = new Docente(datos);
      expect(docente.aMaterno).toBeNull();
    });

    it('debería lanzar error sin nombres', () => {
      const datos = { ...datosValidos, nombres: null };
      expect(() => new Docente(datos)).toThrow('El nombre es obligatorio');
    });

    it('debería lanzar error sin apellido paterno', () => {
      const datos = { ...datosValidos, aPaterno: null };
      expect(() => new Docente(datos)).toThrow('El apellido paterno es obligatorio');
    });

    it('debería lanzar error sin email', () => {
      const datos = { ...datosValidos, email: null };
      expect(() => new Docente(datos)).toThrow('El email es obligatorio');
    });

    it('debería lanzar error con email inválido', () => {
      const datos = { ...datosValidos, email: 'email-invalido' };
      expect(() => new Docente(datos)).toThrow('no tiene formato válido');
    });

    it('debería lanzar error sin fecha de nacimiento', () => {
      const datos = { ...datosValidos, fechaNacimiento: null };
      expect(() => new Docente(datos)).toThrow('La fecha de nacimiento es obligatoria');
    });

    it('debería lanzar error con fecha futura', () => {
      const futuro = new Date();
      futuro.setFullYear(futuro.getFullYear() + 1);
      const datos = { ...datosValidos, fechaNacimiento: futuro.toISOString() };
      expect(() => new Docente(datos)).toThrow('La fecha de nacimiento no puede ser futura');
    });
  });

  describe('nombreCompleto()', () => {
    it('debería retornar nombre completo con ambos apellidos', () => {
      const docente = new Docente(datosValidos);
      expect(docente.nombreCompleto()).toBe('Juan Carlos García López');
    });

    it('debería retornar nombre sin apellido materno si es null', () => {
      const datos = { ...datosValidos, aMaterno: null };
      const docente = new Docente(datos);
      expect(docente.nombreCompleto()).toBe('Juan Carlos García');
    });
  });

  describe('calcularEdad()', () => {
    it('debería calcular la edad correctamente', () => {
      const docente = new Docente(datosValidos);
      const edad = docente.calcularEdad();
      expect(edad).toBeGreaterThan(0);
      expect(typeof edad).toBe('number');
    });
  });

  describe('toString()', () => {
    it('debería incluir "Docente:" en el string', () => {
      const docente = new Docente(datosValidos);
      expect(docente.toString()).toContain('Docente:');
    });
  });

  describe('toPlainObject()', () => {
    it('debería retornar objeto con tipoUsuario DOCENTE', () => {
      const docente = new Docente(datosValidos);
      const obj = docente.toPlainObject();
      
      expect(obj.tipoUsuario).toBe('DOCENTE');
      expect(obj.nombres).toBe('Juan Carlos');
      expect(obj.email).toBe('juan.garcia@email.com');
      expect(obj.documento).toEqual({ tipo: 'DNI', numero: '12345678' });
    });
  });
});
