import PropTypes from 'prop-types';

/**
 * Componente genérico para selects de enumeraciones
 * Elimina duplicación de código en DocenteFields, RepresentanteLegalFields, etc.
 */
function EnumSelect({ 
  label, 
  id, 
  value, 
  onChange, 
  options, 
  placeholder, 
  required, 
  disabled, 
  loading 
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled || loading}
      >
        <option value="">{loading ? 'Cargando...' : placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

EnumSelect.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

EnumSelect.defaultProps = {
  placeholder: 'Seleccione una opción',
  required: false,
  disabled: false,
  loading: false,
};

export default EnumSelect;
