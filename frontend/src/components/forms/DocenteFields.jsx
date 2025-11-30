import PropTypes from 'prop-types';
import PersonaFields from './PersonaFields';
import useEnums from '../../hooks/useEnums';

/**
 * Campos específicos para Docente
 * Usa PersonaFields internamente para evitar duplicación
 */
function DocenteFields({ formData, onFormDataChange, isLoading, isUpdate }) {
  const { sexos, tiposDocumento, loading: enumsLoading } = useEnums();

  return (
    <PersonaFields
      formData={formData}
      onFormDataChange={onFormDataChange}
      isLoading={isLoading}
      isUpdate={isUpdate}
      sexos={sexos}
      tiposDocumento={tiposDocumento}
      enumsLoading={enumsLoading}
    />
  );
}

DocenteFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isUpdate: PropTypes.bool,
};

DocenteFields.defaultProps = {
  isLoading: false,
  isUpdate: false,
};

export default DocenteFields;
