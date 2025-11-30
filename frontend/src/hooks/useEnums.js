/**
 * Hook simplificado para cargar enumeraciones usando el servicio centralizado
 * Sigue principio DRY - usa enumService que ya tiene caché
 */
import { useState, useEffect } from 'react';
import enumService from '../services/EnumService';

const defaultEnums = {
  sexos: ['M', 'F'],
  tiposDocumento: ['DNI', 'CE', 'PTP'],
  tiposRelacion: ['PADRE', 'MADRE', 'TUTOR', 'ABUELO', 'HERMANO'],
  roles: ['DOCENTE', 'REPRESENTANTE LEGAL'],
  modalidades: ['PRESENCIAL', 'VIRTUAL', 'SEMIPRESENCIAL'],
};

function useEnums() {
  const [enums, setEnums] = useState(defaultEnums);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const cargarEnums = async () => {
      try {
        const [sexos, tiposDocumento, tiposRelacion, roles, modalidades] = await Promise.all([
          enumService.getSexos(),
          enumService.getTiposDocumento(),
          enumService.getTiposRelacion(),
          enumService.getRolesUsuario(),
          enumService.getModalidades(),
        ]);

        if (isMounted) {
          setEnums({ sexos, tiposDocumento, tiposRelacion, roles, modalidades });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.warn('Error cargando enums, usando valores por defecto:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    cargarEnums();
    return () => { isMounted = false; };
  }, []);

  return { ...enums, loading, error };
}

export default useEnums;
