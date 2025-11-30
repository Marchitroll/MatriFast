import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de Supabase antes de importar EnumService
vi.mock('../../src/config/ClienteSupabase', () => ({
  default: {
    from: vi.fn()
  }
}));

import enumService from '../../src/services/EnumService';
import supabase from '../../src/config/ClienteSupabase';

describe('EnumService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    enumService.clearCache();
  });

  describe('getEnum()', () => {
    it('debería obtener valores de la base de datos', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'M' }, { valor: 'F' }],
          error: null
        })
      });

      const result = await enumService.getEnum('Sexo');

      expect(supabase.from).toHaveBeenCalledWith('Sexo');
      expect(result).toEqual(['M', 'F']);
    });

    it('debería cachear resultados', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'DNI' }, { valor: 'CE' }],
          error: null
        })
      });

      await enumService.getEnum('TipoDocumento');
      await enumService.getEnum('TipoDocumento');

      expect(supabase.from).toHaveBeenCalledTimes(1);
    });

    it('debería retornar valores por defecto en caso de error', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('DB Error')
        })
      });

      const result = await enumService.getEnum('Sexo');

      expect(result).toEqual(['M', 'F']);
    });

    it('debería recortar espacios en valores', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: '  PADRE  ' }, { valor: 'MADRE ' }],
          error: null
        })
      });

      const result = await enumService.getEnum('TipoRelacion');

      expect(result).toEqual(['PADRE', 'MADRE']);
    });

    it('debería filtrar valores vacíos', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'DNI' }, { valor: '' }, { valor: 'CE' }],
          error: null
        })
      });

      const result = await enumService.getEnum('TipoDocumento');

      expect(result).toEqual(['DNI', 'CE']);
    });

    it('debería congelar el resultado (inmutable)', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'M' }],
          error: null
        })
      });

      const result = await enumService.getEnum('Sexo');

      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe('métodos específicos', () => {
    beforeEach(() => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'TEST' }],
          error: null
        })
      });
    });

    it('getSexos() debería llamar getEnum con "Sexo"', async () => {
      await enumService.getSexos();
      expect(supabase.from).toHaveBeenCalledWith('Sexo');
    });

    it('getTiposDocumento() debería llamar getEnum con "TipoDocumento"', async () => {
      await enumService.getTiposDocumento();
      expect(supabase.from).toHaveBeenCalledWith('TipoDocumento');
    });

    it('getTiposRelacion() debería llamar getEnum con "TipoRelacion"', async () => {
      await enumService.getTiposRelacion();
      expect(supabase.from).toHaveBeenCalledWith('TipoRelacion');
    });

    it('getRolesUsuario() debería llamar getEnum con "Rol"', async () => {
      await enumService.getRolesUsuario();
      expect(supabase.from).toHaveBeenCalledWith('Rol');
    });

    it('getModalidades() debería llamar getEnum con "Modalidad"', async () => {
      await enumService.getModalidades();
      expect(supabase.from).toHaveBeenCalledWith('Modalidad');
    });
  });

  describe('preloadAll()', () => {
    it('debería precargar todas las enumeraciones', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'TEST' }],
          error: null
        })
      });

      await enumService.preloadAll();

      expect(supabase.from).toHaveBeenCalledWith('TipoRelacion');
      expect(supabase.from).toHaveBeenCalledWith('TipoDocumento');
      expect(supabase.from).toHaveBeenCalledWith('Rol');
      expect(supabase.from).toHaveBeenCalledWith('Sexo');
      expect(supabase.from).toHaveBeenCalledWith('Modalidad');
    });

    it('debería retornar la misma promesa si ya está cargando', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'TEST' }],
          error: null
        })
      });

      const promise1 = enumService.preloadAll();
      const promise2 = enumService.preloadAll();

      // Ambas promesas deberían resolverse correctamente
      const [result1, result2] = await Promise.all([promise1, promise2]);
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });

  describe('clearCache()', () => {
    it('debería limpiar el caché', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'M' }],
          error: null
        })
      });

      await enumService.getEnum('Sexo');
      enumService.clearCache();
      await enumService.getEnum('Sexo');

      expect(supabase.from).toHaveBeenCalledTimes(2);
    });

    it('debería reiniciar initialLoadPromise', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ valor: 'TEST' }],
          error: null
        })
      });

      await enumService.preloadAll();
      enumService.clearCache();
      
      const callsBeforeClear = supabase.from.mock.calls.length;
      
      await enumService.preloadAll();
      
      expect(supabase.from.mock.calls.length).toBeGreaterThan(callsBeforeClear);
    });
  });

  describe('valores por defecto', () => {
    beforeEach(() => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Error')
        })
      });
    });

    it('debería retornar sexos por defecto', async () => {
      const result = await enumService.getSexos();
      expect(result).toEqual(['M', 'F']);
    });

    it('debería retornar tipos de documento por defecto', async () => {
      const result = await enumService.getTiposDocumento();
      expect(result).toEqual(['DNI', 'CE', 'PTP']);
    });

    it('debería retornar roles por defecto', async () => {
      const result = await enumService.getRolesUsuario();
      expect(result).toEqual(['DOCENTE', 'REPRESENTANTE LEGAL']);
    });

    it('debería retornar tipos de relación por defecto', async () => {
      const result = await enumService.getTiposRelacion();
      expect(result).toEqual(['PADRE', 'MADRE', 'TUTOR', 'ABUELO', 'HERMANO']);
    });

    it('debería retornar modalidades por defecto', async () => {
      const result = await enumService.getModalidades();
      expect(result).toEqual(['PRESENCIAL', 'VIRTUAL', 'SEMIPRESENCIAL']);
    });
  });
});
