import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Formulario from '../../src/pages/Formulario';
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

vi.mock('../../src/hooks/useEnums', () => ({
  default: () => ({
    sexos: ['MASCULINO', 'FEMENINO'],
    tiposDocumento: ['DNI', 'CE'],
    modalidades: ['PRESENCIAL'],
    loading: false
  })
}));

describe('Formulario Page Component', () => {
  const mockCerrarSesion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe redirigir a /login si el usuario no tiene sesión iniciada', () => {
    useAuth.mockReturnValue({ session: null, cerrarSesion: mockCerrarSesion });

    render(
      <MemoryRouter>
        <Formulario />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('debe renderizar el formulario de matrícula si existe sesión activa', () => {
    useAuth.mockReturnValue({
      session: { user: { email: 'user@test.com' } },
      cerrarSesion: mockCerrarSesion
    });

    render(
      <MemoryRouter>
        <Formulario />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /formulario de matrícula/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar matrícula/i })).toBeInTheDocument();
  });

  it('debe procesar el cierre de sesión y redirigir a /login', async () => {
    mockCerrarSesion.mockResolvedValue({ success: true });
    useAuth.mockReturnValue({
      session: { user: { email: 'user@test.com' } },
      cerrarSesion: mockCerrarSesion
    });

    render(
      <MemoryRouter>
        <Formulario />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));
    });

    expect(mockCerrarSesion).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
