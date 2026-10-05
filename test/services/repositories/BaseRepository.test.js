import { describe, it, expect, vi } from 'vitest';
import BaseRepository from '../../../src/services/repositories/BaseRepository';

describe('BaseRepository', () => {
  it('debe lanzar error si no se provee cliente Supabase en el constructor', () => {
    expect(() => new BaseRepository(null)).toThrow('Se requiere cliente Supabase');
  });

  describe('getEnumId', () => {
    it('debe retornar el id del valor encontrado en la tabla enum', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 10 }, error: null })
            })
          })
        })
      };

      const repo = new BaseRepository(mockSupabase);
      const id = await repo.getEnumId('tipos_documento', 'DNI');
      expect(id).toBe(10);
      expect(mockSupabase.from).toHaveBeenCalledWith('tipos_documento');
    });

    it('debe lanzar error si no se encuentra el valor o falla Supabase', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
            })
          })
        })
      };

      const repo = new BaseRepository(mockSupabase);
      await expect(repo.getEnumId('tipos_documento', 'INVALIDO')).rejects.toThrow(
        'No se encontró INVALIDO en tipos_documento'
      );
    });
  });

  describe('insert', () => {
    it('debe insertar un registro y retornar el objeto insertado', async () => {
      const mockData = { id: 1, nombre: 'Test' };
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockData, error: null })
            })
          })
        })
      };

      const repo = new BaseRepository(mockSupabase);
      const result = await repo.insert('personas', { nombre: 'Test' });
      expect(result).toEqual(mockData);
    });

    it('debe lanzar error si la inserción falla en Supabase', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error de llave duplicada' } })
            })
          })
        })
      };

      const repo = new BaseRepository(mockSupabase);
      await expect(repo.insert('personas', {})).rejects.toThrow('Error en personas: Error de llave duplicada');
    });
  });

  describe('update', () => {
    it('debe actualizar un registro correctamente', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null })
          })
        })
      };

      const repo = new BaseRepository(mockSupabase);
      const res = await repo.update('personas', 1, { nombre: 'Actualizado' });
      expect(res).toBe(true);
    });

    it('debe lanzar error si la actualización falla', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: { message: 'ID inexistente' } })
          })
        })
      };

      const repo = new BaseRepository(mockSupabase);
      await expect(repo.update('personas', 99, {})).rejects.toThrow('Error en personas: ID inexistente');
    });
  });
});
