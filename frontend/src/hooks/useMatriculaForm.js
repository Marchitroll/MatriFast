/**
 * Hook para manejar el formulario de matrícula
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function useMatriculaForm() {
  const { session } = useAuth();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar registrarMatricula cuando se refactorice MatriculaService
      console.log('Datos de matrícula:', formData);
      setFormData({});
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, error, handleChange, handleSubmit };
}
