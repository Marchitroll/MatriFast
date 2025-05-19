import PropTypes from 'prop-types';
import AuthFormField from './AuthFormField';
import listaDeTiposDocumentoPermitidos from '../modelos/enums/TiposDocumento';
import SEXOS from '../modelos/enums/Sexos';
import listaDeTiposRelacionPermitidos from '../modelos/enums/TiposRelacion';
import TIPOS_LENGUAS from '../modelos/enums/TiposLenguas';

function RepresentanteLegalFields({ formData, onFormDataChange, isLoading }) {
  const handleCheckboxChange = (field) => {
    onFormDataChange(field, !formData[field]);
  };

  return (
    <>
      {/* Datos de Persona */}
      <AuthFormField
        label="Nombres:"
        type="text"
        id="nombresRL"
        value={formData.nombres || ''}
        onChange={(e) => onFormDataChange('nombres', e.target.value)}
        required
        disabled={isLoading}
      />
      <AuthFormField
        label="Apellido Paterno:"
        type="text"
        id="aPaternoRL"
        value={formData.aPaterno || ''}
        onChange={(e) => onFormDataChange('aPaterno', e.target.value)}
        required
        disabled={isLoading}
      />
      <AuthFormField
        label="Apellido Materno:"
        type="text"
        id="aMaternoRL"
        value={formData.aMaterno || ''}
        onChange={(e) => onFormDataChange('aMaterno', e.target.value)}
        disabled={isLoading}
      />
      <AuthFormField
        label="Fecha de Nacimiento:"
        type="date"
        id="fechaNacimientoRL"
        value={formData.fechaNacimiento || ''}
        onChange={(e) => onFormDataChange('fechaNacimiento', e.target.value)}
        required
        disabled={isLoading}
      />
      <div className="form-group">
        <label htmlFor="sexoRL">Sexo:</label>
        <select
          id="sexoRL"
          name="sexo"
          value={formData.sexo || ''}
          onChange={(e) => onFormDataChange('sexo', e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="">Seleccione sexo</option>
          {SEXOS.map((s) => (
            <option key={`sexo-rl-${s}`} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Documento */}
      <div className="form-group">
        <label htmlFor="tipoDocumentoRL">Tipo de Documento:</label>
        <select
          id="tipoDocumentoRL"
          name="tipoDocumento"
          value={formData.tipoDocumento || ''}
          onChange={(e) => onFormDataChange('tipoDocumento', e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="">Seleccione tipo de documento</option>
          {listaDeTiposDocumentoPermitidos.map((tipo) => (
            <option key={`doc-rl-${tipo}`} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
      <AuthFormField
        label="Número de Documento:"
        type="text"
        id="numeroDocumentoRL"
        name="numeroDocumento"
        value={formData.numeroDocumento || ''}
        onChange={(e) => onFormDataChange('numeroDocumento', e.target.value)}
        required
        disabled={isLoading}
      />

      {/* Datos Específicos de RepresentanteLegal */}
      <div className="form-group">
        <label htmlFor="tipoRelacion">Tipo de Relación:</label>
        <select
          id="tipoRelacion"
          name="tipoRelacion"
          value={formData.tipoRelacion || ''}
          onChange={(e) => onFormDataChange('tipoRelacion', e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="">Seleccione tipo de relación</option>
          {listaDeTiposRelacionPermitidos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <AuthFormField
        label="Número de Celular:"
        type="tel"
        id="numeroCelular"
        name="numeroCelular"
        value={formData.numeroCelular || ''}
        onChange={(e) => onFormDataChange('numeroCelular', e.target.value)}
        required
        disabled={isLoading}
        pattern="^9\d{8}$"
        title="Debe ser un número de celular peruano válido (9 dígitos)."
      />
      
      {/* Campos para Dirección (Ubicacion) */}
      <AuthFormField
        label="Código UBIGEO (Opcional):"
        type="text"
        id="codUbigeoRL"
        name="codUbigeo"
        value={formData.codUbigeo || ''}
        onChange={(e) => onFormDataChange('codUbigeo', e.target.value)}
        disabled={isLoading}
        pattern="^\d{6}$"
        title="Debe ser un código UBIGEO de 6 dígitos (opcional)."
      />
      <AuthFormField
        label="Departamento (Dirección):"
        type="text"
        id="departamentoDireccionRL"
        name="departamento" // Coincide con Ubicacion.js
        value={formData.departamento || ''}
        onChange={(e) => onFormDataChange('departamento', e.target.value)}
        required // Obligatorio según Ubicacion.js
        disabled={isLoading}
      />
      <AuthFormField
        label="Provincia (Dirección):"
        type="text"
        id="provinciaDireccionRL"
        name="provincia" // Coincide con Ubicacion.js
        value={formData.provincia || ''}
        onChange={(e) => onFormDataChange('provincia', e.target.value)}
        required // Obligatorio según Ubicacion.js
        disabled={isLoading}
      />
      <AuthFormField
        label="Distrito (Dirección):"
        type="text"
        id="distritoDireccionRL"
        name="distrito" // Coincide con Ubicacion.js
        value={formData.distrito || ''}
        onChange={(e) => onFormDataChange('distrito', e.target.value)}
        required // Obligatorio según Ubicacion.js
        disabled={isLoading}
      />
      <AuthFormField
        label="Dirección Específica:"
        type="text"
        id="direccionRL"
        name="direccion" // Coincide con Ubicacion.js
        value={formData.direccion || ''}
        onChange={(e) => onFormDataChange('direccion', e.target.value)}
        required // Obligatorio según Ubicacion.js
        disabled={isLoading}
      />

      {/* Campos para Perfil Lingüístico (Lenguas) - Simplificado */}
      <div className="form-group">
        <label htmlFor="lenguaPrincipalRL">Lengua Principal:</label>
        <select
          id="lenguaPrincipalRL"
          name="lenguaPrincipal"
          value={formData.lenguaPrincipal || ''}
          onChange={(e) => onFormDataChange('lenguaPrincipal', e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="">Seleccione lengua principal</option>
          {Object.entries(TIPOS_LENGUAS).map(([key, value]) => (
            <option key={`lp-rl-${key}`} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="lenguaSecundariaRL">Lengua Secundaria (Opcional):</label>
        <select
          id="lenguaSecundariaRL"
          name="lenguaSecundaria"
          value={formData.lenguaSecundaria || ''}
          onChange={(e) => onFormDataChange('lenguaSecundaria', e.target.value)}
          disabled={isLoading}
        >
          <option value="">Seleccione lengua secundaria (si aplica)</option>
          {Object.entries(TIPOS_LENGUAS).map(([key, value]) => (
            <option key={`ls-rl-${key}`} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      
      <AuthFormField
        label="Etnia (Opcional):"
        type="text"
        id="etniaRL"
        name="etnia"
        value={formData.etnia || ''}
        onChange={(e) => onFormDataChange('etnia', e.target.value)}
        disabled={isLoading}
      />

      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="viveConEstudianteRL"
          name="viveConEstudiante"
          checked={!!formData.viveConEstudiante} // Asegurar que sea booleano
          onChange={() => handleCheckboxChange('viveConEstudiante')}
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
};

RepresentanteLegalFields.defaultProps = {
  isLoading: false,
};

export default RepresentanteLegalFields;
