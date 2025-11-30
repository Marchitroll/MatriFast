import { describe, it, expect } from 'vitest';
import RepresentanteLegal from '../../../src/domain/entities/RepresentanteLegal';
import Documento from '../../../src/domain/entities/Documento';
import Ubicacion from '../../../src/domain/entities/Ubicacion';

describe('RepresentanteLegal', () => {
  const datosValidos = {
    id: 1,
    nombres: 'María Elena',
    aPaterno: 'Rodríguez',
    aMaterno: 'Sánchez',
    fechaNacimiento: '1980-03-20',
    sexo: 'F',
    documento: new Documento('DNI', '87654321'),
    email: 'maria.rodriguez@email.com',
    tipoRelacion: 'MADRE',
    direccion: new Ubicacion('Av. Los Pinos 456'),
    numeroCelular: '987654321',
    viveConEstudiante: true
  };

  describe('constructor', () => {
    it('debería crear un representante legal válido', () => {
      const rl = new RepresentanteLegal(datosValidos);
      
      expect(rl.nombres).toBe('María Elena');
      expect(rl.tipoRelacion).toBe('MADRE');
      expect(rl.numeroCelular).toBe('987654321');
      expect(rl.viveConEstudiante).toBe(true);
      expect(rl.rol).toBe('REPRESENTANTE LEGAL');
    });

    it('debería normalizar tipoRelacion a mayúsculas', () => {
      const datos = { ...datosValidos, tipoRelacion: 'padre' };
      const rl = new RepresentanteLegal(datos);
      expect(rl.tipoRelacion).toBe('PADRE');
    });

    it('debería viveConEstudiante ser false por defecto', () => {
      const datos = { ...datosValidos };
      delete datos.viveConEstudiante;
      const rl = new RepresentanteLegal(datos);
      expect(rl.viveConEstudiante).toBe(false);
    });

    it('debería lanzar error sin tipoRelacion', () => {
      const datos = { ...datosValidos, tipoRelacion: null };
      expect(() => new RepresentanteLegal(datos)).toThrow('El tipo de relación es obligatorio');
    });

    it('debería lanzar error si dirección no es Ubicacion', () => {
      const datos = { ...datosValidos, direccion: 'string normal' };
      expect(() => new RepresentanteLegal(datos)).toThrow('La dirección debe ser instancia de Ubicacion');
    });

    it('debería lanzar error sin número de celular', () => {
      const datos = { ...datosValidos, numeroCelular: null };
      expect(() => new RepresentanteLegal(datos)).toThrow('El número de celular es obligatorio');
    });

    it('debería lanzar error con celular que no empieza con 9', () => {
      const datos = { ...datosValidos, numeroCelular: '123456789' };
      expect(() => new RepresentanteLegal(datos)).toThrow('no tiene formato válido');
    });

    it('debería lanzar error con celular de longitud incorrecta', () => {
      const datos = { ...datosValidos, numeroCelular: '98765432' };
      expect(() => new RepresentanteLegal(datos)).toThrow('no tiene formato válido');
    });
  });

  describe('estudiantes', () => {
    it('debería iniciar con lista vacía de estudiantes', () => {
      const rl = new RepresentanteLegal(datosValidos);
      expect(rl.estudiantes).toEqual([]);
    });

    it('debería agregar estudiante correctamente', () => {
      const rl = new RepresentanteLegal(datosValidos);
      const estudianteMock = { id: 1, nombre: 'Estudiante Test' };
      
      rl.agregarEstudiante(estudianteMock);
      
      expect(rl.estudiantes).toHaveLength(1);
      expect(rl.estudiantes[0]).toEqual(estudianteMock);
    });

    it('no debería agregar estudiante duplicado', () => {
      const rl = new RepresentanteLegal(datosValidos);
      const estudianteMock = { id: 1, nombre: 'Estudiante Test' };
      
      rl.agregarEstudiante(estudianteMock);
      rl.agregarEstudiante(estudianteMock);
      
      expect(rl.estudiantes).toHaveLength(1);
    });

    it('debería retornar copia de estudiantes (inmutabilidad)', () => {
      const rl = new RepresentanteLegal(datosValidos);
      const estudianteMock = { id: 1, nombre: 'Test' };
      rl.agregarEstudiante(estudianteMock);
      
      const lista = rl.estudiantes;
      lista.push({ id: 2, nombre: 'Otro' });
      
      expect(rl.estudiantes).toHaveLength(1);
    });
  });

  describe('toString()', () => {
    it('debería incluir "Rep. Legal:" en el string', () => {
      const rl = new RepresentanteLegal(datosValidos);
      expect(rl.toString()).toContain('Rep. Legal:');
    });

    it('debería incluir el tipo de relación', () => {
      const rl = new RepresentanteLegal(datosValidos);
      expect(rl.toString()).toContain('MADRE');
    });
  });

  describe('toPlainObject()', () => {
    it('debería retornar objeto con todos los campos', () => {
      const rl = new RepresentanteLegal(datosValidos);
      const obj = rl.toPlainObject();
      
      expect(obj.tipoUsuario).toBe('REPRESENTANTE_LEGAL');
      expect(obj.tipoRelacion).toBe('MADRE');
      expect(obj.numeroCelular).toBe('987654321');
      expect(obj.viveConEstudiante).toBe(true);
      expect(obj.direccion).toEqual({ direccion: 'Av. Los Pinos 456' });
    });
  });
});
