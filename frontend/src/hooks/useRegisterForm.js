/**
 * Hook personalizado para manejar el formulario de registro
 */
import { useState } from 'react';
import { useAuth } from '../funcionalidad/AuthContext';
import UsuarioService from '../servicios/UsuarioService';

export function useRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleSpecificData, setRoleSpecificData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registroCompleto, setRegistroCompleto] = useState(false);
  const { validarEmail, validarPassword, registrarNuevoUsuario } = useAuth();
  // Instancia del servicio de usuario
  const usuarioService = new UsuarioService();

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
  const validarCamposComunes = () => {    if (!validarEmail(email)) {
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
      usuarioService.validarCamposRequeridos(role, roleSpecificData);
    if (!camposEspecificosValidos) {
      setError(mensajeCamposEspecificos);
      return;
    }
    
    setIsLoading(true);
    
    try {      // 1. Registrar en Authentication con AuthContext
      const authResult = await registrarNuevoUsuario(email, password);
      if (!authResult.success) {
        setError(authResult.error || 'Error al registrar el usuario en sistema de autenticación');
        return;
      }
      
      console.log('Usuario registrado en Auth:', authResult.data);
      
      // Obtener el ID del usuario autenticado para las relaciones en BD
      const authUserId = authResult.data.user.id;
      console.log('ID de usuario autenticado:', authUserId);
      
      // 2. Datos comunes para todos los usuarios
      const datosUsuario = {
        email,
        role
      };
        // 3. Registrar usuario completo (objetos + persistencia) usando UsuarioService
      const resultado = await usuarioService.registrarUsuarioCompleto(
        datosUsuario, 
        roleSpecificData
      );
      if (!resultado.success) {
        console.error('Error al registrar usuario completo:', resultado.error);
        setError(resultado.error || 'Error al procesar el registro');
        // Nota: Aquí idealmente deberíamos eliminar el usuario de Auth
        // pero omitimos ese paso según lo acordado
      } else {
        // Registro exitoso
        setRegistroCompleto(true);
        console.log('Usuario registrado exitosamente en BD:', resultado.data);
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
    registroCompleto,
    handleRoleChange,
    handleRoleSpecificDataChange,
    handleSubmit
  };
}
