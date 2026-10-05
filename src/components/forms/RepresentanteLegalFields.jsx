import PropTypes from 'prop-types';
import PersonaFields from './PersonaFields';
import { FormField, EnumSelect } from '../common';
import useEnums from '../../hooks/useEnums';

/**
 * Campos específicos para Representante Legal
 * Usa PersonaFields + campos adicionales (tipoRelacion, celular, direccion, viveConEstudiante)
 */
function RepresentanteLegalFields({ formData, onFormDataChange, isLoading, isUpdate }) {
  const { sexos, tiposDocumento, tiposRelacion, loading: enumsLoading } = useEnums();

  const handleChange = (field) => (e) => onFormDataChange(field, e.target.value);

  return (
    <>
      <PersonaFields
        formData={formData}
        onFormDataChange={onFormDataChange}
        isLoading={isLoading}
        isUpdate={isUpdate}
        sexos={sexos}
        tiposDocumento={tiposDocumento}
        enumsLoading={enumsLoading}
        idSuffix="RL"
      />
      
      <EnumSelect
        label="Tipo de Relación:"
        id="tipoRelacion"
        value={formData.tipoRelacion || ''}
        onChange={handleChange('tipoRelacion')}
        options={tiposRelacion}
        placeholder="Seleccione tipo de relación"
        required={!isUpdate}
        disabled={isLoading}
        loading={enumsLoading}
      />

      <FormField
        label="Número de Celular:"
        type="tel"
        id="numeroCelular"
        value={formData.numeroCelular || ''}
        onChange={handleChange('numeroCelular')}
        required={!isUpdate}
        disabled={isLoading}
        pattern="^9\d{8}$"
        title="Debe ser un número de celular peruano válido (9 dígitos)."
      />
      
      <FormField
        label="Dirección:"
        type="text"
        id="direccionRL"
        value={formData.direccion || ''}
        onChange={handleChange('direccion')}
        required={!isUpdate}
        disabled={isLoading}
      />

      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="viveConEstudianteRL"
          checked={!!formData.viveConEstudiante}
          onChange={() => onFormDataChange('viveConEstudiante', !formData.viveConEstudiante)}
          disabled={isLoading}
        />
        <label className="form-check-label" htmlFor="viveConEstudianteRL">
          ¿Vive con el estudiante?
        </label>
      </div>
    </>
  );
}

RepresentanteLegalFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isUpdate: PropTypes.bool,
};

RepresentanteLegalFields.defaultProps = {
  isLoading: false,
  isUpdate: false,
};

export default RepresentanteLegalFields;
