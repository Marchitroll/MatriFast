import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';
import { useAuth } from '../../src/context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('Login Page Component', () => {
  const mockIniciarSesion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar los campos de inicio de sesión', () => {
    useAuth.mockReturnValue({ session: null, iniciarSesion: mockIniciarSesion });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('debe redirigir a / si el usuario ya tiene sesión activa', () => {
    useAuth.mockReturnValue({ session: { user: { email: 'test@mail.com' } }, iniciarSesion: mockIniciarSesion });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('debe procesar inicio de sesión exitoso y navegar a /formulario', async () => {
    mockIniciarSesion.mockResolvedValue({ success: true });
    useAuth.mockReturnValue({ session: null, iniciarSesion: mockIniciarSesion });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico:/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña:/i), { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    });

    expect(mockIniciarSesion).toHaveBeenCalledWith({ email: 'user@test.com', password: 'password123' });
    expect(mockNavigate).toHaveBeenCalledWith('/formulario');
  });

  it('debe mostrar mensaje de error cuando falla el inicio de sesión', async () => {
    mockIniciarSesion.mockResolvedValue({ success: false, error: 'Invalid login credentials' });
    useAuth.mockReturnValue({ session: null, iniciarSesion: mockIniciarSesion });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico:/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña:/i), { target: { value: 'error' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    });

    expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
  });
});
