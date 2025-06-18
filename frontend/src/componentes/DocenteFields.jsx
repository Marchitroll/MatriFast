import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthFormField from './AuthFormField';
import { getTiposDocumento, defaultValues as tiposDocumentoDefault } from '../modelos/enums/TiposDocumento.js';
import { getSexos, defaultValues as sexosDefault } from '../modelos/enums/Sexos.js';

function DocenteFields({ formData, onFormDataChange, isLoading }) {
  const [tiposDocumento, setTiposDocumento] = useState(tiposDocumentoDefault);
  const [sexos, setSexos] = useState(sexosDefault);
  const [enumsLoading, setEnumsLoading] = useState(true);

  useEffect(() => {
    const cargarEnums = async () => {
      try {
        const [tiposDoc, sexosData] = await Promise.all([
          getTiposDocumento(),
          getSexos()
        ]);
        
        setTiposDocumento(tiposDoc);
        setSexos(sexosData);
      } catch (error) {
        console.warn('Error cargando enumeraciones, usando valores por defecto:', error);
      } finally {
        setEnumsLoading(false);
      }
    };

    cargarEnums();
  }, []);
  return (
    <>
      {/* Datos de Persona */}
      <AuthFormField
        label="Nombres:"
        type="text"
        id="nombres"
        value={formData.nombres || ''}
        onChange={(e) => onFormDataChange('nombres', e.target.value)}
        required
        disabled={isLoading}
      />
      <AuthFormField
        label="Apellido Paterno:"
        type="text"
        id="aPaterno"
        value={formData.aPaterno || ''}
        onChange={(e) => onFormDataChange('aPaterno', e.target.value)}
        required
        disabled={isLoading}
      />
      <AuthFormField
        label="Apellido Materno:"
        type="text"
        id="aMaterno"
        value={formData.aMaterno || ''}
        onChange={(e) => onFormDataChange('aMaterno', e.target.value)}
        required
        disabled={isLoading}
      />
      <AuthFormField
        label="Fecha de Nacimiento:"
        type="date"
        id="fechaNacimiento"
        value={formData.fechaNacimiento || ''}
        onChange={(e) => onFormDataChange('fechaNacimiento', e.target.value)}
        required
        disabled={isLoading}
      />
      <div className="form-group">
        <label htmlFor="sexo">Sexo:</label>        <select
          id="sexo"
          value={formData.sexo || ''}
          onChange={(e) => onFormDataChange('sexo', e.target.value)}
          required
          disabled={isLoading || enumsLoading}
        >
          <option value="">Seleccione sexo</option>
          {sexos.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {/* Documento */}
      <div className="form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento:</label>        <select
          id="tipoDocumento"
          value={formData.tipoDocumento || ''}
          onChange={(e) => onFormDataChange('tipoDocumento', e.target.value)}
          required
          disabled={isLoading || enumsLoading}
        >
          <option value="">Seleccione tipo de documento</option>
          {tiposDocumento.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
      <AuthFormField
        label="Número de Documento:"
        type="text"
        id="numeroDocumento"
        value={formData.numeroDocumento || ''}
        onChange={(e) => onFormDataChange('numeroDocumento', e.target.value)}
        required
        disabled={isLoading}
      />
    </>
  );
}

DocenteFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

DocenteFields.defaultProps = {
  isLoading: false,
};

export default DocenteFields;
