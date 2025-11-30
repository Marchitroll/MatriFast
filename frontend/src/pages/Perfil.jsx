import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DocenteFields, RepresentanteLegalFields } from '../components/forms';
import { SubmitButton } from '../components/common';
import { usuarioService } from '../services';

function Perfil() {
  const { session, obtenerUsuarioActual } = useAuth();
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

    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const usuario = await obtenerUsuarioActual();
        if (!usuario) {
          navigate('/login');
          return;
        }
        setFormData(usuario);
        setRole(usuario.role);
      } catch (err) {
        setError('Error al cargar datos del perfil.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [session, navigate, obtenerUsuarioActual]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const datosActualizar = {
        ...formData,
        rol: role,
        documento: {
          tipo: formData.tipoDocumento,
          numero: formData.numeroDocumento,
        }
      };

      const resultado = await usuarioService.actualizar(datosActualizar);
      
      if (resultado.success) {
        alert('Perfil actualizado correctamente.');
      } else {
        setError(resultado.error || 'Error al actualizar perfil.');
      }
    } catch (err) {
      setError('Error inesperado al actualizar perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Cargando datos...</p>;

  return (
    <div className="page perfil">
      <h2>Mi Perfil</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        {role === 'DOCENTE' && (
          <DocenteFields 
            formData={formData} 
            onFormDataChange={handleChange} 
            isLoading={isLoading} 
            isUpdate 
          />
        )}
        {role === 'REPRESENTANTE LEGAL' && (
          <RepresentanteLegalFields 
            formData={formData} 
            onFormDataChange={handleChange} 
            isLoading={isLoading} 
            isUpdate 
          />
        )}
        <SubmitButton 
          isLoading={isLoading} 
          loadingText="Guardando..." 
          defaultText="Guardar Cambios" 
        />
      </form>
    </div>
  );
}

export default Perfil;
