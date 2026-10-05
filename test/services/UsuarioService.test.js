import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsuarioService } from '../../src/services/UsuarioService';
import supabase from '../../src/config/ClienteSupabase';

vi.mock('../../src/config/ClienteSupabase', () => ({
  default: {
    from: vi.fn()
  }
}));

describe('UsuarioService', () => {
  let service;
  let mockCreator;
  let mockPersistence;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreator = {
      crearUsuario: vi.fn()
    };
    mockPersistence = {
      persistir: vi.fn(),
      actualizar: vi.fn()
    };

    service = new UsuarioService(mockCreator, mockPersistence);
  });

  describe('registrar()', () => {
    it('debería orquestar creación y persistencia exitosamente', async () => {
      const mockUsuarioObj = { id: 1, role: 'DOCENTE' };
      mockCreator.crearUsuario.mockResolvedValue({
        success: true,
        data: { usuario: mockUsuarioObj }
      });
      mockPersistence.persistir.mockResolvedValue({
        success: true,
        data: { id: 1 }
      });

      const res = await service.registrar(
        { email: 'test@email.com', role: 'DOCENTE' },
        { nombres: 'Juan' }
      );

      expect(mockCreator.crearUsuario).toHaveBeenCalledWith(
        { email: 'test@email.com', role: 'DOCENTE' },
        { nombres: 'Juan' }
      );
      expect(mockPersistence.persistir).toHaveBeenCalledWith(mockUsuarioObj);
      expect(res.success).toBe(true);
    });

    it('debería abortar si el creador falla', async () => {
      mockCreator.crearUsuario.mockResolvedValue({
        success: false,
        error: 'Datos inválidos'
      });

      const res = await service.registrar({ role: 'DOCENTE' }, {});

      expect(mockPersistence.persistir).not.toHaveBeenCalled();
      expect(res.success).toBe(false);
      expect(res.error).toBe('Datos inválidos');
    });
  });

  describe('actualizar()', () => {
    it('debería delegar actualización a la capa de persistencia', async () => {
      mockPersistence.actualizar.mockResolvedValue({ success: true });

      const datos = { id: 1, role: 'DOCENTE', nombres: 'Carlos' };
      const res = await service.actualizar(datos);

      expect(mockPersistence.actualizar).toHaveBeenCalledWith(datos);
      expect(res.success).toBe(true);
    });
  });

  describe('obtenerPerfil()', () => {
    it('debería retornar el perfil formateado incluyendo role y rol para Docente', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 1,
                email: 'docente@test.com',
                Persona: {
                  nombres: 'Laura',
                  aPaterno: 'Vargas',
                  aMaterno: 'Perez',
                  fechaNacimiento: '1990-01-01',
                  nroDocumento: '12345678',
                  Sexo: { valor: 'F' },
                  TipoDocumento: { valor: 'DNI' }
                }
              },
              error: null
            })
          })
        })
      });

      const res = await service.obtenerPerfil(1, 'DOCENTE');
      expect(res.success).toBe(true);
      expect(res.data.email).toBe('docente@test.com');
      expect(res.data.role).toBe('DOCENTE');
      expect(res.data.rol).toBe('DOCENTE');
    });

    it('debería retornar el perfil formateado para Representante Legal con ubicación', async () => {
      supabase.from.mockImplementation((tabla) => {
        if (tabla === 'Usuario') {
          return {
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: {
                    id: 2,
                    email: 'rl@test.com',
                    Persona: { nombres: 'Carlos', Sexo: { valor: 'M' }, TipoDocumento: { valor: 'DNI' } }
                  },
                  error: null
                })
              })
            })
          };
        }
        if (tabla === 'RepresentanteLegal') {
          return {
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: {
                    celular: '987654321',
                    viveConEstudiante: true,
                    TipoRelacion: { valor: 'PADRE' },
                    Ubicacion: { id: 5, direccion: 'Av. Siempre Viva 123' }
                  },
                  error: null
                })
              })
            })
          };
        }
        return {};
      });

      const res = await service.obtenerPerfil(2, 'REPRESENTANTE LEGAL');
      expect(res.success).toBe(true);
      expect(res.data.numeroCelular).toBe('987654321');
      expect(res.data.tipoRelacion).toBe('PADRE');
      expect(res.data.direccion).toEqual({ id: 5, direccion: 'Av. Siempre Viva 123' });
    });

    it('debería retornar error si ocurre un fallo en Supabase', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: new Error('Usuario no encontrado')
            })
          })
        })
      });

      const res = await service.obtenerPerfil(99, 'DOCENTE');
      expect(res.success).toBe(false);
      expect(res.error).toBe('Usuario no encontrado');
    });
  });
});
