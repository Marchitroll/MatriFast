import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RepresentanteLegalFields from '../../../src/components/forms/RepresentanteLegalFields';

vi.mock('../../../src/hooks/useEnums', () => ({
  default: () => ({
    sexos: ['MASCULINO', 'FEMENINO'],
    tiposDocumento: ['DNI', 'CE'],
    tiposRelacion: ['PADRE', 'MADRE', 'TUTOR'],
    loading: false
  })
}));

describe('RepresentanteLegalFields Component', () => {
  const defaultProps = {
    formData: {
      nombres: 'Carlos',
      aPaterno: 'Mendoza',
      tipoRelacion: 'PADRE',
      numeroCelular: '912345678',
      direccion: 'Av. Peru 123',
      viveConEstudiante: true
    },
    onFormDataChange: vi.fn()
  };

  it('debe renderizar todos los campos de representante legal incluyendo los específicos', () => {
    render(<RepresentanteLegalFields {...defaultProps} />);

    expect(screen.getByLabelText(/tipo de relación:/i)).toHaveValue('PADRE');
    expect(screen.getByLabelText(/número de celular:/i)).toHaveValue('912345678');
    expect(screen.getByLabelText(/dirección:/i)).toHaveValue('Av. Peru 123');
    expect(screen.getByLabelText(/¿vive con el estudiante\?/i)).toBeChecked();
  });

  it('debe alternar la checkbox de viveConEstudiante al hacer click', () => {
    render(<RepresentanteLegalFields {...defaultProps} />);

    const checkbox = screen.getByLabelText(/¿vive con el estudiante\?/i);
    fireEvent.click(checkbox);

    expect(defaultProps.onFormDataChange).toHaveBeenCalledWith('viveConEstudiante', false);
  });
});
