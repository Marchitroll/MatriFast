import { describe, it, expect } from 'vitest';
import ValidadorPTP from '../../../src/domain/entities/validators/ValidadorPTP';
import ValidadorDocumento from '../../../src/domain/entities/validators/ValidadorDocumento';

describe('ValidadorPTP', () => {
  const validador = new ValidadorPTP();

  describe('herencia', () => {
    it('debería extender ValidadorDocumento', () => {
      expect(validador).toBeInstanceOf(ValidadorDocumento);
    });
  });

  describe('validar()', () => {
    describe('casos válidos', () => {
      it('debería aceptar PTP de 9 caracteres', () => {
        expect(validador.validar('ABC123456')).toBe(true);
      });

      it('debería aceptar PTP de 15 caracteres', () => {
        expect(validador.validar('ABC123456789012')).toBe(true);
      });

      it('debería aceptar PTP de 12 caracteres', () => {
        expect(validador.validar('ABC123456789')).toBe(true);
      });

      it('debería aceptar PTP solo con números', () => {
        expect(validador.validar('123456789')).toBe(true);
      });

      it('debería aceptar PTP solo con letras', () => {
        expect(validador.validar('ABCDEFGHIJ')).toBe(true);
      });

      it('debería aceptar PTP en minúsculas', () => {
        expect(validador.validar('abc123456789')).toBe(true);
      });
    });

    describe('casos inválidos', () => {
      it('debería rechazar PTP con menos de 9 caracteres', () => {
        expect(validador.validar('ABC12345')).toBe(false);
      });

      it('debería rechazar PTP con más de 15 caracteres', () => {
        expect(validador.validar('ABC1234567890123')).toBe(false);
      });

      it('debería rechazar PTP con caracteres especiales', () => {
        expect(validador.validar('ABC-123456')).toBe(false);
      });

      it('debería rechazar PTP vacío', () => {
        expect(validador.validar('')).toBe(false);
      });
    });
  });
});
