/**
 * Hook personalizado para cargar y usar enumeraciones de forma asíncrona.
 * Proporciona estados de carga, error y datos para cada enumeración.
 */

import { useState, useEffect } from 'react';
import enumService from '../servicios/EnumService.js';

/**
 * Hook para cargar una enumeración específica
 * @param {string} enumType - Tipo de enumeración a cargar
 * @param {Array} defaultValues - Valores por defecto en caso de error
 * @returns {Object} - { data, loading, error }
 */
export function useEnum(enumType, defaultValues = []) {
  const [data, setData] = useState(defaultValues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEnum = async () => {
      try {
        let result;
        switch (enumType) {
          case 'tiposRelacion':
            result = await enumService.getTiposRelacion();
            break;
          case 'tiposDocumento':
            result = await enumService.getTiposDocumento();
            break;
          case 'rolesUsuario':
            result = await enumService.getRolesUsuario();
            break;
          case 'sexos':
            result = await enumService.getSexos();
            break;
          case 'modalidades':
            result = await enumService.getModalidades();
            break;
          default:
            throw new Error(`Tipo de enumeración no válido: ${enumType}`);
        }
        setData(result);
      } catch (err) {
        setError(err.message);
        console.warn(`Error cargando ${enumType}, usando valores por defecto:`, err);
        setData(defaultValues);
      } finally {
        setLoading(false);
      }
    };

    loadEnum();
  }, [enumType, defaultValues]);

  return { data, loading, error };
}

/**
 * Hook para cargar múltiples enumeraciones de una vez
 * @param {Object} enumConfig - Configuración de enumeraciones { enumType: defaultValues }
 * @returns {Object} - { data: {enumType: values}, loading, error }
 */
export function useEnums(enumConfig) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEnums = async () => {
      try {
        const promises = Object.entries(enumConfig).map(async ([enumType, defaultValues]) => {
          let result;
          switch (enumType) {
            case 'tiposRelacion':
              result = await enumService.getTiposRelacion();
              break;
            case 'tiposDocumento':
              result = await enumService.getTiposDocumento();
              break;
            case 'rolesUsuario':
              result = await enumService.getRolesUsuario();
              break;
            case 'sexos':
              result = await enumService.getSexos();
              break;
            case 'modalidades':
              result = await enumService.getModalidades();
              break;
            default:
              throw new Error(`Tipo de enumeración no válido: ${enumType}`);
          }
          return [enumType, result];
        });

        const results = await Promise.all(promises);
        const enumData = Object.fromEntries(results);
        setData(enumData);
      } catch (err) {
        setError(err.message);
        console.warn('Error cargando enumeraciones, usando valores por defecto:', err);
        // Usar valores por defecto en caso de error
        const defaultData = Object.fromEntries(
          Object.entries(enumConfig).map(([enumType, defaultValues]) => [enumType, defaultValues])
        );
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    loadEnums();
  }, [enumConfig]);

  return { data, loading, error };
}
