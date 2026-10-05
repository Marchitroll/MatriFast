import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleSelect from '../../../src/components/forms/RoleSelect';

vi.mock('../../../src/hooks/useEnums', () => ({
  default: () => ({
    roles: ['DOCENTE', 'REPRESENTANTE LEGAL', 'ESTUDIANTE'],
    loading: false
  })
}));

describe('RoleSelect Component', () => {
  it('debe renderizar los roles filtrando ESTUDIANTE', () => {
    render(<RoleSelect id="role-select" value="" onChange={vi.fn()} />);

    expect(screen.getByRole('option', { name: 'Seleccione un rol' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'DOCENTE' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'REPRESENTANTE LEGAL' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'ESTUDIANTE' })).not.toBeInTheDocument();
  });

  it('debe llamar onChange al seleccionar una opción', () => {
    const handleChange = vi.fn();
    render(<RoleSelect id="role-select" value="" onChange={handleChange} />);

    const select = screen.getByLabelText(/rol:/i);
    fireEvent.change(select, { target: { value: 'DOCENTE' } });

    expect(handleChange).toHaveBeenCalled();
  });
});
