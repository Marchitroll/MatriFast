import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormularioMatricula from '../components/forms/FormularioMatricula';
import { SubmitButton } from '../components/common';
import useMatriculaForm from '../hooks/useMatriculaForm';

function Formulario() {
  const { session, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const { formData, isLoading, error, handleChange, handleSubmit } = useMatriculaForm();

  useEffect(() => {
    if (session === null) navigate('/login');
  }, [session, navigate]);

  const handleLogout = async () => {
    const resultado = await cerrarSesion();
    if (resultado.success) navigate('/login');
  };

  return (
    <div className="page formulario">
      <h2>Formulario de Matrícula</h2>
      
      <button onClick={handleLogout} disabled={!session} className="logout-button">
        Cerrar sesión
      </button>

      {error && <div className="error">{error}</div>}

      {session && (
        <form className="matricula-form" onSubmit={handleSubmit}>
          <FormularioMatricula
            formData={formData}
            onFormDataChange={handleChange}
            isLoading={isLoading}
          />
          <SubmitButton
            isLoading={isLoading}
            loadingText="Guardando..."
            defaultText="Enviar Matrícula"
          />
        </form>
      )}
    </div>
  );
}

export default Formulario;
