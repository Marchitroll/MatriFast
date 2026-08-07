import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DocenteFields from '../../../src/components/forms/DocenteFields';

vi.mock('../../../src/hooks/useEnums', () => ({
  default: () => ({
    sexos: ['MASCULINO', 'FEMENINO'],
    tiposDocumento: ['DNI', 'CE'],
    loading: false
  })
}));

describe('DocenteFields Component', () => {
  it('debe renderizar los campos personales para docente con useEnums mockeado', () => {
    render(
      <DocenteFields
        formData={{ nombres: 'Ana', aPaterno: 'Torres' }}
        onFormDataChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/nombres:/i)).toHaveValue('Ana');
    expect(screen.getByLabelText(/apellido paterno:/i)).toHaveValue('Torres');
    expect(screen.getByLabelText(/sexo:/i)).toBeInTheDocument();
  });
});
