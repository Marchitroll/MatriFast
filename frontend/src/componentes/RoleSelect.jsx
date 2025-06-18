import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRolesUsuario, defaultValues as rolesDefault } from '../modelos/enums/RolesUsuario.js';

function RoleSelect({ id, value, onChange, required, disabled }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const rolesData = await getRolesUsuario();
        // Filtrar para excluir 'ESTUDIANTE' si existe
        const rolesVisibles = rolesData.filter(rol => rol !== 'ESTUDIANTE');
        setRoles(rolesVisibles);
      } catch (error) {
        console.warn('Error cargando roles, usando valores por defecto:', error);
        // Usar valores por defecto y filtrar ESTUDIANTE
        const rolesVisibles = rolesDefault.filter(rol => rol !== 'ESTUDIANTE');
        setRoles(rolesVisibles);
      } finally {
        setLoading(false);
      }
    };

    cargarRoles();
  }, []);

  return (
    <>
      <label htmlFor={id}>Rol:</label>
      <select id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled || loading}>

        <option value="">
          {loading ? "Cargando roles..." : "Seleccione un rol"}
        </option>
        {roles.map((rol) => (
          <option key={rol} value={rol}>{rol}</option>
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
