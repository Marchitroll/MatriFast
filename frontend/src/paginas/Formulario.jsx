import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../funcionalidad/AuthContext";
import FormularioMatricula from '../componentes/FormularioMatricula';
import AuthSubmitButton from '../componentes/AuthSubmitButton';
import AuthPageLayout from '../componentes/AuthPageLayout';
import useMatriculaForm from '../hooks/useMatriculaForm';


function Formulario() {
  const { session, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit
  } = useMatriculaForm();

  // Redirigir si no hay sesión
  useEffect(() => {
    if (session === null) {
      navigate('/login');
    }
  }, [session, navigate]);

  const handleLogout = async () => {
    const resultado = await cerrarSesion();
    if (resultado.success) {
      navigate('/login');
    } else {
      console.error('Error al cerrar sesión:', resultado.error);
    }
  };

  return (
    <div className="page formulario">
      <h2>Formulario de Matrícula</h2>

      <button onClick={handleLogout} disabled={!session} className="logout-button">
        Cerrar sesión
      </button>

{session && (
  <form className="matricula-form" onSubmit={handleSubmit}>
    <FormularioMatricula
      formData={formData}
      onFormDataChange={handleChange}
      isLoading={isLoading}
    />
    <AuthSubmitButton
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