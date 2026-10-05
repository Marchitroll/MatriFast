import PropTypes from 'prop-types';
import { FormField, EnumSelect } from '../common';

/**
 * Campos reutilizables de persona (nombres, apellidos, fecha nacimiento, sexo, documento)
 * Elimina duplicación entre DocenteFields, RepresentanteLegalFields, FormularioMatricula
 */
function PersonaFields({ 
  formData, 
  onFormDataChange, 
  isLoading, 
  isUpdate, 
  sexos, 
  tiposDocumento, 
  enumsLoading,
  idSuffix = '' 
}) {
  const handleChange = (field) => (e) => onFormDataChange(field, e.target.value);

  return (
    <>
      <FormField
        label="Nombres:"
        type="text"
        id={`nombres${idSuffix}`}
        value={formData.nombres || ''}
        onChange={handleChange('nombres')}
        required={!isUpdate}
        disabled={isLoading}
      />
      <FormField
        label="Apellido Paterno:"
        type="text"
        id={`aPaterno${idSuffix}`}
        value={formData.aPaterno || ''}
        onChange={handleChange('aPaterno')}
        required={!isUpdate}
        disabled={isLoading}
      />
      <FormField
        label="Apellido Materno:"
        type="text"
        id={`aMaterno${idSuffix}`}
        value={formData.aMaterno || ''}
        onChange={handleChange('aMaterno')}
        disabled={isLoading}
      />
      <FormField
        label="Fecha de Nacimiento:"
        type="date"
        id={`fechaNacimiento${idSuffix}`}
        value={formData.fechaNacimiento || ''}
        onChange={handleChange('fechaNacimiento')}
        required={!isUpdate}
        disabled={isLoading}
      />
      <EnumSelect
        label="Sexo:"
        id={`sexo${idSuffix}`}
        value={formData.sexo || ''}
        onChange={handleChange('sexo')}
        options={sexos}
        placeholder="Seleccione sexo"
        required={!isUpdate}
        disabled={isLoading}
        loading={enumsLoading}
      />
      <EnumSelect
        label="Tipo de Documento:"
        id={`tipoDocumento${idSuffix}`}
        value={formData.tipoDocumento || ''}
        onChange={handleChange('tipoDocumento')}
        options={tiposDocumento}
        placeholder="Seleccione tipo de documento"
        required={!isUpdate}
        disabled={isLoading}
        loading={enumsLoading}
      />
      <FormField
        label="Número de Documento:"
        type="text"
        id={`numeroDocumento${idSuffix}`}
        value={formData.numeroDocumento || ''}
        onChange={handleChange('numeroDocumento')}
        required={!isUpdate}
        disabled={isLoading}
      />
    </>
  );
}

PersonaFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isUpdate: PropTypes.bool,
  sexos: PropTypes.arrayOf(PropTypes.string).isRequired,
  tiposDocumento: PropTypes.arrayOf(PropTypes.string).isRequired,
  enumsLoading: PropTypes.bool,
  idSuffix: PropTypes.string,
};

PersonaFields.defaultProps = {
  isLoading: false,
  isUpdate: false,
  enumsLoading: false,
  idSuffix: '',
};

export default PersonaFields;
