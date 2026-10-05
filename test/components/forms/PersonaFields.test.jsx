import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonaFields from '../../../src/components/forms/PersonaFields';

describe('PersonaFields Component', () => {
  const defaultProps = {
    formData: {
      nombres: 'Juan',
      aPaterno: 'Perez',
      aMaterno: 'Gomez',
      fechaNacimiento: '1990-01-01',
      sexo: 'MASCULINO',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678'
    },
    onFormDataChange: vi.fn(),
    sexos: ['MASCULINO', 'FEMENINO'],
    tiposDocumento: ['DNI', 'CE', 'PTP'],
    isLoading: false,
    enumsLoading: false
  };

  it('debe renderizar todos los campos correctamente con los valores provistos', () => {
    render(<PersonaFields {...defaultProps} />);

    expect(screen.getByLabelText(/nombres:/i)).toHaveValue('Juan');
    expect(screen.getByLabelText(/apellido paterno:/i)).toHaveValue('Perez');
    expect(screen.getByLabelText(/apellido materno:/i)).toHaveValue('Gomez');
    expect(screen.getByLabelText(/fecha de nacimiento:/i)).toHaveValue('1990-01-01');
    expect(screen.getByLabelText(/sexo:/i)).toHaveValue('MASCULINO');
    expect(screen.getByLabelText(/tipo de documento:/i)).toHaveValue('DNI');
    expect(screen.getByLabelText(/número de documento:/i)).toHaveValue('12345678');
  });

  it('debe llamar a onFormDataChange cuando el usuario modifica un input', () => {
    render(<PersonaFields {...defaultProps} />);

    const inputNombres = screen.getByLabelText(/nombres:/i);
    fireEvent.change(inputNombres, { target: { value: 'Carlos' } });

    expect(defaultProps.onFormDataChange).toHaveBeenCalledWith('nombres', 'Carlos');
  });

  it('debe deshabilitar todos los controles si isLoading es true', () => {
    render(<PersonaFields {...defaultProps} isLoading={true} />);

    expect(screen.getByLabelText(/nombres:/i)).toBeDisabled();
    expect(screen.getByLabelText(/apellido paterno:/i)).toBeDisabled();
    expect(screen.getByLabelText(/sexo:/i)).toBeDisabled();
    expect(screen.getByLabelText(/tipo de documento:/i)).toBeDisabled();
  });
});
