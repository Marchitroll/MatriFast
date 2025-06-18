import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthFormField from './AuthFormField';
import { getTiposDocumento, defaultValues as tiposDocumentoDefault } from '../modelos/enums/TiposDocumento.js';
import { getSexos, defaultValues as sexosDefault } from '../modelos/enums/Sexos.js';
import { getTiposRelacion, defaultValues as tiposRelacionDefault } from '../modelos/enums/TiposRelacion.js';

function RepresentanteLegalFields({ formData, onFormDataChange, isLoading }) {
  const [tiposDocumento, setTiposDocumento] = useState(tiposDocumentoDefault);
  const [sexos, setSexos] = useState(sexosDefault);
  const [tiposRelacion, setTiposRelacion] = useState(tiposRelacionDefault);
  const [enumsLoading, setEnumsLoading] = useState(true);

  useEffect(() => {
    const cargarEnums = async () => {
      try {
        const [tiposDoc, sexosData, tiposRel] = await Promise.all([
          getTiposDocumento(),
          getSexos(),
          getTiposRelacion()
        ]);
        
        setTiposDocumento(tiposDoc);
        setSexos(sexosData);
        setTiposRelacion(tiposRel);
      } catch (error) {
        console.warn('Error cargando enumeraciones, usando valores por defecto:', error);
      } finally {
        setEnumsLoading(false);
      }
    };

    cargarEnums();
  }, []);

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

      {/* Documento */}
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
        <label htmlFor="tipoRelacion">Tipo de Relación:</label>        <select
          id="tipoRelacion"
          name="tipoRelacion"
          value={formData.tipoRelacion || ''}
          onChange={(e) => onFormDataChange('tipoRelacion', e.target.value)}
          required
          disabled={isLoading || enumsLoading}
        >
          <option value="">Seleccione tipo de relación</option>
          {tiposRelacion.map((tipo) => (
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
        title="Debe ser un número de celular peruano válido (9 dígitos)."      />
      
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
