import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthContextProvider, useAuth } from '../../src/context';
import supabase from '../../src/config/ClienteSupabase';

vi.mock('../../src/config/ClienteSupabase', () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn()
  }
}));

describe('AuthContext', () => {
  const wrapper = ({ children }) => <AuthContextProvider>{children}</AuthContextProvider>;

  it('debe proveer métodos de validación de email y contraseña', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.validarEmail('test@mail.com')).toBe(true);
    expect(result.current.validarEmail('invalido')).toBe(false);

    expect(result.current.validarPassword('1234567')).toBe(true);
    expect(result.current.validarPassword('123')).toBe(false);
  });

  it('debe iniciar sesión llamando a supabase.auth.signInWithPassword', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { email: 'user@mail.com' } },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    const res = await result.current.iniciarSesion({ email: 'user@mail.com', password: 'password123' });

    expect(res.success).toBe(true);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'user@mail.com',
      password: 'password123'
    });
  });

  it('debe registrar usuario llamando a supabase.auth.signUp', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { email: 'nuevo@mail.com' } },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    const res = await result.current.registrarNuevoUsuario('nuevo@mail.com', 'pass12345');

    expect(res.success).toBe(true);
  });

  it('debe cerrar sesión llamando a supabase.auth.signOut', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });
    const res = await result.current.cerrarSesion();

    expect(res.success).toBe(true);
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
