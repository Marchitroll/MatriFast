import PropTypes from 'prop-types';
import useEnums from '../../hooks/useEnums';

/**
 * Componente para seleccionar rol de usuario
 * Filtra automáticamente ESTUDIANTE de las opciones
 */
function RoleSelect({ id, value, onChange, required, disabled }) {
  const { roles, loading } = useEnums();
  
  // Filtrar ESTUDIANTE de las opciones visibles
  const rolesVisibles = roles.filter(rol => rol !== 'ESTUDIANTE');

  return (
    <>
      <label htmlFor={id}>Rol:</label>
      <select 
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled || loading}
      >
        <option value="">
          {loading ? 'Cargando roles...' : 'Seleccione un rol'}
        </option>
        {rolesVisibles.map((rol) => (
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
