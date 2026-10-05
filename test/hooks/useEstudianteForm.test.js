import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useEstudianteForm from '../../src/hooks/useEstudianteForm';
import { usuarioService } from '../../src/services';

vi.mock('../../src/services', () => ({
  usuarioService: {
    registrar: vi.fn()
  }
}));

describe('useEstudianteForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe inicializar con estado inicial cargando: false, exito: false, error: null', () => {
    const { result } = renderHook(() => useEstudianteForm());

    expect(result.current.cargando).toBe(false);
    expect(result.current.exito).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe registrar un estudiante correctamente estructurando el servicio educativo', async () => {
    usuarioService.registrar.mockResolvedValue({ success: true, data: { id: 1 } });
    const { result } = renderHook(() => useEstudianteForm());

    const formData = {
      nombres: 'Pedro',
      aPaterno: 'Lopez',
      aMaterno: 'Rojas',
      fechaNacimiento: '2015-08-10',
      sexo: 'MASCULINO',
      tipoDocumento: 'DNI',
      numeroDocumento: '77665544',
      lugarNacimiento: 'Lima',
      direccion: 'Av. Brasil 456',
      tieneDispositivosElectronicos: true,
      tieneInternet: true,
      representanteLegalId: 10,
      nivel: 'PRIMARIA',
      grado: '3RO',
      seccion: 'A',
      turno: 'MAÑANA'
    };

    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    expect(usuarioService.registrar).toHaveBeenCalledWith(
      { role: 'ESTUDIANTE' },
      {
        nombres: 'Pedro',
        aPaterno: 'Lopez',
        aMaterno: 'Rojas',
        fechaNacimiento: '2015-08-10',
        sexo: 'MASCULINO',
        tipoDocumento: 'DNI',
        numeroDocumento: '77665544',
        lugarNacimiento: 'Lima',
        direccion: 'Av. Brasil 456',
        tieneDispositivosElectronicos: true,
        tieneInternet: true,
        representanteLegalId: 10,
        servicioEducativo: { nivel: 'PRIMARIA', grado: '3RO', seccion: 'A', turno: 'MAÑANA' }
      }
    );

    expect(result.current.exito).toBe(true);
    expect(result.current.cargando).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores si registrar falla', async () => {
    usuarioService.registrar.mockResolvedValue({ success: false, error: 'Documento ya registrado' });
    const { result } = renderHook(() => useEstudianteForm());

    await act(async () => {
      await result.current.handleSubmit({});
    });

    expect(result.current.exito).toBe(false);
    expect(result.current.cargando).toBe(false);
    expect(result.current.error).toBe('Documento ya registrado');
  });
});
