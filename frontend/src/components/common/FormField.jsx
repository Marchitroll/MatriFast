import PropTypes from 'prop-types';

/**
 * Componente genérico para campos de formulario
 * Reemplaza AuthFormField con más flexibilidad
 */
function FormField({ label, type, id, value, onChange, required, disabled, ...props }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
      />
    </>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

FormField.defaultProps = {
  required: false,
  disabled: false,
};

export default FormField;
