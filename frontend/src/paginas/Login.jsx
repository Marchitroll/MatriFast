import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../funcionalidad/AuthContext';
import AuthPageLayout from '../componentes/AuthPageLayout';
import AuthFormField from '../componentes/AuthFormField';
import AuthSubmitButton from '../componentes/AuthSubmitButton';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para visibilidad
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { session, iniciarSesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/'); 
    }
  }, [session, navigate]);

  const obtenerMensajeErrorUsuario = (errorTecnico) => {
    if (errorTecnico.includes('Invalid login credentials')) {
      return 'Correo o contraseña incorrectos.';
    }
    return 'Error al iniciar sesión. Por favor, inténtelo más tarde.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const resultado = await iniciarSesion({ email, password });
      if (resultado.success) {
        navigate('/formulario');
      } else {
        setError(obtenerMensajeErrorUsuario(resultado.error));
      }
    } catch (err) {
      console.error('Error inesperado al iniciar sesión:', err);
      setError('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthPageLayout
      title="Iniciar Sesión - Portal de Matrículas"
      error={error}
      linkTo="/register"
      linkText="¿No tienes una cuenta? Registrarse"
    >
      <form className="register-form" onSubmit={handleSubmit}>
        <AuthFormField
          label="Correo Electrónico:"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <AuthFormField
            label="Contraseña:"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            style={{
              position: 'absolute',
              right: '10px',
              top: 'calc(1em + 10px + 5px + 10px)', // Ajusta esto según el padding/margin de tu label y input
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2em'
            }}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <AuthSubmitButton
          isLoading={isLoading}
          loadingText="Ingresando..."
          defaultText="Ingresar"
        />
      </form>
    </AuthPageLayout>
  );
}

export default Login;
