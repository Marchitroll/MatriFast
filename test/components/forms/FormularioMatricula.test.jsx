import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormularioMatricula from '../../../src/components/forms/FormularioMatricula';

vi.mock('../../../src/hooks/useEnums', () => ({
  default: () => ({
    sexos: ['MASCULINO', 'FEMENINO'],
    tiposDocumento: ['DNI', 'CE'],
    modalidades: ['EBR', 'EBA'],
    loading: false
  })
}));

describe('FormularioMatricula Component', () => {
  const defaultProps = {
    formData: {
      nombres: 'Gabriel',
      aPaterno: 'Salas',
      direccion: 'Jr. Union 100',
      dispositivosElectronicos: true,
      modalidad: 'EBR',
      nivel: 'SECUNDARIA'
    },
    onFormDataChange: vi.fn(),
    isLoading: false
  };

  it('debe renderizar la sección de estudiante y servicio educativo', () => {
    render(<FormularioMatricula {...defaultProps} />);

    expect(screen.getByRole('heading', { name: /datos del estudiante/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /servicio educativo solicitado/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/lugar de nacimiento:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/¿tiene dispositivos electrónicos\?/i)).toBeChecked();
    expect(screen.getByLabelText(/modalidad:/i)).toHaveValue('EBR');
    expect(screen.getByLabelText(/nivel:/i)).toHaveValue('SECUNDARIA');
  });

  it('debe disparar onFormDataChange al modificar el checkbox de exoneración', () => {
    render(<FormularioMatricula {...defaultProps} />);

    const checkboxExoneracion = screen.getByLabelText(/¿solicitud de exoneración de educación religiosa\?/i);
    fireEvent.click(checkboxExoneracion);

    expect(defaultProps.onFormDataChange).toHaveBeenCalledWith('exoneracionReligiosa', true);
  });
});
