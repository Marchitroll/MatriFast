import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegisterForm } from '../../src/hooks/useRegisterForm';
import { useAuth } from '../../src/context/AuthContext';
import { usuarioService } from '../../src/services';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../src/services', () => ({
  usuarioService: {
    registrar: vi.fn()
  }
}));

describe('useRegisterForm', () => {
  const mockValidarEmail = vi.fn((email) => email.includes('@'));
  const mockValidarPassword = vi.fn((pass) => pass.length > 6);
  const mockRegistrarNuevoUsuario = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockValidarEmail.mockImplementation((email) => email.includes('@'));
    mockValidarPassword.mockImplementation((pass) => pass.length > 6);
    useAuth.mockReturnValue({
      validarEmail: mockValidarEmail,
      validarPassword: mockValidarPassword,
      registrarNuevoUsuario: mockRegistrarNuevoUsuario
    });
  });

  it('debe inicializar con los estados por defecto vacíos', () => {
    const { result } = renderHook(() => useRegisterForm());

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.confirmPassword).toBe('');
    expect(result.current.role).toBe('');
    expect(result.current.roleSpecificData).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('debe actualizar los datos específicos del rol al llamar handleRoleSpecificDataChange', () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.handleRoleSpecificDataChange('nombres', 'Juan');
    });

    expect(result.current.roleSpecificData).toEqual({ nombres: 'Juan' });
  });

  it('debe cambiar de rol y limpiar roleSpecificData al llamar handleRoleChange', () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.handleRoleSpecificDataChange('nombres', 'Juan');
      result.current.handleRoleChange({ target: { value: 'DOCENTE' } });
    });

    expect(result.current.role).toBe('DOCENTE');
    expect(result.current.roleSpecificData).toEqual({});
  });

  it('debe mostrar error si el email no es válido', async () => {
    mockValidarEmail.mockReturnValue(false);
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      const e = { preventDefault: vi.fn() };
      await result.current.handleSubmit(e);
    });

    expect(result.current.error).toBe('El formato del correo electrónico no es válido.');
  });

  it('debe mostrar error si las contraseñas no coinciden', async () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.setEmail('valido@mail.com');
      result.current.setPassword('password123');
      result.current.setConfirmPassword('diferente123');
      result.current.handleRoleChange({ target: { value: 'DOCENTE' } });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(result.current.error).toBe('Las contraseñas no coinciden.');
  });

  it('debe completar el registro exitosamente en BD y Auth', async () => {
    usuarioService.registrar.mockResolvedValue({ success: true });
    mockRegistrarNuevoUsuario.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.setEmail('valido@mail.com');
      result.current.setPassword('1234567');
      result.current.setConfirmPassword('1234567');
      result.current.handleRoleChange({ target: { value: 'DOCENTE' } });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(usuarioService.registrar).toHaveBeenCalledWith(
      { email: 'valido@mail.com', password: '1234567', role: 'DOCENTE' },
      {}
    );
    expect(mockRegistrarNuevoUsuario).toHaveBeenCalledWith('valido@mail.com', '1234567');
    expect(result.current.error).toBe('');
    expect(result.current.isLoading).toBe(false);
  });
});
