import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../funcionalidad/AuthContext';
import AuthPageLayout from '../componentes/AuthPageLayout';
import AuthFormField from '../componentes/AuthFormField';
import AuthSubmitButton from '../componentes/AuthSubmitButton';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState('');
  const { registrarNuevoUsuario, validarEmail, validarPassword } = useAuth();
  const navigate = useNavigate();

  const obtenerMensajeErrorUsuario = (errorTecnico) => {
    if (errorTecnico.includes('already registered')) {
      return 'El usuario ya se encuentra registrado.';
    }
    
    return 'Error al registrar el usuario. Por favor, inténtelo más tarde.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    if (!validarEmail(email)) {
      setError('El formato del correo electrónico no es válido.');
      return;
    }

    if (!validarPassword(password)) {
      setError('La contraseña debe tener más de 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true); // Iniciar el estado de carga
    try {
      const resultado = await registrarNuevoUsuario(email, password);
      if (resultado.success) {
        //console.log('Usuario registrado:', resultado.data);
        navigate('/formulario');
      } else {
        console.error('Error de registro:', resultado.error);
        setError(obtenerMensajeErrorUsuario(resultado.error)); // Mostrar el error en el formulario y consola
      }
    } catch (error) {
      console.error('Error inesperado en handleSubmit:', error);
      setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false); // Finalizar el estado de carga
    }
  }

  return (
    <AuthPageLayout
      title="Registrar Nuevo Usuario"
      error={error}
      linkTo="/login"
      linkText="¿Ya tienes una cuenta? Iniciar sesión"
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
        <AuthFormField
          label="Contraseña:"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <AuthFormField
          label="Confirmar Contraseña:"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <AuthSubmitButton
          isLoading={isLoading}
          loadingText="Registrando..."
          defaultText="Registrar"
        />
      </form>
    </AuthPageLayout>
  );
}
export default Register;