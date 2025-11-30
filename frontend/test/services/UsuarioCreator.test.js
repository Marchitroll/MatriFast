import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsuarioCreator from '../../src/services/UsuarioCreator';

// Mock del logger
vi.mock('../../src/services/Logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('UsuarioCreator', () => {
  let creator;

  beforeEach(() => {
    creator = new UsuarioCreator();
  });

  describe('crearUsuario() - Strategy Pattern', () => {
    describe('rol DOCENTE', () => {
      const datosFormulario = {
        nombres: 'Pedro',
        aPaterno: 'López',
        aMaterno: 'García',
        fechaNacimiento: '1985-03-15',
        sexo: 'M',
        tipoDocumento: 'DNI',
        numeroDocumento: '12345678'
      };

      it('debería crear un docente exitosamente', async () => {
        const resultado = await creator.crearUsuario(
          { email: 'pedro@email.com', role: 'DOCENTE' },
          datosFormulario
        );

        expect(resultado.success).toBe(true);
        expect(resultado.data.usuario).toBeDefined();
        expect(resultado.data.usuario.rol).toBe('DOCENTE');
        expect(resultado.data.documento).toBeDefined();
      });

      it('debería retornar el documento del docente', async () => {
        const resultado = await creator.crearUsuario(
          { email: 'pedro@email.com', role: 'DOCENTE' },
          datosFormulario
        );

        expect(resultado.data.documento.numero).toBe('12345678');
      });

      it('debería fallar con datos inválidos', async () => {
        const datosInvalidos = { ...datosFormulario, nombres: null };
        
        const resultado = await creator.crearUsuario(
          { email: 'test@email.com', role: 'DOCENTE' },
          datosInvalidos
        );

        expect(resultado.success).toBe(false);
        expect(resultado.error).toBeDefined();
      });
    });

    describe('rol REPRESENTANTE LEGAL', () => {
      const datosFormulario = {
        nombres: 'María',
        aPaterno: 'Sánchez',
        aMaterno: 'Ruiz',
        fechaNacimiento: '1980-07-20',
        sexo: 'F',
        tipoDocumento: 'DNI',
        numeroDocumento: '87654321',
        tipoRelacion: 'MADRE',
        direccion: 'Av. Principal 456',
        numeroCelular: '987654321',
        viveConEstudiante: true
      };

      it('debería crear un representante legal exitosamente', async () => {
        const resultado = await creator.crearUsuario(
          { email: 'maria@email.com', role: 'REPRESENTANTE LEGAL' },
          datosFormulario
        );

        expect(resultado.success).toBe(true);
        expect(resultado.data.usuario).toBeDefined();
        expect(resultado.data.usuario.rol).toBe('REPRESENTANTE LEGAL');
      });

      it('debería incluir ubicación en el resultado', async () => {
        const resultado = await creator.crearUsuario(
          { email: 'maria@email.com', role: 'REPRESENTANTE LEGAL' },
          datosFormulario
        );

        expect(resultado.data.ubicacion).toBeDefined();
        expect(resultado.data.ubicacion.direccion).toBe('Av. Principal 456');
      });

      it('debería fallar con celular inválido', async () => {
        const datosInvalidos = { ...datosFormulario, numeroCelular: '123' };
        
        const resultado = await creator.crearUsuario(
          { email: 'test@email.com', role: 'REPRESENTANTE LEGAL' },
          datosInvalidos
        );

        expect(resultado.success).toBe(false);
        expect(resultado.error).toContain('formato válido');
      });
    });

    describe('rol no reconocido', () => {
      it('debería retornar error para rol inválido', async () => {
        const resultado = await creator.crearUsuario(
          { email: 'test@email.com', role: 'ROL_INEXISTENTE' },
          {}
        );

        expect(resultado.success).toBe(false);
        expect(resultado.error).toContain('no reconocido');
      });

      it('debería retornar error para rol vacío', async () => {
        const resultado = await creator.crearUsuario(
          { email: 'test@email.com', role: '' },
          {}
        );

        expect(resultado.success).toBe(false);
      });
    });
  });

  describe('registrarEstrategia() - Extensibilidad OCP', () => {
    it('debería permitir registrar nueva estrategia', async () => {
      const estrategiaTest = vi.fn().mockReturnValue({
        success: true,
        data: { usuario: { rol: 'TEST' } }
      });

      UsuarioCreator.registrarEstrategia('ROL_TEST', estrategiaTest);

      const resultado = await creator.crearUsuario(
        { email: 'test@email.com', role: 'ROL_TEST' },
        { dato: 'valor' }
      );

      expect(estrategiaTest).toHaveBeenCalled();
      expect(resultado.success).toBe(true);
    });
  });
});
