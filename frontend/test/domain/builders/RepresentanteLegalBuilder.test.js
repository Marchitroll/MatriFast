import { describe, it, expect } from 'vitest';
import RepresentanteLegalBuilder from '../../../src/domain/builders/RepresentanteLegalBuilder';
import RepresentanteLegal from '../../../src/domain/entities/RepresentanteLegal';
import Documento from '../../../src/domain/entities/Documento';
import Ubicacion from '../../../src/domain/entities/Ubicacion';

describe('RepresentanteLegalBuilder', () => {
  describe('patrón fluido', () => {
    it('debería retornar this en cada método para encadenamiento', () => {
      const builder = new RepresentanteLegalBuilder();
      
      expect(builder.conId(1)).toBe(builder);
      expect(builder.conPersona({ nombres: 'Test', aPaterno: 'Test' })).toBe(builder);
      expect(builder.conRelacion('PADRE')).toBe(builder);
      expect(builder.conCelular('987654321')).toBe(builder);
      expect(builder.conViveConEstudiante(true)).toBe(builder);
    });

    it('debería construir representante legal con encadenamiento', () => {
      const rl = new RepresentanteLegalBuilder()
        .conPersona({ nombres: 'Ana', aPaterno: 'Martínez', aMaterno: 'Vega' })
        .conFechaNacimiento('1978-09-12')
        .conSexo('F')
        .conDocumento('DNI', '12345678')
        .conEmail('ana.martinez@email.com')
        .conRelacion('MADRE')
        .conDireccion('Av. Principal 123')
        .conCelular('912345678')
        .conViveConEstudiante(true)
        .build();

      expect(rl).toBeInstanceOf(RepresentanteLegal);
      expect(rl.nombres).toBe('Ana');
      expect(rl.tipoRelacion).toBe('MADRE');
      expect(rl.numeroCelular).toBe('912345678');
    });
  });

  describe('reset()', () => {
    it('debería reiniciar los datos del builder', () => {
      const builder = new RepresentanteLegalBuilder()
        .conPersona({ nombres: 'Test', aPaterno: 'Test' })
        .conRelacion('TUTOR');
      
      builder.reset();
      
      expect(builder._data.nombres).toBe('');
      expect(builder._data.tipoRelacion).toBe('');
      expect(builder._data.viveConEstudiante).toBe(false);
    });
  });

  describe('conRelacion()', () => {
    it('debería establecer el tipo de relación', () => {
      const builder = new RepresentanteLegalBuilder().conRelacion('ABUELO');
      expect(builder._data.tipoRelacion).toBe('ABUELO');
    });
  });

  describe('conDireccion()', () => {
    it('debería crear Ubicacion a partir de string', () => {
      const builder = new RepresentanteLegalBuilder().conDireccion('Jr. Lima 456');
      
      expect(builder._data.direccion).toBeInstanceOf(Ubicacion);
      expect(builder._data.direccion.direccion).toBe('Jr. Lima 456');
    });

    it('debería aceptar instancia de Ubicacion existente', () => {
      const ubi = new Ubicacion('Calle Test 789');
      const builder = new RepresentanteLegalBuilder().conDireccion(ubi);
      
      expect(builder._data.direccion).toBe(ubi);
    });
  });

  describe('conCelular()', () => {
    it('debería establecer el número de celular', () => {
      const builder = new RepresentanteLegalBuilder().conCelular('998877665');
      expect(builder._data.numeroCelular).toBe('998877665');
    });
  });

  describe('conViveConEstudiante()', () => {
    it('debería establecer true', () => {
      const builder = new RepresentanteLegalBuilder().conViveConEstudiante(true);
      expect(builder._data.viveConEstudiante).toBe(true);
    });

    it('debería convertir valores truthy a boolean', () => {
      const builder = new RepresentanteLegalBuilder().conViveConEstudiante(1);
      expect(builder._data.viveConEstudiante).toBe(true);
    });

    it('debería convertir valores falsy a false', () => {
      const builder = new RepresentanteLegalBuilder().conViveConEstudiante(0);
      expect(builder._data.viveConEstudiante).toBe(false);
    });
  });

  describe('build()', () => {
    it('debería crear instancia de RepresentanteLegal', () => {
      const rl = new RepresentanteLegalBuilder()
        .conPersona({ nombres: 'Luis', aPaterno: 'Torres' })
        .conFechaNacimiento('1975-05-20')
        .conSexo('M')
        .conDocumento('DNI', '11223344')
        .conEmail('luis.torres@email.com')
        .conRelacion('PADRE')
        .conDireccion('Av. Test 100')
        .conCelular('955443322')
        .build();

      expect(rl).toBeInstanceOf(RepresentanteLegal);
      expect(rl.rol).toBe('REPRESENTANTE LEGAL');
    });
  });

  describe('fromFormData()', () => {
    it('debería crear RepresentanteLegal desde datos de formulario', () => {
      const formData = {
        nombres: 'Carmen',
        aPaterno: 'Flores',
        aMaterno: 'Díaz',
        fechaNacimiento: '1982-11-08',
        sexo: 'F',
        tipoDocumento: 'DNI',
        numeroDocumento: '44556677',
        tipoRelacion: 'MADRE',
        direccion: 'Jr. Cusco 321',
        numeroCelular: '966554433',
        viveConEstudiante: true
      };

      const rl = RepresentanteLegalBuilder.fromFormData(formData, 'carmen@email.com');

      expect(rl).toBeInstanceOf(RepresentanteLegal);
      expect(rl.nombres).toBe('Carmen');
      expect(rl.tipoRelacion).toBe('MADRE');
      expect(rl.email).toBe('carmen@email.com');
      expect(rl.direccion.direccion).toBe('Jr. Cusco 321');
      expect(rl.viveConEstudiante).toBe(true);
    });

    it('debería manejar aMaterno vacío como null', () => {
      const formData = {
        nombres: 'Roberto',
        aPaterno: 'Silva',
        aMaterno: '',
        fechaNacimiento: '1979-04-15',
        sexo: 'M',
        tipoDocumento: 'DNI',
        numeroDocumento: '99887766',
        tipoRelacion: 'TUTOR',
        direccion: 'Av. Arequipa 500',
        numeroCelular: '944332211',
        viveConEstudiante: false
      };

      const rl = RepresentanteLegalBuilder.fromFormData(formData, 'roberto@email.com');
      expect(rl.aMaterno).toBeNull();
    });
  });
});
