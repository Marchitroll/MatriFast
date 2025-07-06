import supabase from '../config/ClienteSupabase';

export const ServicioEducativoPersistence = {
  /**
   * Devuelve el id si ya existe la misma combinación;
   * de lo contrario inserta y devuelve el id nuevo.
   */
  async persistir(servicio) {
    /* 1. Buscar coincidencia */
    const { data: existente, error: selErr } = await supabase
      .from('ServicioEducativo')
      .select('id')
      .eq('idNivel', servicio.idNivel)
      .eq('idModalidad', servicio.idModalidad)
      .eq('solicitaExoneracionReligion', servicio.solicitaExoneracionReligion)
      .eq('solicitaExoneracionEdFisica', servicio.solicitaExoneracionEdFisica)
      .single();
    if (selErr && selErr.code !== 'PGRST116') throw selErr;
    if (existente) return existente.id;

    /* 2. Insertar */
    const { data, error } = await supabase
      .from('ServicioEducativo')
      .insert([servicio.toPlain()])
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }
};
