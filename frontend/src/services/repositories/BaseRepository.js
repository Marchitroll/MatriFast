/**
 * Repositorio base con operaciones comunes de persistencia
 * Implementa Repository Pattern para reducir duplicación
 */
import logger from '../Logger';

class BaseRepository {
  constructor(supabase) {
    if (!supabase) throw new Error('Se requiere cliente Supabase');
    this.supabase = supabase;
  }

  /**
   * Obtiene ID de un valor en tabla de enum
   */
  async getEnumId(tabla, valor) {
    const { data, error } = await this.supabase
      .from(tabla)
      .select('id')
      .eq('valor', valor)
      .single();

    if (error || !data) {
      throw new Error(`No se encontró ${valor} en ${tabla}`);
    }
    return data.id;
  }

  /**
   * Inserta un registro y retorna los datos insertados
   */
  async insert(tabla, datos) {
    const { data, error } = await this.supabase
      .from(tabla)
      .insert(datos)
      .select()
      .single();

    if (error) {
      logger.error(`Error insertando en ${tabla}`, error);
      throw new Error(`Error en ${tabla}: ${error.message}`);
    }
    return data;
  }

  /**
   * Actualiza un registro por ID
   */
  async update(tabla, id, datos) {
    const { error } = await this.supabase
      .from(tabla)
      .update(datos)
      .eq('id', id);

    if (error) {
      logger.error(`Error actualizando ${tabla}`, error);
      throw new Error(`Error en ${tabla}: ${error.message}`);
    }
    return true;
  }
}

export default BaseRepository;
