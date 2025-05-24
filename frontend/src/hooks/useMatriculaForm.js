import { useState } from 'react';

export function useMatriculaForm() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de matrícula:', formData);
    // Aquí iría la lógica para EstudianteService más adelante
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit
  };
}