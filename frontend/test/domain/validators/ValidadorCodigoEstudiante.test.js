import { describe, it, expect } from 'vitest';
import ValidadorCodigoEstudiante from '../../../src/domain/entities/validators/ValidadorCodigoEstudiante';
import ValidadorDocumento from '../../../src/domain/entities/validators/ValidadorDocumento';

describe('ValidadorCodigoEstudiante', () => {
  const validador = new ValidadorCodigoEstudiante();

  describe('herencia', () => {
    it('debería extender ValidadorDocumento', () => {
      expect(validador).toBeInstanceOf(ValidadorDocumento);
    });
  });

  describe('validar()', () => {
    describe('casos válidos', () => {
      it('debería aceptar código de 5 caracteres', () => {
        expect(validador.validar('A1234')).toBe(true);
      });

      it('debería aceptar código de 20 caracteres', () => {
        expect(validador.validar('A1234567890123456789')).toBe(true);
      });

      it('debería aceptar código de 10 caracteres', () => {
        expect(validador.validar('EST1234567')).toBe(true);
      });

      it('debería aceptar código solo con números', () => {
        expect(validador.validar('12345')).toBe(true);
      });

      it('debería aceptar código solo con letras', () => {
        expect(validador.validar('ABCDE')).toBe(true);
      });

      it('debería aceptar código en minúsculas', () => {
        expect(validador.validar('abc12')).toBe(true);
      });
    });

    describe('casos inválidos', () => {
      it('debería rechazar código con menos de 5 caracteres', () => {
        expect(validador.validar('A123')).toBe(false);
      });

      it('debería rechazar código con más de 20 caracteres', () => {
        expect(validador.validar('A12345678901234567890')).toBe(false);
      });

      it('debería rechazar código con caracteres especiales', () => {
        expect(validador.validar('A123-5')).toBe(false);
      });

      it('debería rechazar código vacío', () => {
        expect(validador.validar('')).toBe(false);
      });

      it('debería rechazar código con espacios', () => {
        expect(validador.validar('A1 34')).toBe(false);
      });
    });
  });
});
