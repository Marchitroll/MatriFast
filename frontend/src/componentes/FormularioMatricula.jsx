import PropTypes from 'prop-types';
import AuthFormField from './AuthFormField';
import TIPOINGRESO from '../modelos/enums/TiposIngreso';
import MODALIDAD from '../modelos/enums/Modalidad';
import EXONERACION from '../modelos/enums/TiposDiscapacidad'; // O crea otro enum específico si no aplica este

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
      <AuthFormField
        label="Sexo"
        id="sexo"
        type="text"
        value={formData.sexo || ''}
        onChange={(e) => onFormDataChange('sexo', e.target.value)}
        disabled={isLoading}
      />
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
      <AuthFormField
        label="Lengua Materna"
        id="lenguaMaterna"
        type="text"
        value={formData.lenguaMaterna || ''}
        onChange={(e) => onFormDataChange('lenguaMaterna', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="Etnia"
        id="etnia"
        type="text"
        value={formData.etnia || ''}
        onChange={(e) => onFormDataChange('etnia', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="Discapacidad"
        id="discapacidad"
        type="text"
        value={formData.discapacidad || ''}
        onChange={(e) => onFormDataChange('discapacidad', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="Dirección Actual"
        id="direccion"
        type="text"
        value={formData.direccion || ''}
        onChange={(e) => onFormDataChange('direccion', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="¿Tiene Dispositivos Electrónicos? (si/no)"
        id="dispositivos"
        type="text"
        value={formData.dispositivos || ''}
        onChange={(e) => onFormDataChange('dispositivos', e.target.value)}
        disabled={isLoading}
      />
      <div></div>
      <AuthFormField
        label="¿Tiene Internet? (si/no)"
        id="internet"
        type="text"
        value={formData.internet || ''}
        onChange={(e) => onFormDataChange('internet', e.target.value)}
        disabled={isLoading}
      />
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

      {/* Checkbox: ¿Vive con el estudiante? */}
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="viveConEstudiante"
          name="viveConEstudiante"
          checked={!!formData.viveConEstudiante}
          onChange={(e) => onFormDataChange('viveConEstudiante', e.target.checked)}
          disabled={isLoading}
        />
        <label className="form-check-label" htmlFor="viveConEstudiante">
          ¿Vive con el estudiante?
        </label>
      </div>

      {/* Exoneración religión */}
      <div className="form-group">
        <label htmlFor="exoneracion">Solicitud de Exoneración de Educación Religiosa:</label>
        <select
          id="exoneracion"
          name="exoneracion"
          value={formData.exoneracion || ''}
          onChange={(e) => onFormDataChange('exoneracion', e.target.value)}
          disabled={isLoading}
        >
          <option value="">Seleccione opción</option>
          {EXONERACION.map((s) => (
            <option key={`Exoneracion-${s}`} value={s}>
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