/**
 * Servicio centralizado para la gestión de enumeraciones desde la base de datos.
 * Implementa caché para evitar consultas repetidas.
 */
import supabase from '../config/ClienteSupabase';

class EnumService {
  constructor() {
    this.cache = {};
    this.initialLoadPromise = null;
    this.defaultValues = {
      'TipoRelacion': ['PADRE', 'MADRE', 'TUTOR', 'ABUELO', 'HERMANO'],
      'TipoDocumento': ['DNI', 'CE', 'PTP'],
      'Rol': ['DOCENTE', 'REPRESENTANTE LEGAL'],
      'Sexo': ['M', 'F'],
      'Modalidad': ['PRESENCIAL', 'VIRTUAL', 'SEMIPRESENCIAL']
    };
  }

  async getEnum(tableName) {
    if (this.cache[tableName]) return this.cache[tableName];

    try {
      const { data, error } = await supabase.from(tableName).select('valor');
      if (error) throw error;
      
      this.cache[tableName] = Object.freeze(
        (data || []).map(r => r.valor.trim()).filter(Boolean)
      );
      return this.cache[tableName];
    } catch (error) {
      console.error(`Error cargando ${tableName}:`, error);
      this.cache[tableName] = Object.freeze(this.defaultValues[tableName] || []);
      return this.cache[tableName];
    }
  }

  async preloadAll() {
    if (this.initialLoadPromise) return this.initialLoadPromise;

    this.initialLoadPromise = Promise.all([
      this.getEnum('TipoRelacion'),
      this.getEnum('TipoDocumento'),
      this.getEnum('Rol'),
      this.getEnum('Sexo'),
      this.getEnum('Modalidad')
    ]);

    return this.initialLoadPromise;
  }

  getTiposRelacion = () => this.getEnum('TipoRelacion');
  getTiposDocumento = () => this.getEnum('TipoDocumento');
  getRolesUsuario = () => this.getEnum('Rol');
  getSexos = () => this.getEnum('Sexo');
  getModalidades = () => this.getEnum('Modalidad');
  
  clearCache() {
    this.cache = {};
    this.initialLoadPromise = null;
  }
}

const enumService = new EnumService();
export default enumService;
