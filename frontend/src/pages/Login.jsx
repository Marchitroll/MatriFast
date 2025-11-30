import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthPageLayout } from '../components/layout';
import { FormField, PasswordInput, SubmitButton } from '../components/common';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { session, iniciarSesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate('/');
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const resultado = await iniciarSesion({ email, password });
      if (resultado.success) {
        navigate('/formulario');
      } else {
        setError(
          resultado.error?.includes('Invalid login credentials')
            ? 'Correo o contraseña incorrectos.'
            : 'Error al iniciar sesión. Inténtelo más tarde.'
        );
      }
    } catch {
      setError('Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Iniciar Sesión - Portal de Matrículas"
      error={error}
      linkTo="/register"
      linkText="¿No tienes una cuenta? Registrarse"
    >
      <form className="register-form" onSubmit={handleSubmit}>
        <FormField
          label="Correo Electrónico:"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <PasswordInput
          label="Contraseña:"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <SubmitButton
          isLoading={isLoading}
          loadingText="Ingresando..."
          defaultText="Ingresar"
        />
      </form>
    </AuthPageLayout>
  );
}

export default Login;
