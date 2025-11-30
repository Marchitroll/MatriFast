import { describe, it, expect } from 'vitest';
import ValidadorCE from '../../../src/domain/entities/validators/ValidadorCE';
import ValidadorDocumento from '../../../src/domain/entities/validators/ValidadorDocumento';

describe('ValidadorCE', () => {
  const validador = new ValidadorCE();

  describe('herencia', () => {
    it('debería extender ValidadorDocumento', () => {
      expect(validador).toBeInstanceOf(ValidadorDocumento);
    });
  });

  describe('validar()', () => {
    describe('casos válidos', () => {
      it('debería aceptar CE de 9 caracteres alfanuméricos', () => {
        expect(validador.validar('ABC123456')).toBe(true);
      });

      it('debería aceptar CE de 12 caracteres alfanuméricos', () => {
        expect(validador.validar('ABC123456789')).toBe(true);
      });

      it('debería aceptar CE de 10 caracteres', () => {
        expect(validador.validar('AB12345678')).toBe(true);
      });

      it('debería aceptar CE solo con números', () => {
        expect(validador.validar('123456789')).toBe(true);
      });

      it('debería aceptar CE solo con letras', () => {
        expect(validador.validar('ABCDEFGHI')).toBe(true);
      });

      it('debería aceptar CE en minúsculas', () => {
        expect(validador.validar('abc123456')).toBe(true);
      });
    });

    describe('casos inválidos', () => {
      it('debería rechazar CE con menos de 9 caracteres', () => {
        expect(validador.validar('ABC12345')).toBe(false);
      });

      it('debería rechazar CE con más de 12 caracteres', () => {
        expect(validador.validar('ABC1234567890')).toBe(false);
      });

      it('debería rechazar CE con caracteres especiales', () => {
        expect(validador.validar('ABC-12345')).toBe(false);
      });

      it('debería rechazar CE vacío', () => {
        expect(validador.validar('')).toBe(false);
      });

      it('debería rechazar CE con espacios', () => {
        expect(validador.validar('ABC 12345')).toBe(false);
      });
    });
  });
});
