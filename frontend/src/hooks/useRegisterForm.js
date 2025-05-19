/**
 * Hook personalizado para manejar el formulario de registro
 */
import { useState } from 'react';
import { useAuth } from '../funcionalidad/AuthContext';
import { validarCamposRequeridos, registrarUsuario } from '../servicios/UsuarioService';

export function useRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleSpecificData, setRoleSpecificData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { validarEmail, validarPassword } = useAuth();

  /**
   * Actualiza los datos específicos del rol
   */
  const handleRoleSpecificDataChange = (field, value) => {
    setRoleSpecificData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Cambia el rol seleccionado y limpia los datos específicos
   */
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setRoleSpecificData({}); // Reiniciar datos específicos al cambiar de rol
  };

  /**
   * Valida los campos comunes del formulario de registro
   */
  const validarCamposComunes = () => {
    if (!validarEmail(email)) {
      return { esValido: false, mensaje: 'El formato del correo electrónico no es válido.' };
    }
    
    if (!validarPassword(password)) {
      return { esValido: false, mensaje: 'La contraseña debe tener más de 6 caracteres.' };
    }
    
    if (password !== confirmPassword) {
      return { esValido: false, mensaje: 'Las contraseñas no coinciden.' };
    }
    
    if (!role) {
      return { esValido: false, mensaje: 'Debe seleccionar un rol.' };
    }
    
    return { esValido: true, mensaje: null };
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar campos comunes
    const { esValido: camposComunesValidos, mensaje: mensajeCamposComunes } = validarCamposComunes();
    if (!camposComunesValidos) {
      setError(mensajeCamposComunes);
      return;
    }
    
    // Validar campos específicos según rol
    const { esValido: camposEspecificosValidos, mensaje: mensajeCamposEspecificos } = 
      validarCamposRequeridos(role, roleSpecificData);
    if (!camposEspecificosValidos) {
      setError(mensajeCamposEspecificos);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Datos comunes para todos los usuarios
      const datosUsuario = {
        email,
        password,
        role
      };
      
      // Registrar usuario (solo para testeo, sin enviar a BD)
      const resultado = await registrarUsuario(datosUsuario, roleSpecificData);
      
      if (!resultado.success) {
        setError(resultado.error || 'Error al procesar el registro');
      } else {
        // Mostrar mensaje de éxito o realizar alguna acción
        console.log('Usuario creado exitosamente (solo consola, sin registro en BD)');
      }
    } catch (error) {
      console.error('Error inesperado en el registro:', error);
      setError('Ocurrió un error inesperado procesando los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
