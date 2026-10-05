import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMatriculaForm from '../../src/hooks/useMatriculaForm';

describe('useMatriculaForm', () => {
  it('debe actualizar los campos del formulario con handleChange', () => {
    const { result } = renderHook(() => useMatriculaForm());

    act(() => {
      result.current.handleChange('nombre', 'Estudiante 1');
      result.current.handleChange('grado', '1ro');
    });

    expect(result.current.formData).toEqual({
      nombre: 'Estudiante 1',
      grado: '1ro'
    });
  });

  it('debe procesar el submit reseteando formData y restableciendo isLoading', async () => {
    const { result } = renderHook(() => useMatriculaForm());

    act(() => {
      result.current.handleChange('nombre', 'Estudiante 1');
    });

    await act(async () => {
      const e = { preventDefault: () => {} };
      await result.current.handleSubmit(e);
    });

    expect(result.current.formData).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
