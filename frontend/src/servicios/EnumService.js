/**
 * Servicio centralizado para la gestión de enumeraciones desde la base de datos.
 * Reemplaza el uso de top-level await en los módulos enum individuales.
 * 
 * Este servicio proporciona:
 * - Carga asíncrona de enumeraciones
 * - Sistema de caché para evitar consultas repetidas
 * - Manejo gracioso de errores
 * - Precarga de todas las enumeraciones
 * - Valores por defecto en caso de fallos
 */

import supabase from '../config/ClienteSupabase.js';

class EnumService {
  constructor() {
    // Caché para almacenar los valores ya cargados
    this.cache = {};
    // Estado de carga inicial
    this.initialLoadPromise = null;
    // Valores por defecto en caso de error
    this.defaultValues = {
      'TipoRelacion': ['PADRE', 'MADRE', 'TUTOR', 'ABUELO', 'HERMANO'],
      'TipoDocumento': ['DNI', 'CE', 'PTP'],
      'Rol': ['Docente', 'Representante legal'],
      'Sexo': ['M', 'F'],
      'Modalidad': ['PRESENCIAL', 'VIRTUAL', 'SEMIPRESENCIAL']
    };
  }

  /**
   * Obtiene un tipo de enumeración desde la base de datos
   * @param {string} tableName - Nombre de la tabla en Supabase
   * @returns {Promise<string[]>} - Array de valores permitidos
   */
  async getEnum(tableName) {
    // Verificar si ya está en caché
    if (this.cache[tableName]) {
      return this.cache[tableName];
    }

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('valor');
      
      if (error) throw new Error(`Error al cargar ${tableName}: ${error.message}`);
      
      // Procesar y guardar en caché
      const valores = Object.freeze(
        (data || []).map(r => r.valor.trim()).filter(Boolean)
      );
      
      this.cache[tableName] = valores;
      return valores;
    } catch (error) {
      console.error(`Error cargando ${tableName}:`, error);
      // Retornar valores por defecto en caso de error para no romper la app
      const defaultValues = this.defaultValues[tableName] || [];
      this.cache[tableName] = Object.freeze(defaultValues);
      return this.cache[tableName];
    }
  }

  /**
   * Precarga todas las enumeraciones comunes en paralelo
   * @returns {Promise<void>}
   */
  async preloadAll() {
    if (this.initialLoadPromise) return this.initialLoadPromise;

    this.initialLoadPromise = Promise.all([
      this.getEnum('TipoRelacion'),
      this.getEnum('TipoDocumento'),
      this.getEnum('Rol'),
      this.getEnum('Sexo'),
      this.getEnum('Modalidad')
    ]).then(() => {
      console.log('Enumeraciones precargadas correctamente');
    }).catch(error => {
      console.error('Error precargando enumeraciones:', error);
    });

    return this.initialLoadPromise;
  }

  /**
   * Obtiene los tipos de relación permitidos
   * @returns {Promise<string[]>}
   */
  async getTiposRelacion() {
    return await this.getEnum('TipoRelacion');
  }

  /**
   * Obtiene los tipos de documento permitidos
   * @returns {Promise<string[]>}
   */
  async getTiposDocumento() {
    return await this.getEnum('TipoDocumento');
  }

  /**
   * Obtiene los roles de usuario permitidos
   * @returns {Promise<string[]>}
   */
  async getRolesUsuario() {
    return await this.getEnum('Rol');
  }

  /**
   * Obtiene los sexos permitidos
   * @returns {Promise<string[]>}
   */
  async getSexos() {
    return await this.getEnum('Sexo');
  }

  /**
   * Obtiene las modalidades permitidas
   * @returns {Promise<string[]>}
   */
  async getModalidades() {
    return await this.getEnum('Modalidad');
  }

  /**
   * Limpia la caché de enumeraciones
   */
  clearCache() {
    this.cache = {};
    this.initialLoadPromise = null;
  }
}

// Exportar una instancia única (singleton)
const enumService = new EnumService();
export default enumService;
