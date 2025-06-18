import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthFormField from './AuthFormField';
import { getModalidades, defaultValues as modalidadDefault } from '../modelos/enums/Modalidad.js';
import { getSexos, defaultValues as sexosDefault } from '../modelos/enums/Sexos.js';
import { getTiposDocumento, defaultValues as tiposDocumentoDefault } from '../modelos/enums/TiposDocumento.js';

function MatriculaFormulario({ formData, onFormDataChange, isLoading }) {
  const [modalidades, setModalidades] = useState(modalidadDefault);
  const [sexos, setSexos] = useState(sexosDefault);
  const [tiposDocumento, setTiposDocumento] = useState(tiposDocumentoDefault);
  const [enumsLoading, setEnumsLoading] = useState(true);

  useEffect(() => {
    const cargarEnums = async () => {
      try {
        const [modalidadesData, sexosData, tiposDoc] = await Promise.all([
          getModalidades(),
          getSexos(),
          getTiposDocumento()
        ]);
        
        setModalidades(modalidadesData);
        setSexos(sexosData);
        setTiposDocumento(tiposDoc);
      } catch (error) {
        console.warn('Error cargando enumeraciones, usando valores por defecto:', error);
      } finally {
        setEnumsLoading(false);
      }
    };

    cargarEnums();
  }, []);
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
        <label htmlFor="sexoRL">Sexo:</label>        <select
          id="sexoRL"
          name="sexo"
          value={formData.sexo || ''}
          onChange={(e) => onFormDataChange('sexo', e.target.value)}
          required
          disabled={isLoading || enumsLoading}
        >
          <option value="">Seleccione sexo</option>
          {sexos.map((s) => (
            <option key={`sexo-rl-${s}`} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div></div>
      <div className="form-group">
        <label htmlFor="tipoDocumentoRL">Tipo de Documento:</label>        <select
          id="tipoDocumentoRL"
          name="tipoDocumento"
          value={formData.tipoDocumento || ''}
          onChange={(e) => onFormDataChange('tipoDocumento', e.target.value)}
          required
          disabled={isLoading || enumsLoading}
        >
          <option value="">Seleccione tipo de documento</option>
          {tiposDocumento.map((tipo) => (
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
        disabled={isLoading}      />

      <div></div>
      {/* Campo de Dirección (simplificado) */}
      <AuthFormField
        label="Dirección:"
        type="text"
        id="direccionRL"
        name="direccion"
        value={formData.direccion || ''}
        onChange={(e) => onFormDataChange('direccion', e.target.value)}
        required
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
      />      <h3>Servicio Educativo Solicitado</h3>

      {/* Modalidad */}
      <div className="form-group">
        <label htmlFor="modalidad">Modalidad:</label>        <select
          id="modalidad"
          name="modalidad"
          value={formData.modalidad || ''}
          onChange={(e) => onFormDataChange('modalidad', e.target.value)}
          disabled={isLoading || enumsLoading}
        >
          <option value="">Seleccione Modalidad</option>
          {modalidades.map((s) => (
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
          {/* {EXONERACION.map((s) => (
            <option key={`exoneracion-${s}`} value={s}>
              {s}
            </option>
          ))} */}
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