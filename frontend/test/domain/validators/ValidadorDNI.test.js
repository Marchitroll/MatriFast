import { describe, it, expect } from 'vitest';
import ValidadorDNI from '../../../src/domain/entities/validators/ValidadorDNI';
import ValidadorDocumento from '../../../src/domain/entities/validators/ValidadorDocumento';

describe('ValidadorDNI', () => {
  const validador = new ValidadorDNI();

  describe('herencia', () => {
    it('debería extender ValidadorDocumento', () => {
      expect(validador).toBeInstanceOf(ValidadorDocumento);
    });
  });

  describe('validar()', () => {
    describe('casos válidos', () => {
      it('debería aceptar DNI de 8 dígitos', () => {
        expect(validador.validar('12345678')).toBe(true);
      });

      it('debería aceptar DNI con todos ceros', () => {
        expect(validador.validar('00000000')).toBe(true);
      });

      it('debería aceptar DNI con todos nueves', () => {
        expect(validador.validar('99999999')).toBe(true);
      });
    });

    describe('casos inválidos', () => {
      it('debería rechazar DNI con menos de 8 dígitos', () => {
        expect(validador.validar('1234567')).toBe(false);
      });

      it('debería rechazar DNI con más de 8 dígitos', () => {
        expect(validador.validar('123456789')).toBe(false);
      });

      it('debería rechazar DNI con letras', () => {
        expect(validador.validar('1234567A')).toBe(false);
      });

      it('debería rechazar DNI con caracteres especiales', () => {
        expect(validador.validar('1234-678')).toBe(false);
      });

      it('debería rechazar DNI vacío', () => {
        expect(validador.validar('')).toBe(false);
      });

      it('debería rechazar DNI con espacios', () => {
        expect(validador.validar('1234 678')).toBe(false);
      });
    });
  });
});
