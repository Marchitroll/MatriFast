import React from 'react';
import PropTypes from 'prop-types';
import listaDeRolesPermitidos from '../modelos/enums/RolesUsuario';

function RoleSelect({ id, value, onChange, required, disabled }) {
  return (
    <>
      <label htmlFor={id}>Rol:</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value="">Seleccione un rol</option>
        {listaDeRolesPermitidos.map((rol) => (
          <option key={rol} value={rol}>
            {rol}
          </option>
        ))}
      </select>
    </>
  );
}

RoleSelect.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

RoleSelect.defaultProps = {
  required: false,
  disabled: false,
};

export default RoleSelect;
