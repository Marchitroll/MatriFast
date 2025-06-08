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
  };  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // 1. Validar campos comunes
      const { esValido: camposComunesValidos, mensaje: mensajeCamposComunes } = validarCamposComunes();
      if (!camposComunesValidos) {
        setError(mensajeCamposComunes);
        return;
      }
      
      // 2. Datos completos para el registro
      const datosCompletos = {
        email,
        password,
        role
      };
      
      // 3. NUEVO: Validación completa y persistencia PRIMERO
      const resultado = await usuarioService.registrarUsuarioCompleto(
        datosCompletos, 
        roleSpecificData
      );
      
      if (!resultado.success) {
        setError(resultado.error || 'Error al procesar el registro');
        return;
      }
      
      console.log('Datos persistidos exitosamente:', resultado.data);
      
      // 4. SOLO SI TODO SALE BIEN: Crear en Auth
      const authResult = await registrarNuevoUsuario(email, password);
      
      if (!authResult.success) {
        setError('Los datos fueron guardados correctamente, pero hubo un problema con la autenticación. Contacte soporte técnico con este código: REG-AUTH-ERR');
        console.error('Error en Auth post-persistencia:', {
          idUsuario: resultado.data.idUsuario,
          error: authResult.error,
          timestamp: new Date().toISOString()      });
        return;
      }
      
      console.log('Usuario registrado en Auth:', authResult.data);
      
      // 5. Registro completado exitosamente
      setRegistroCompleto(true);
      console.log('Registro completo exitoso');
      
    } catch (error) {
      console.error('Error inesperado en el registro:', error);
      setError('Error inesperado. Contacte soporte técnico.');
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
