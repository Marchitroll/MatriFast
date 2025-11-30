import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock de EnumService
vi.mock('../../src/services/EnumService', () => ({
  default: {
    getSexos: vi.fn(),
    getTiposDocumento: vi.fn(),
    getTiposRelacion: vi.fn(),
    getRolesUsuario: vi.fn(),
    getModalidades: vi.fn()
  }
}));

import useEnums from '../../src/hooks/useEnums';
import enumService from '../../src/services/EnumService';

describe('useEnums', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    enumService.getSexos.mockResolvedValue(['M', 'F']);
    enumService.getTiposDocumento.mockResolvedValue(['DNI', 'CE', 'PTP']);
    enumService.getTiposRelacion.mockResolvedValue(['PADRE', 'MADRE', 'TUTOR']);
    enumService.getRolesUsuario.mockResolvedValue(['DOCENTE', 'REPRESENTANTE LEGAL']);
    enumService.getModalidades.mockResolvedValue(['PRESENCIAL', 'VIRTUAL']);
  });

  describe('carga inicial', () => {
    it('debería iniciar con loading true', () => {
      const { result } = renderHook(() => useEnums());
      expect(result.current.loading).toBe(true);
    });

    it('debería cargar todos los enums', async () => {
      const { result } = renderHook(() => useEnums());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.sexos).toEqual(['M', 'F']);
      expect(result.current.tiposDocumento).toEqual(['DNI', 'CE', 'PTP']);
      expect(result.current.tiposRelacion).toEqual(['PADRE', 'MADRE', 'TUTOR']);
      expect(result.current.roles).toEqual(['DOCENTE', 'REPRESENTANTE LEGAL']);
      expect(result.current.modalidades).toEqual(['PRESENCIAL', 'VIRTUAL']);
    });

    it('debería llamar todos los métodos del servicio', async () => {
      const { result } = renderHook(() => useEnums());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(enumService.getSexos).toHaveBeenCalled();
      expect(enumService.getTiposDocumento).toHaveBeenCalled();
      expect(enumService.getTiposRelacion).toHaveBeenCalled();
      expect(enumService.getRolesUsuario).toHaveBeenCalled();
      expect(enumService.getModalidades).toHaveBeenCalled();
    });
  });

  describe('manejo de errores', () => {
    it('debería manejar error y usar arrays vacíos', async () => {
      enumService.getSexos.mockRejectedValue(new Error('Error'));
      enumService.getTiposDocumento.mockRejectedValue(new Error('Error'));
      enumService.getTiposRelacion.mockRejectedValue(new Error('Error'));
      enumService.getRolesUsuario.mockRejectedValue(new Error('Error'));
      enumService.getModalidades.mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useEnums());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Debería tener arrays vacíos o valores por defecto
      expect(Array.isArray(result.current.sexos)).toBe(true);
    });
  });

  describe('estructura del resultado', () => {
    it('debería retornar objeto con todas las propiedades', async () => {
      const { result } = renderHook(() => useEnums());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty('sexos');
      expect(result.current).toHaveProperty('tiposDocumento');
      expect(result.current).toHaveProperty('tiposRelacion');
      expect(result.current).toHaveProperty('roles');
      expect(result.current).toHaveProperty('modalidades');
      expect(result.current).toHaveProperty('loading');
    });
  });
});
