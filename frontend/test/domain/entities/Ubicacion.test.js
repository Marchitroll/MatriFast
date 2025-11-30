import { describe, it, expect } from 'vitest';
import Ubicacion from '../../../src/domain/entities/Ubicacion';

describe('Ubicacion', () => {
  describe('constructor', () => {
    it('debería crear una ubicación válida con dirección', () => {
      const ubi = new Ubicacion('Av. Principal 123');
      expect(ubi.direccion).toBe('Av. Principal 123');
    });

    it('debería recortar espacios en blanco', () => {
      const ubi = new Ubicacion('  Calle Test 456  ');
      expect(ubi.direccion).toBe('Calle Test 456');
    });

    it('debería lanzar error si la dirección está vacía', () => {
      expect(() => new Ubicacion('')).toThrow('La dirección es obligatoria');
    });

    it('debería lanzar error si la dirección son solo espacios', () => {
      expect(() => new Ubicacion('   ')).toThrow('La dirección es obligatoria');
    });

    it('debería lanzar error si la dirección no es string', () => {
      expect(() => new Ubicacion(123)).toThrow('La dirección debe ser una cadena de texto');
    });

    it('debería lanzar error si la dirección es null', () => {
      expect(() => new Ubicacion(null)).toThrow();
    });
  });

  describe('setter direccion', () => {
    it('debería actualizar la dirección correctamente', () => {
      const ubi = new Ubicacion('Dirección inicial');
      ubi.direccion = 'Nueva dirección';
      expect(ubi.direccion).toBe('Nueva dirección');
    });

    it('debería lanzar error al asignar cadena vacía', () => {
      const ubi = new Ubicacion('Dirección inicial');
      expect(() => { ubi.direccion = ''; }).toThrow('La dirección es obligatoria');
    });
  });

  describe('toString()', () => {
    it('debería retornar la dirección como string', () => {
      const ubi = new Ubicacion('Jr. Lima 789');
      expect(ubi.toString()).toBe('Jr. Lima 789');
    });
  });

  describe('toPlainObject()', () => {
    it('debería retornar objeto con propiedad direccion', () => {
      const ubi = new Ubicacion('Av. Arequipa 1500');
      expect(ubi.toPlainObject()).toEqual({
        direccion: 'Av. Arequipa 1500'
      });
    });
  });
});
