import { describe, it, expect, vi } from 'vitest';
import UsuarioRepository from '../../../src/services/repositories/UsuarioRepository';

describe('UsuarioRepository', () => {
  it('debe crear un usuario obteniendo idPersona e idRol', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation((tabla) => {
        if (tabla === 'Rol') {
          return { select: () => ({ eq: () => ({ single: async () => ({ data: { id: 5 }, error: null }) }) }) };
        }
        if (tabla === 'Usuario') {
          return { insert: () => ({ select: () => ({ single: async () => ({ data: { id: 10, email: 'test@mail.com', idRol: 5 }, error: null }) }) }) };
        }
        return { select: () => ({ eq: () => ({ single: async () => ({ data: { id: 1 }, error: null }) }) }) };
      })
    };

    const repo = new UsuarioRepository(mockSupabase);
    repo.personaRepo.crear = vi.fn().mockResolvedValue({ id: 99 });

    const mockUsuario = { email: 'test@mail.com' };
    const res = await repo.crear(mockUsuario, 'DOCENTE');

    expect(res).toEqual({ id: 10, email: 'test@mail.com', idRol: 5, idPersona: 99 });
  });

  it('debe obtener idPersona buscando por idUsuario', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { idPersona: 88 }, error: null })
          })
        })
      })
    };

    const repo = new UsuarioRepository(mockSupabase);
    const idPersona = await repo.getIdPersona(10);
    expect(idPersona).toBe(88);
  });

  it('debe lanzar error si getIdPersona no encuentra el registro', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      })
    };

    const repo = new UsuarioRepository(mockSupabase);
    await expect(repo.getIdPersona(999)).rejects.toThrow('No se encontró la persona asociada');
  });
});
