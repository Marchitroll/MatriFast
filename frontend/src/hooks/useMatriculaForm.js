import { useState } from 'react';
import { useAuth } from '../funcionalidad/AuthContext';
import { registrarMatricula } from '../servicios/MatriculaService.js';

export default function useMatriculaForm() {
  const { session } = useAuth();          // contiene userId logueado
  const [formData, setFormData] = useState({});
  const [estado, setEstado]   = useState({ loading: false, exito: false, error: null });

  const handleChange = (campo, valor) =>
    setFormData(prev => ({ ...prev, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log('📦 payload que sale del formulario →', formData);
    setEstado({ loading: true, exito: false, error: null });
    try {
      await registrarMatricula(formData, session.userId);
      setEstado({ loading: false, exito: true, error: null });
      setFormData({});
    } catch (err) {
      setEstado({ loading: false, exito: false, error: err.message });
    }
  };

  return { ...estado, formData, handleChange, handleSubmit };
}
