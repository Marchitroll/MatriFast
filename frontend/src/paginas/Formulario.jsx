import { useNavigate } from "react-router-dom";
import { useAuth } from "../funcionalidad/AuthContext";
import { useEffect } from 'react';

function Formulario() {
  const { session, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  // Redirigir al login si no hay sesión
  useEffect(() => {
    if (session === null) {
      navigate('/login');
    }
  }, [session, navigate]);

  // Función para cerrar sesión y redirigir
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
      {/* Botón para cerrar sesión */}
      <button onClick={handleLogout} disabled={!session} className="logout-button">
        Cerrar sesión
      </button>
    </div>
  );
}

export default Formulario;