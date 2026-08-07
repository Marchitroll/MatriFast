import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../src/pages/Register';
import { useAuth } from '../../src/context/AuthContext';
import { useRegisterForm } from '../../src/hooks/useRegisterForm';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../src/hooks/useRegisterForm', () => ({
  useRegisterForm: vi.fn()
}));

vi.mock('../../src/hooks/useEnums', () => ({
  default: () => ({
    roles: ['DOCENTE', 'REPRESENTANTE LEGAL'],
    loading: false
  })
}));

describe('Register Page Component', () => {
  it('debe renderizar el formulario de registro adecuadamente', () => {
    useAuth.mockReturnValue({ session: null });
    useRegisterForm.mockReturnValue({
      email: '',
      setEmail: vi.fn(),
      password: '',
      setPassword: vi.fn(),
      confirmPassword: '',
      setConfirmPassword: vi.fn(),
      role: '',
      isLoading: false,
      error: '',
      handleRoleChange: vi.fn(),
      handleRoleSpecificDataChange: vi.fn(),
      handleSubmit: vi.fn(),
      roleSpecificData: {}
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /registrar nuevo usuario/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rol:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
  });
});
