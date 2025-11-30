/**
 * Hook para manejar el formulario de registro
 * Refactorizado para usar nuevos servicios
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usuarioService } from '../services';

export function useRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleSpecificData, setRoleSpecificData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { validarEmail, validarPassword, registrarNuevoUsuario } = useAuth();

  const handleRoleSpecificDataChange = (field, value) => {
    setRoleSpecificData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setRoleSpecificData({});
  };

  const validarCampos = () => {
    if (!validarEmail(email)) return 'El formato del correo electrónico no es válido.';
    if (!validarPassword(password)) return 'La contraseña debe tener más de 6 caracteres.';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    if (!role) return 'Debe seleccionar un rol.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const errorValidacion = validarCampos();
      if (errorValidacion) {
        setError(errorValidacion);
        return;
      }
      
      // Registrar usuario en BD
      const resultado = await usuarioService.registrar(
        { email, password, role },
        roleSpecificData
      );
      
      if (!resultado.success) {
        setError(resultado.error || 'Error al procesar el registro');
        return;
      }
      
      // Crear en Auth
      const authResult = await registrarNuevoUsuario(email, password);
      if (!authResult.success) {
        setError('Datos guardados, pero hubo un problema con la autenticación. Contacte soporte.');
        return;
      }
      
      console.log('Registro completado exitosamente');
    } catch (err) {
      setError('Error inesperado. Contacte soporte técnico.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    role, roleSpecificData,
    isLoading, error,
    handleRoleChange,
    handleRoleSpecificDataChange,
    handleSubmit
  };
}
