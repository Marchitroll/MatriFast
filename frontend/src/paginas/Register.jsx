import { useEffect } from 'react';
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
  const {
    email,
    setEmail,
    password, 
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    roleSpecificData,
    isLoading,
    error,
    handleRoleChange,
    handleRoleSpecificDataChange,
    handleSubmit
  } = useRegisterForm();
  
  const { session } = useAuth();
  const navigate = useNavigate();
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
        />        <RoleSelect
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