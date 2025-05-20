/**
 * Servicio para la persistencia de datos de usuarios en Supabase
 */
import IUsuarioPersistence from '../modelos/interfaces/IUsuarioPersistence';
import logger from './Logger';

class UsuarioPersistence extends IUsuarioPersistence {
  /**
   * Constructor del servicio de persistencia
   * @param {object} supabaseClient - Cliente de Supabase
   */
  constructor(supabaseClient) {
    super();
    if (!supabaseClient) {
      throw new Error('Se requiere un cliente de Supabase para persistir datos');
    }
    this.supabase = supabaseClient;
  }

  /**
   * Persiste los datos del docente en Supabase
   * @param {object} docente - Objeto docente a persistir
   * @returns {Promise<object>} Resultado de la operación
   */
  async persistirDocente(docente) {
    try {
      logger.info('Iniciando persistencia de docente');
      
      // 1. Obtener idSexo consultando tabla Sexo
      const { data: sexoData, error: sexoError } = await this.supabase
        .from('Sexo')
        .select('id')
        .eq('valor', docente.sexo)
        .single();
      
      if (sexoError) {
        logger.error('Error al obtener sexo', sexoError);
        return { success: false, error: `Error al obtener idSexo: ${sexoError.message}` };
      }
      if (!sexoData || !sexoData.id) {
        return { success: false, error: `No se encontró el sexo con valor: ${docente.sexo}` };
      }
      const idSexo = sexoData.id;
      
      // 2. Obtener idTipoDocumento consultando tabla TipoDocumento
      const { data: tipoDocData, error: tipoDocError } = await this.supabase
        .from('TipoDocumento')
        .select('id')
        .eq('valor', docente.documento.tipo)
        .single();
      
      if (tipoDocError) {
        logger.error('Error al obtener tipo de documento', tipoDocError);
        return { success: false, error: `Error al obtener idTipoDocumento: ${tipoDocError.message}` };
      }
      if (!tipoDocData || !tipoDocData.id) {
        return { success: false, error: `No se encontró el tipo de documento con valor: ${docente.documento.tipo}` };
      }
      const idTipoDocumento = tipoDocData.id;
      
      // 3. Insertar en tabla Persona
      const personaData = {
        nombres: docente.nombres,
        aPaterno: docente.aPaterno,
        aMaterno: docente.aMaterno || null,
        idSexo: idSexo,
        fechaNacimiento: new Date(docente.fechaNacimiento).toISOString().split('T')[0], 
        idDocumento: idTipoDocumento,
        nroDocumento: docente.documento.numero
      };
      
      logger.info('Insertando en tabla Persona', personaData);
      
      const { data: personaInserted, error: personaError } = await this.supabase
        .from('Persona')
        .insert(personaData)
        .select()
        .single();
      
      if (personaError) {
        logger.error('Error de inserción en Persona', personaError);
        return { success: false, error: `Error al crear persona: ${personaError.message}` };
      }
      const idPersona = personaInserted.id;
      
      // 4. Obtener idRol para "DOCENTE"
      const { data: rolData, error: rolError } = await this.supabase
        .from('Rol')
        .select('id')
        .eq('valor', 'DOCENTE')
        .single();
      
      if (rolError) {
        logger.error('Error al obtener rol', rolError);
        return { success: false, error: `Error al obtener rol: ${rolError.message}` };
      }
      const idRol = rolData.id;
      
      // 5. Insertar en tabla Usuario
      const usuarioData = {
        idPersona: idPersona,
        email: docente.email,
        idRol: idRol
      };
      
      logger.info('Insertando en tabla Usuario', usuarioData);
        const { data: usuarioInserted, error: usuarioError } = await this.supabase
        .from('Usuario')
        .insert(usuarioData)
        .select()
        .single();
      
      if (usuarioError) {
        logger.error('Error detallado al crear usuario', usuarioError);
        return { success: false, error: `Error al crear usuario: ${usuarioError.message}` };
      }
      const idUsuario = usuarioInserted.id;
      
      // 6. Insertar en tabla Docente
      const { error: docenteError } = await this.supabase
        .from('Docente')
        .insert({
          idUsuario: idUsuario
        });
      
      if (docenteError) {
        logger.error('Error al crear docente', docenteError);
        return { success: false, error: `Error al crear docente: ${docenteError.message}` };
      }
      
      return { 
        success: true, 
        message: 'Docente registrado exitosamente',
        data: { idPersona, idUsuario }
      };
    } catch (error) {
      logger.error('Error en proceso de guardado', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Persiste los datos del representante legal
   * @param {object} representanteLegal - Objeto representante legal
   * @param {object} objetos - Objetos adicionales (ubicacion, perfilLinguistico)
   * @returns {Promise<object>} Resultado de la operación
   */
  async persistirRepresentanteLegal(representanteLegal, objetos) {
    // Implementación de la persistencia del representante legal
    // Similar a persistirDocente pero adaptado a RepresentanteLegal
    logger.info('La persistencia de Representante Legal será implementada en futuras versiones');
    return { 
      success: false,
      error: 'Persistencia de representante legal no implementada todavía' 
    };
  }
}

export default UsuarioPersistence;
