import { useState } from 'react';
import { useAuth } from '../funcionalidad/AuthContext';
import UsuarioService from '../servicios/UsuarioService';

export function useEstudianteForm() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registroCompleto, setRegistroCompleto] = useState(false);

  const usuarioService = new UsuarioService();
  const { session } = useAuth();

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Email fijo y role ESTUDIANTE
      const datosUsuario = {
        email: 'estudiante@instituto.com',
        role: 'ESTUDIANTE'
      };

      // 2. Datos específicos son los del formulario
      const datosEspecificos = { ...formData };

      const resultado = await usuarioService.registrarUsuarioCompleto(
        datosUsuario,
        datosEspecificos
      );

      if (!resultado.success) {
        setError(resultado.error || 'Error al registrar el estudiante');
        return;
      }

      console.log("Estudiante registrado exitosamente:", resultado.data);
      setRegistroCompleto(true);
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Ocurrió un error al guardar la matrícula.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    registroCompleto,
    handleChange,
    handleSubmit
  };
}