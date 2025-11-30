import { describe, it, expect } from 'vitest';
import ValidadorDocumento from '../../../src/domain/entities/validators/ValidadorDocumento';

describe('ValidadorDocumento', () => {
  it('debería lanzar error si validar() no está implementado', () => {
    const validador = new ValidadorDocumento();
    expect(() => validador.validar('12345678')).toThrow('Método validar() debe ser implementado');
  });

  it('debería ser instanciable como clase base', () => {
    const validador = new ValidadorDocumento();
    expect(validador).toBeInstanceOf(ValidadorDocumento);
  });
});
