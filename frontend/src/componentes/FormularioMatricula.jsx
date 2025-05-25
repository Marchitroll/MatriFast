import PropTypes from 'prop-types';
import AuthFormField from './AuthFormField';
import TIPOINGRESO from '../modelos/enums/TiposIngreso';
import MODALIDAD from '../modelos/enums/Modalidad';
import EXONERACION from '../modelos/enums/TiposDiscapacidad'; // O crea otro enum específico si no aplica este
import SEXOS from '../modelos/enums/Sexos';
import listaDeTiposDocumentoPermitidos from '../modelos/enums/TiposDocumento';
import TIPOS_LENGUAS from '../modelos/enums/TiposLenguas';

function MatriculaFormulario({ formData, onFormDataChange, isLoading }) {
  return (
    <div className="formulario-campos">

      <h3>Datos del Estudiante</h3>

      <AuthFormField
        label="Nombre(s)"
        id="nombres"
        type="text"
        value={formData.nombres || ''}
        onChange={(e) => onFormDataChange('nombres', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="Apellido Paterno"
        id="aPaterno"
        type="text"
        value={formData.aPaterno || ''}
        onChange={(e) => onFormDataChange('aPaterno', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="Apellido Materno"
        id="aMaterno"
        type="text"
        value={formData.aMaterno || ''}
        onChange={(e) => onFormDataChange('aMaterno', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="Fecha de Nacimiento"
        id="fechaNacimiento"
        type="date"
        value={formData.fechaNacimiento || ''}
        onChange={(e) => onFormDataChange('fechaNacimiento', e.target.value)}
        disabled={isLoading}
      />
      <div></div>

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

      <div></div>
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
      <div></div>
      <AuthFormField
        label="Número de Documento"
        id="numeroDocumento"
        type="text"
        value={formData.numeroDocumento || ''}
        onChange={(e) => onFormDataChange('numeroDocumento', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="Lugar de Nacimiento"
        id="lugarNacimiento"
        type="text"
        value={formData.lugarNacimiento || ''}
        onChange={(e) => onFormDataChange('lugarNacimiento', e.target.value)}
        disabled={isLoading}
      />

      <div></div>
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
      <div></div>
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
      <div></div>
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="dispositivosElectronicos"
          name="dispositivosElectronicos"
          checked={!!formData.dispositivosElectronicos}
          onChange={(e) => onFormDataChange('dispositivosElectronicos', e.target.checked)}
          disabled={isLoading}
        />
        <label className="form-check-label" htmlFor="dispositivosElectronicos">
          ¿Tiene Dispositivos Electrónico?
        </label>
      </div>
      <div></div>
            <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="tieneInternet"
          name="tieneInternet"
          checked={!!formData.tieneInternet}
          onChange={(e) => onFormDataChange('tieneInternet', e.target.checked)}
          disabled={isLoading}
        />
        <label className="form-check-label" htmlFor="tieneInternet">
          ¿Tiene Internet?
        </label>
      </div>
      <div></div>
      <AuthFormField
        label="DNI del Representante (si lo registra un docente)"
        id="dniRepresentante"
        type="text"
        value={formData.dniRepresentante || ''}
        onChange={(e) => onFormDataChange('dniRepresentante', e.target.value)}
        disabled={isLoading}
      />

      <h3>Servicio Educativo Solicitado</h3>

      {/* Tipo de Ingreso */}
      <div className="form-group">
        <label htmlFor="ingreso">Ingreso:</label>
        <select
          id="ingreso"
          name="ingreso"
          value={formData.ingreso || ''}
          onChange={(e) => onFormDataChange('ingreso', e.target.value)}
          disabled={isLoading}
        >
          <option value="">Seleccione Tipo Ingreso</option>
          {TIPOINGRESO.map((s) => (
            <option key={`Ingreso-${s}`} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Modalidad */}
      <div className="form-group">
        <label htmlFor="modalidad">Modalidad:</label>
        <select
          id="modalidad"
          name="modalidad"
          value={formData.modalidad || ''}
          onChange={(e) => onFormDataChange('modalidad', e.target.value)}
          disabled={isLoading}
        >
          <option value="">Seleccione Modalidad</option>
          {MODALIDAD.map((s) => (
            <option key={`Modalidad-${s}`} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Nivel */}
      <AuthFormField
        label="Nivel"
        id="nivel"
        type="text"
        value={formData.nivel || ''}
        onChange={(e) => onFormDataChange('nivel', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      {/* Grado/Edad */}
      <AuthFormField
        label="Grado o Edad"
        id="gradoEdad"
        type="text"
        value={formData['gradoEdad'] || ''}
        onChange={(e) => onFormDataChange('gradoEdad', e.target.value)}
        disabled={isLoading}
      />

      {/* Checkbox: ¿Vive con el Exoneracion Religiosa? */}
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="exoneracionReligiosa"
          name="exoneracionReligiosa"
          checked={!!formData.exoneracionReligiosa}
          onChange={(e) => onFormDataChange('exoneracionReligiosa', e.target.checked)}
          disabled={isLoading}
        />
        <label className="form-check-label" htmlFor="exoneracionReligiosa">
          ¿Solicitud de Exoneración de Educación Religiosa?
        </label>
      </div>

      {/* Exoneración fisica */}
      <div className="form-group">
        <label htmlFor="exoneracion">Solicitud de Exoneración de Educación Fisica:</label>
        <select
          id="exoneracion"
          name="exoneracion"
          value={formData.exoneracion || ''}
          onChange={(e) => onFormDataChange('exoneracion', e.target.value)}
          disabled={isLoading}
        >
          <option value="">Seleccione opción</option>
          {EXONERACION.map((s) => (
            <option key={`exoneracion-${s}`} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}

MatriculaFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

MatriculaFormulario.defaultProps = {
  isLoading: false
};

export default MatriculaFormulario;