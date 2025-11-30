import PropTypes from 'prop-types';
import PersonaFields from './PersonaFields';
import { FormField, EnumSelect } from '../common';
import useEnums from '../../hooks/useEnums';

/**
 * Formulario de matrícula - campos de estudiante y servicio educativo
 * Refactorizado para usar componentes reutilizables
 */
function FormularioMatricula({ formData, onFormDataChange, isLoading }) {
  const { sexos, tiposDocumento, modalidades, loading: enumsLoading } = useEnums();
  const handleChange = (field) => (e) => onFormDataChange(field, e.target.value);
  const handleCheckbox = (field) => (e) => onFormDataChange(field, e.target.checked);

  return (
    <div className="formulario-campos">
      <h3>Datos del Estudiante</h3>

      <PersonaFields
        formData={formData}
        onFormDataChange={onFormDataChange}
        isLoading={isLoading}
        sexos={sexos}
        tiposDocumento={tiposDocumento}
        enumsLoading={enumsLoading}
        idSuffix="Est"
      />

      <FormField
        label="Lugar de Nacimiento:"
        type="text"
        id="lugarNacimiento"
        value={formData.lugarNacimiento || ''}
        onChange={handleChange('lugarNacimiento')}
        disabled={isLoading}
      />

      <FormField
        label="Dirección:"
        type="text"
        id="direccion"
        value={formData.direccion || ''}
        onChange={handleChange('direccion')}
        required
        disabled={isLoading}
      />

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="dispositivosElectronicos"
          checked={!!formData.dispositivosElectronicos}
          onChange={handleCheckbox('dispositivosElectronicos')}
          disabled={isLoading}
        />
        <label htmlFor="dispositivosElectronicos">¿Tiene Dispositivos Electrónicos?</label>
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="tieneInternet"
          checked={!!formData.tieneInternet}
          onChange={handleCheckbox('tieneInternet')}
          disabled={isLoading}
        />
        <label htmlFor="tieneInternet">¿Tiene Internet?</label>
      </div>

      <FormField
        label="DNI del Representante (si lo registra un docente):"
        type="text"
        id="dniRepresentante"
        value={formData.dniRepresentante || ''}
        onChange={handleChange('dniRepresentante')}
        disabled={isLoading}
      />

      <h3>Servicio Educativo Solicitado</h3>

      <EnumSelect
        label="Modalidad:"
        id="modalidad"
        value={formData.modalidad || ''}
        onChange={handleChange('modalidad')}
        options={modalidades}
        placeholder="Seleccione Modalidad"
        disabled={isLoading}
        loading={enumsLoading}
      />

      <FormField
        label="Nivel:"
        type="text"
        id="nivel"
        value={formData.nivel || ''}
        onChange={handleChange('nivel')}
        disabled={isLoading}
      />

      <FormField
        label="Grado o Edad:"
        type="text"
        id="gradoEdad"
        value={formData.gradoEdad || ''}
        onChange={handleChange('gradoEdad')}
        disabled={isLoading}
      />

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="exoneracionReligiosa"
          checked={!!formData.exoneracionReligiosa}
          onChange={handleCheckbox('exoneracionReligiosa')}
          disabled={isLoading}
        />
        <label htmlFor="exoneracionReligiosa">¿Solicitud de Exoneración de Educación Religiosa?</label>
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="exoneracionFisica"
          checked={!!formData.exoneracionFisica}
          onChange={handleCheckbox('exoneracionFisica')}
          disabled={isLoading}
        />
        <label htmlFor="exoneracionFisica">¿Solicitud de Exoneración de Educación Física?</label>
      </div>
    </div>
  );
}

FormularioMatricula.propTypes = {
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

FormularioMatricula.defaultProps = {
  isLoading: false
};

export default FormularioMatricula;
