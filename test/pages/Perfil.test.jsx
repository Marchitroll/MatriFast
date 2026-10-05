import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Perfil from '../../src/pages/Perfil';
import { useAuth } from '../../src/context/AuthContext';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../src/services', () => ({
  usuarioService: {
    actualizar: vi.fn()
  }
}));

vi.mock('../../src/hooks/useEnums', () => ({
  default: () => ({
    sexos: ['MASCULINO', 'FEMENINO'],
    tiposDocumento: ['DNI', 'CE'],
    loading: false
  })
}));

describe('Perfil Page Component', () => {
  const mockObtenerUsuarioActual = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el perfil de docente una vez cargados los datos', async () => {
    useAuth.mockReturnValue({
      session: { user: { email: 'docente@test.com' } },
      obtenerUsuarioActual: mockObtenerUsuarioActual.mockResolvedValue({
        id: 1,
        role: 'DOCENTE',
        nombres: 'Laura',
        aPaterno: 'Vargas'
      })
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Perfil />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /mi perfil/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombres:/i)).toHaveValue('Laura');
    expect(screen.getByLabelText(/apellido paterno:/i)).toHaveValue('Vargas');
  });
});
