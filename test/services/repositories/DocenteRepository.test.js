import { describe, it, expect, vi } from 'vitest';
import DocenteRepository from '../../../src/services/repositories/DocenteRepository';

describe('DocenteRepository', () => {
  it('debe persistir un docente completo exitosamente', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation((tabla) => {
        if (tabla === 'Docente') {
          return { insert: () => ({ select: () => ({ single: async () => ({ data: { id: 1 }, error: null }) }) }) };
        }
        return {};
      })
    };

    const repo = new DocenteRepository(mockSupabase);
    repo.crear = vi.fn().mockResolvedValue({ id: 10, idPersona: 20 });

    const mockDocente = { nombres: 'Docente Test' };
    const res = await repo.persistir(mockDocente);

    expect(res).toEqual({
      success: true,
      data: { idUsuario: 10, idPersona: 20 }
    });
  });

  it('debe retornar objeto con success false si ocurre un error durante persistencia', async () => {
    const mockSupabase = {};
    const repo = new DocenteRepository(mockSupabase);
    repo.crear = vi.fn().mockRejectedValue(new Error('Falla en BD'));

    const res = await repo.persistir({});
    expect(res).toEqual({
      success: false,
      error: 'Falla en BD'
    });
  });
});
