import React, { useEffect, useState } from 'react';
import { useAuth } from '../funcionalidad/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocenteFields from '../componentes/DocenteFields';
import RepresentanteLegalFields from '../componentes/RepresentanteLegalFields';
import AuthSubmitButton from '../componentes/AuthSubmitButton';
import UsuarioService from '../servicios/UsuarioService';

function Perfil() {
  const { session, obtenerUsuarioActual } = useAuth();  // Suponiendo que tienes función para obtener usuario
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  const [role, setRole] = useState('');

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    // Cargar datos del usuario actual
    const cargarDatosUsuario = async () => {
      setIsLoading(true);
      try {
        // Suponemos que en AuthContext tienes una función que retorna datos del usuario
        const usuario = await obtenerUsuarioActual();
        if (!usuario) {
          navigate('/login');
          return;
        }
        setFormData(usuario);
        setRole(usuario.role);
      } catch (err) {
        setError('Error al cargar datos del perfil.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosUsuario();
  }, [session, navigate, obtenerUsuarioActual]);

  const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Aquí llamaremos al servicio para actualizar el perfil
      const usuarioService = new UsuarioService();
    
      formData.documento = {
      tipo: formData.tipoDocumento,
      numero: formData.numeroDocumento,
    };
    console.log('Payload para actualizar:', JSON.stringify(formData, null, 2));

      const resultado = await usuarioService.actualizarUsuario(role, formData);
      if (resultado.success) {
        alert('Perfil actualizado correctamente.');
      } else {
        setError(resultado.error || 'Error al actualizar perfil.');
      }
    } catch (err) {
      setError('Error inesperado al actualizar perfil.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page perfil">
      <h2>Mi Perfil</h2>
      {error && <div className="error">{error}</div>}
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Mostrar campos según rol */}
          {role === 'DOCENTE' && (
            <DocenteFields formData={formData} onFormDataChange={handleChange} isLoading={isLoading} isUpdate={true} />
          )}
          {role === 'REPRESENTANTE LEGAL' && (
            <RepresentanteLegalFields formData={formData} onFormDataChange={handleChange} isLoading={isLoading} isUpdate={true} />
          )}
          <AuthSubmitButton isLoading={isLoading} loadingText="Guardando..." defaultText="Guardar Cambios" />
        </form>
      )}
    </div>
  );
}

export default Perfil;
