import { useState } from 'react';
import UsuarioService from '../servicios/UsuarioService';

const useEstudianteForm = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const registrarEstudiante = async (datosUsuario, datosForm) => {
    setLoading(true);
    setResultado(null);
    setError(null);

    try {
      const usuarioService = new UsuarioService();
      const response = await usuarioService.registrarUsuarioCompleto(datosUsuario, datosForm);

      if (response.success) {
        setResultado(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return {
    registrarEstudiante,
    loading,
    resultado,
    error,
  };
};

export default useEstudianteForm;
