import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { AuthPageLayout } from '../components/layout';
import { FormField, PasswordInput, SubmitButton } from '../components/common';
import { RoleSelect, DocenteFields, RepresentanteLegalFields } from '../components/forms';

function Register() {
  const {
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    role, isLoading, error,
    handleRoleChange,
    handleRoleSpecificDataChange,
    handleSubmit,
    roleSpecificData
  } = useRegisterForm();

  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate('/');
  }, [session, navigate]);

  return (
    <AuthPageLayout
      title="Registrar Nuevo Usuario"
      error={error}
      linkTo="/login"
      linkText="¿Ya tienes una cuenta? Iniciar sesión"
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
        <PasswordInput
          label="Confirmar Contraseña:"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <RoleSelect
          id="role"
          value={role}
          onChange={handleRoleChange}
          required
          disabled={isLoading}
        />
        
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
        
        <SubmitButton
          isLoading={isLoading}
          loadingText="Registrando..."
          defaultText="Registrar"
        />
      </form>
    </AuthPageLayout>
  );
}

export default Register;
