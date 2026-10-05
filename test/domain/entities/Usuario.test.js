import { describe, it, expect } from 'vitest';
import Usuario from '../../../src/domain/entities/Usuario';
import Documento from '../../../src/domain/entities/Documento';

class UsuarioConcreto extends Usuario {
  constructor(config) {
    super(config);
  }
}

describe('Usuario (Clase Abstracta)', () => {
  const datosValidos = {
    id: 1,
    nombres: 'Ana',
    aPaterno: 'Mendoza',
    aMaterno: 'Ríos',
    fechaNacimiento: '1992-08-10',
    sexo: 'F',
    documento: new Documento('DNI', '87654321'),
    email: 'ana.mendoza@email.com',
    rol: 'DOCENTE'
  };

  describe('instanciación', () => {
    it('debería rechazar instanciación directa', () => {
      expect(() => new Usuario(datosValidos)).toThrow('No se puede instanciar la clase abstracta Usuario');
    });

    it('debería instanciar mediante subclase', () => {
      const user = new UsuarioConcreto(datosValidos);
      expect(user.email).toBe('ana.mendoza@email.com');
      expect(user.rol).toBe('DOCENTE');
    });
  });

  describe('validaciones de email y rol', () => {
    it('debería normalizar email a minúsculas', () => {
      const user = new UsuarioConcreto({ ...datosValidos, email: 'ANA.MENDOZA@EMAIL.COM' });
      expect(user.email).toBe('ana.mendoza@email.com');
    });

    it('debería rechazar email inválido', () => {
      expect(() => new UsuarioConcreto({ ...datosValidos, email: 'email-invalido' })).toThrow('no tiene formato válido');
    });

    it('debería rechazar email vacío', () => {
      expect(() => new UsuarioConcreto({ ...datosValidos, email: '' })).toThrow('email es obligatorio');
    });

    it('debería rechazar rol vacío', () => {
      expect(() => new UsuarioConcreto({ ...datosValidos, rol: '' })).toThrow('rol es obligatorio');
    });
  });

  describe('toPlainObject()', () => {
    it('debería incluir email y rol en el objeto plano', () => {
      const user = new UsuarioConcreto(datosValidos);
      const obj = user.toPlainObject();

      expect(obj.email).toBe('ana.mendoza@email.com');
      expect(obj.rol).toBe('DOCENTE');
      expect(obj.nombres).toBe('Ana');
    });
  });
});
