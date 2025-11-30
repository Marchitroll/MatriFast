import { describe, it, expect } from 'vitest';
import Documento from '../../../src/domain/entities/Documento';

describe('Documento', () => {
  describe('constructor', () => {
    it('debería crear un documento válido con tipo DNI', () => {
      const doc = new Documento('DNI', '12345678');
      expect(doc.tipo).toBe('DNI');
      expect(doc.numero).toBe('12345678');
    });

    it('debería crear un documento válido con tipo CE', () => {
      const doc = new Documento('CE', '123456789');
      expect(doc.tipo).toBe('CE');
      expect(doc.numero).toBe('123456789');
    });

    it('debería crear un documento válido con tipo PTP', () => {
      const doc = new Documento('PTP', 'A12345678');
      expect(doc.tipo).toBe('PTP');
    });

    it('debería normalizar el tipo a mayúsculas', () => {
      const doc = new Documento('dni', '12345678');
      expect(doc.tipo).toBe('DNI');
    });

    it('debería lanzar error si el tipo es null', () => {
      expect(() => new Documento(null, '12345678'))
        .toThrow('El tipo de documento es obligatorio');
    });

    it('debería lanzar error si el tipo es undefined', () => {
      expect(() => new Documento(undefined, '12345678'))
        .toThrow('El tipo de documento es obligatorio');
    });

    it('debería lanzar error si el número es null', () => {
      expect(() => new Documento('DNI', null))
        .toThrow('El número de documento es obligatorio');
    });

    it('debería lanzar error si el número es undefined', () => {
      expect(() => new Documento('DNI', undefined))
        .toThrow('El número de documento es obligatorio');
    });

    it('debería lanzar error si DNI no tiene 8 dígitos', () => {
      expect(() => new Documento('DNI', '1234567')).toThrow();
    });

    it('debería lanzar error si DNI tiene letras', () => {
      expect(() => new Documento('DNI', '1234567A')).toThrow();
    });

    it('debería lanzar error si CE tiene menos de 9 caracteres', () => {
      expect(() => new Documento('CE', '12345678')).toThrow();
    });
  });

  describe('validar()', () => {
    it('debería retornar true para DNI válido', () => {
      const doc = new Documento('DNI', '12345678');
      expect(doc.validar()).toBe(true);
    });

    it('debería retornar true para CE válido', () => {
      const doc = new Documento('CE', '123456789');
      expect(doc.validar()).toBe(true);
    });
  });

  describe('toString()', () => {
    it('debería retornar formato "TIPO: numero"', () => {
      const doc = new Documento('DNI', '12345678');
      expect(doc.toString()).toBe('DNI: 12345678');
    });
  });

  describe('toPlainObject()', () => {
    it('debería retornar objeto plano con tipo y número', () => {
      const doc = new Documento('DNI', '12345678');
      expect(doc.toPlainObject()).toEqual({
        tipo: 'DNI',
        numero: '12345678'
      });
    });
  });
});
