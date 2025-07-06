import { useState } from 'react';
import usuarioService from '../servicios/UsuarioService';

/**
 * Hook para registrar un estudiante (sin crear cuenta Auth).
 */
export default function useEstudianteForm() {
  const [estado, setEstado] = useState({ cargando: false, exito: false, error: null });

  const handleSubmit = async (formData) => {
    setEstado({ cargando: true, exito: false, error: null });

    try {
      /* ── 1. Datos de Usuario (solo rol) ─────────────────────────── */
      const datosUsuario = { role: 'ESTUDIANTE' };

      /* ── 2. Datos de Estudiante ─────────────────────────────────── */
      const {
        nombres, aPaterno, aMaterno, fechaNacimiento, sexo,
        tipoDocumento, numeroDocumento, lugarNacimiento, direccion,
        tieneDispositivosElectronicos, tieneInternet, representanteLegalId,
        nivel, grado, seccion, turno
      } = formData;

      const datosEstudiante = {
        nombres, aPaterno, aMaterno, fechaNacimiento, sexo,
        tipoDocumento, numeroDocumento, lugarNacimiento, direccion,
        tieneDispositivosElectronicos, tieneInternet, representanteLegalId,
        servicioEducativo: { nivel, grado, seccion, turno }
      };

      /* ── 3. Registrar en BD (sin Auth) ──────────────────────────── */
      await usuarioService.registrarUsuarioCompleto(
        datosUsuario,
        datosEstudiante,
        { crearCuentaAuth: false }
      );

      setEstado({ cargando: false, exito: true, error: null });
    } catch (err) {
      setEstado({ cargando: false, exito: false, error: err.message });
    }
  };

  return { ...estado, handleSubmit };
}