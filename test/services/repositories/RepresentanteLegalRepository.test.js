import { describe, it, expect, vi } from 'vitest';
import RepresentanteLegalRepository from '../../../src/services/repositories/RepresentanteLegalRepository';

describe('RepresentanteLegalRepository', () => {
  it('debe persistir un representante legal creando ubicación, usuario y registro RL', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation((tabla) => {
        if (tabla === 'Ubicacion') {
          return { insert: () => ({ select: () => ({ single: async () => ({ data: { id: 5 }, error: null }) }) }) };
        }
        if (tabla === 'TipoRelacion') {
          return { select: () => ({ eq: () => ({ single: async () => ({ data: { id: 2 }, error: null }) }) }) };
        }
        if (tabla === 'RepresentanteLegal') {
          return { insert: () => ({ select: () => ({ single: async () => ({ data: { id: 99 }, error: null }) }) }) };
        }
        return {};
      })
    };

    const repo = new RepresentanteLegalRepository(mockSupabase);
    repo.crear = vi.fn().mockResolvedValue({ id: 10, idPersona: 20 });

    const mockRL = {
      direccion: 'Av. Siempre Viva 123',
      tipoRelacion: 'PADRE',
      numeroCelular: '987654321',
      viveConEstudiante: true
    };

    const res = await repo.persistir(mockRL);
    expect(res).toEqual({
      success: true,
      data: {
        id: 10,
        idPersona: 20,
        idRepresentanteLegal: 99,
        idDireccion: 5
      }
    });
  });

  it('debe retornar success false si ocurre un error durante la persistencia de RL', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => {
        throw new Error('Error de conexión BD');
      })
    };
    const repo = new RepresentanteLegalRepository(mockSupabase);

    const res = await repo.persistir({ direccion: 'Test' });
    expect(res).toEqual({
      success: false,
      error: 'Error de conexión BD'
    });
  });
});
