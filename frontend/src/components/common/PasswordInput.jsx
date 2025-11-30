import { useState } from 'react';
import PropTypes from 'prop-types';
import './PasswordInput.css';

/**
 * Componente reutilizable para campos de contraseña con toggle de visibilidad
 */
function PasswordInput({ label, id, value, onChange, required, disabled }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-field-container">
      <label htmlFor={id}>{label}</label>
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle-btn"
        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        disabled={disabled}
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

PasswordInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

PasswordInput.defaultProps = {
  required: false,
  disabled: false,
};

export default PasswordInput;
