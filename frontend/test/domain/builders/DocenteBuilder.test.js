import { describe, it, expect } from 'vitest';
import DocenteBuilder from '../../../src/domain/builders/DocenteBuilder';
import Docente from '../../../src/domain/entities/Docente';
import Documento from '../../../src/domain/entities/Documento';

describe('DocenteBuilder', () => {
  describe('patrón fluido', () => {
    it('debería retornar this en cada método para encadenamiento', () => {
      const builder = new DocenteBuilder();
      
      expect(builder.conId(1)).toBe(builder);
      expect(builder.conPersona({ nombres: 'Test', aPaterno: 'Test' })).toBe(builder);
      expect(builder.conFechaNacimiento('1990-01-01')).toBe(builder);
      expect(builder.conSexo('M')).toBe(builder);
      expect(builder.conEmail('test@test.com')).toBe(builder);
    });

    it('debería construir docente con encadenamiento', () => {
      const docente = new DocenteBuilder()
        .conPersona({ nombres: 'Juan', aPaterno: 'Pérez', aMaterno: 'López' })
        .conFechaNacimiento('1985-06-15')
        .conSexo('M')
        .conDocumento('DNI', '12345678')
        .conEmail('juan.perez@email.com')
        .build();

      expect(docente).toBeInstanceOf(Docente);
      expect(docente.nombres).toBe('Juan');
      expect(docente.aPaterno).toBe('Pérez');
      expect(docente.email).toBe('juan.perez@email.com');
    });
  });

  describe('reset()', () => {
    it('debería reiniciar los datos del builder', () => {
      const builder = new DocenteBuilder()
        .conPersona({ nombres: 'Test', aPaterno: 'Test' })
        .conEmail('test@test.com');
      
      builder.reset();
      
      expect(builder._data.nombres).toBe('');
      expect(builder._data.email).toBe('');
    });

    it('debería retornar this para encadenamiento', () => {
      const builder = new DocenteBuilder();
      expect(builder.reset()).toBe(builder);
    });
  });

  describe('conId()', () => {
    it('debería establecer el id', () => {
      const builder = new DocenteBuilder().conId(123);
      expect(builder._data.id).toBe(123);
    });
  });

  describe('conPersona()', () => {
    it('debería establecer nombres y apellidos', () => {
      const builder = new DocenteBuilder().conPersona({
        nombres: 'Carlos',
        aPaterno: 'García',
        aMaterno: 'López'
      });
      
      expect(builder._data.nombres).toBe('Carlos');
      expect(builder._data.aPaterno).toBe('García');
      expect(builder._data.aMaterno).toBe('López');
    });

    it('debería aceptar aMaterno null por defecto', () => {
      const builder = new DocenteBuilder().conPersona({
        nombres: 'Carlos',
        aPaterno: 'García'
      });
      
      expect(builder._data.aMaterno).toBeNull();
    });
  });

  describe('conDocumento()', () => {
    it('debería crear instancia de Documento', () => {
      const builder = new DocenteBuilder().conDocumento('DNI', '12345678');
      
      expect(builder._data.documento).toBeInstanceOf(Documento);
      expect(builder._data.documento.tipo).toBe('DNI');
      expect(builder._data.documento.numero).toBe('12345678');
    });
  });

  describe('conDocumentoObj()', () => {
    it('debería aceptar instancia de Documento existente', () => {
      const doc = new Documento('CE', '123456789');
      const builder = new DocenteBuilder().conDocumentoObj(doc);
      
      expect(builder._data.documento).toBe(doc);
    });
  });

  describe('build()', () => {
    it('debería crear instancia de Docente', () => {
      const docente = new DocenteBuilder()
        .conPersona({ nombres: 'Test', aPaterno: 'User' })
        .conFechaNacimiento('1990-01-01')
        .conSexo('M')
        .conDocumento('DNI', '12345678')
        .conEmail('test@email.com')
        .build();

      expect(docente).toBeInstanceOf(Docente);
    });

    it('debería lanzar error si faltan datos obligatorios', () => {
      const builder = new DocenteBuilder().conPersona({ nombres: 'Test', aPaterno: 'User' });
      
      expect(() => builder.build()).toThrow();
    });
  });

  describe('fromFormData()', () => {
    it('debería crear Docente desde datos de formulario', () => {
      const formData = {
        nombres: 'María',
        aPaterno: 'González',
        aMaterno: 'Ruiz',
        fechaNacimiento: '1988-03-25',
        sexo: 'F',
        tipoDocumento: 'DNI',
        numeroDocumento: '87654321'
      };

      const docente = DocenteBuilder.fromFormData(formData, 'maria@email.com');

      expect(docente).toBeInstanceOf(Docente);
      expect(docente.nombres).toBe('María');
      expect(docente.aPaterno).toBe('González');
      expect(docente.email).toBe('maria@email.com');
      expect(docente.documento.numero).toBe('87654321');
    });

    it('debería manejar aMaterno vacío como null', () => {
      const formData = {
        nombres: 'Pedro',
        aPaterno: 'Sánchez',
        aMaterno: '',
        fechaNacimiento: '1990-07-10',
        sexo: 'M',
        tipoDocumento: 'DNI',
        numeroDocumento: '11111111'
      };

      const docente = DocenteBuilder.fromFormData(formData, 'pedro@email.com');
      expect(docente.aMaterno).toBeNull();
    });
  });
});
