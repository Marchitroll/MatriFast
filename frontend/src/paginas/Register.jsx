import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../funcionalidad/AuthContext';
import { useRegisterForm } from '../hooks/useRegisterForm';
import AuthPageLayout from '../componentes/AuthPageLayout';
import AuthFormField from '../componentes/AuthFormField';
import AuthSubmitButton from '../componentes/AuthSubmitButton';
import RoleSelect from '../componentes/RoleSelect';
import RepresentanteLegalFields from '../componentes/RepresentanteLegalFields';
import DocenteFields from '../componentes/DocenteFields';

/**
 * Componente para el registro de nuevos usuarios
 */
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    isLoading,
    error,
    handleRoleChange,
    handleRoleSpecificDataChange,
    handleSubmit,
    roleSpecificData
  } = useRegisterForm();

  const { session } = useAuth();
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

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
              top: 'calc(1em + 10px + 5px + 10px)', // Ajusta según tu CSS
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
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <AuthFormField
            label="Confirmar Contraseña:"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleShowConfirmPassword}
            style={{
              position: 'absolute',
              right: '10px',
              top: 'calc(1em + 10px + 5px + 10px)', // Ajusta según tu CSS
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2em'
            }}
            title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <RoleSelect
          id="role"
          value={role}
          onChange={handleRoleChange}
          required
          disabled={isLoading}
        />
        {/* Campos específicos según rol */}
        {role === 'REPRESENTANTE LEGAL' && (
          <RepresentanteLegalFields
            formData={roleSpecificData}
            onFormDataChange={handleRoleSpecificDataChange}
            isLoading={isLoading}
          />
        )}
        {role === 'DOCENTE' && (
          <DocenteFields
            formData={roleSpecificData}
            onFormDataChange={handleRoleSpecificDataChange}
            isLoading={isLoading}
          />
        )}
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