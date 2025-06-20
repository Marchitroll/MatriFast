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
   */  async persistirRepresentanteLegal(representanteLegal, objetos) {
    try {
      logger.info('Iniciando persistencia de representante legal');

      // 1. Obtener ID del sexo
      const { data: sexoData, error: sexoError } = await this.supabase
        .from('Sexo')
        .select('id')
        .eq('valor', representanteLegal.sexo)
        .single();

      if (sexoError || !sexoData) {
        logger.error('Error al obtener sexo:', sexoError);
        return { success: false, error: 'Sexo no encontrado en la base de datos' };
      }
      const idSexo = sexoData.id;

      // 2. Obtener ID del tipo de documento
      const { data: tipoDocData, error: tipoDocError } = await this.supabase
        .from('TipoDocumento')
        .select('id')
        .eq('valor', representanteLegal.documento.tipo)
        .single();

      if (tipoDocError || !tipoDocData) {
        logger.error('Error al obtener tipo de documento:', tipoDocError);
        return { success: false, error: 'Tipo de documento no encontrado' };
      }
      const idTipoDocumento = tipoDocData.id;

      // 3. Obtener ID del tipo de relación
      const { data: tipoRelacionData, error: tipoRelacionError } = await this.supabase
        .from('TipoRelacion')
        .select('id')
        .eq('valor', representanteLegal.tipoRelacion)
        .single();

      if (tipoRelacionError || !tipoRelacionData) {
        logger.error('Error al obtener tipo de relación:', tipoRelacionError);
        return { success: false, error: 'Tipo de relación no encontrado' };
      }
      const idTipoRelacion = tipoRelacionData.id;

      // 4. Insertar ubicación (dirección) en tabla separada
      const ubicacionData = {
        direccion: representanteLegal.direccion.direccion
      };

      const { data: ubicacionInserted, error: ubicacionError } = await this.supabase
        .from('Ubicacion')
        .insert(ubicacionData)
        .select()
        .single();

      if (ubicacionError || !ubicacionInserted) {
        logger.error('Error al insertar ubicación:', ubicacionError);
        return { success: false, error: 'Error al crear ubicación en la base de datos' };
      }
      const idDireccion = ubicacionInserted.id;

      // 5. Insertar persona
      const personaData = {
        nombres: representanteLegal.nombres,
        aPaterno: representanteLegal.aPaterno,
        aMaterno: representanteLegal.aMaterno || null,
        idSexo: idSexo,
        fechaNacimiento: new Date(representanteLegal.fechaNacimiento).toISOString().split('T')[0], 
        idDocumento: idTipoDocumento,
        nroDocumento: representanteLegal.documento.numero
      };

      const { data: personaInserted, error: personaError } = await this.supabase
        .from('Persona')
        .insert(personaData)
        .select()
        .single();

      if (personaError || !personaInserted) {
        logger.error('Error al insertar persona:', personaError);
        return { success: false, error: 'Error al crear persona en la base de datos' };
      }
      const idPersona = personaInserted.id;

      // 6. Obtener ID del rol "REPRESENTANTE LEGAL"
      const { data: rolData, error: rolError } = await this.supabase
        .from('Rol')
        .select('id')
        .eq('valor', 'REPRESENTANTE LEGAL')
        .single();

      if (rolError || !rolData) {
        logger.error('Error al obtener rol:', rolError);
        return { success: false, error: 'Rol de representante legal no encontrado' };
      }
      const idRol = rolData.id;

      // 7. Insertar usuario
      const usuarioData = {
        idPersona: idPersona,
        email: representanteLegal.email,
        idRol: idRol
      };

      const { data: usuarioInserted, error: usuarioError } = await this.supabase
        .from('Usuario')
        .insert(usuarioData)
        .select()
        .single();

      if (usuarioError || !usuarioInserted) {
        logger.error('Error al insertar usuario:', usuarioError);
        return { success: false, error: 'Error al crear usuario en la base de datos' };
      }
      const idUsuario = usuarioInserted.id;

      // 8. Insertar representante legal específico con referencias a IDs
      const representanteLegalData = {
        idUsuario: idUsuario,
        idRelacion: idTipoRelacion,
        idDireccion: idDireccion,
        celular: representanteLegal.numeroCelular,
        viveConEstudiante: representanteLegal.viveConEstudiante,
        idEstudiante: null // Por ahora null, se asignará cuando se relacione con un estudiante
      };

      const { data: rlInserted, error: rlError } = await this.supabase
        .from('RepresentanteLegal')
        .insert(representanteLegalData)
        .select()
        .single();

      if (rlError || !rlInserted) {
        logger.error('Error al insertar representante legal:', rlError);        return { success: false, error: 'Error al crear datos específicos del representante legal' };
      }

      // El ID se maneja únicamente en la base de datos, no se asigna al objeto frontend
      logger.info(`Representante legal persistido exitosamente con ID: ${idUsuario}`);
      return { 
        success: true, 
        data: { 
          id: idUsuario,
          idPersona: idPersona,
          idRepresentanteLegal: rlInserted.id,
          idDireccion: idDireccion
        } 
      };

    } catch (error) {
      logger.error('Error inesperado al persistir representante legal:', error);
      return { success: false, error: `Error inesperado: ${error.message}` };
    }
  }/**
 * Persiste los datos del estudiante junto con objetos relacionados
 * @param {object} estudiante - Objeto estudiante a persistir
 * @param {object} objetos - Objetos adicionales relacionados (lugarNacimiento, domicilioActual, representanteLegalInscriptor)
 * @returns {Promise<object>} Resultado de la operación
 */
async persistirEstudiante(estudiante, objetos = {}) {
  try {    const {
      lugarNacimiento,
      domicilioActual,
      representanteLegalInscriptor
    } = objetos;

    // Validar que los objetos relacionados sean válidos
    if (!lugarNacimiento) {
      return { success: false, error: 'Lugar de nacimiento es requerido' };
    }
    if (!domicilioActual) {
      return { success: false, error: 'Domicilio actual es requerido' };
    }
    // Representante legal también obligatorio en este caso
    if (!representanteLegalInscriptor || !representanteLegalInscriptor.id) {
      return { success: false, error: 'Representante legal inválido o no persistido' };
    }

    // Persistir ubicaciones si no tienen ID
    let lugarNacimientoPersistido = lugarNacimiento;
    if (!lugarNacimiento.id) {
      const resultLugar = await this.#persistirUbicacion(lugarNacimiento);
      if (!resultLugar.success) {
        return { success: false, error: `Error al persistir lugar de nacimiento: ${resultLugar.error}` };
      }
      lugarNacimientoPersistido = resultLugar.data;
    }

    let domicilioActualPersistido = domicilioActual;
    if (!domicilioActual.id) {
      const resultDomicilio = await this.#persistirUbicacion(domicilioActual);
      if (!resultDomicilio.success) {
        return { success: false, error: `Error al persistir domicilio actual: ${resultDomicilio.error}` };
      }
      domicilioActualPersistido = resultDomicilio.data;
    }

    // 1. Obtener idSexo consultando tabla Sexo
    const { data: sexoData, error: sexoError } = await this.supabase
      .from('Sexo')
      .select('id')
      .eq('valor', estudiante.sexo)
      .single();

    if (sexoError) {
      return { success: false, error: `Error al obtener idSexo: ${sexoError.message}` };
    }
    if (!sexoData || !sexoData.id) {
      return { success: false, error: `No se encontró el sexo con valor: ${estudiante.sexo}` };
    }
    const idSexo = sexoData.id;

    // 2. Obtener idTipoDocumento consultando tabla TipoDocumento
    const { data: tipoDocData, error: tipoDocError } = await this.supabase
      .from('TipoDocumento')
      .select('id')
      .eq('valor', estudiante.documento.tipo)
      .single();

    if (tipoDocError) {
      return { success: false, error: `Error al obtener idTipoDocumento: ${tipoDocError.message}` };
    }
    if (!tipoDocData || !tipoDocData.id) {
      return { success: false, error: `No se encontró el tipo de documento con valor: ${estudiante.documento.tipo}` };
    }
    const idTipoDocumento = tipoDocData.id;

    // 3. Insertar en tabla Persona
    const personaData = {
      nombres: estudiante.nombres,
      aPaterno: estudiante.aPaterno,
      aMaterno: estudiante.aMaterno || null,
      idSexo: idSexo,
      fechaNacimiento: new Date(estudiante.fechaNacimiento).toISOString().split('T')[0],
      idDocumento: idTipoDocumento,
      nroDocumento: estudiante.documento.numero
    };

    const { data: personaInserted, error: personaError } = await this.supabase
      .from('Persona')
      .insert(personaData)
      .select()
      .single();

    if (personaError) {
      return { success: false, error: `Error al crear persona: ${personaError.message}` };
    }
    const idPersona = personaInserted.id;

    // 4. Obtener idRol para "ESTUDIANTE"
    const { data: rolData, error: rolError } = await this.supabase
      .from('Rol')
      .select('id')
      .eq('valor', 'ESTUDIANTE')
      .single();

    if (rolError) {
      return { success: false, error: `Error al obtener rol: ${rolError.message}` };
    }
    if (!rolData || !rolData.id) {
      return { success: false, error: `No se encontró el rol ESTUDIANTE` };
    }
    const idRol = rolData.id;

    // 5. Insertar en tabla Usuario
    const usuarioData = {
      idPersona: idPersona,
      email: estudiante.email || null, // Si tienes email
      idRol: idRol
    };

    const { data: usuarioInserted, error: usuarioError } = await this.supabase
      .from('Usuario')
      .insert(usuarioData)
      .select()
      .single();

    if (usuarioError) {
      return { success: false, error: `Error al crear usuario: ${usuarioError.message}` };
    }
    const idUsuario = usuarioInserted.id;
      // 6. Insertar en tabla Estudiante con referencias a objetos relacionados
    const estudianteData = {
      idUsuario: idUsuario,
      idLugarNacimiento: lugarNacimientoPersistido.id,
      idDomicilioActual: domicilioActualPersistido.id,
      tieneDiscapacidad: estudiante.tieneDiscapacidad || false,
      tieneDispositivosElectronicos: estudiante.tieneDispositivosElectronicos,
      tieneInternet: estudiante.tieneInternet,
      idRepresentanteLegalInscriptor: representanteLegalInscriptor.id
    };

    const { error: estudianteError } = await this.supabase
      .from('Estudiante')
      .insert(estudianteData);

    if (estudianteError) {
      return { success: false, error: `Error al crear estudiante: ${estudianteError.message}` };
    }

    return {
      success: true,
      message: 'Estudiante registrado exitosamente',
      data: { idPersona, idUsuario }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
  /**
   * Persiste una ubicación en la base de datos
   * @param {Ubicacion} ubicacion - Objeto ubicación a persistir
   * @returns {Promise<object>} Resultado con el ID de la ubicación persistida
   * @private
   */
  async #persistirUbicacion(ubicacion) {
    try {
      const ubicacionData = {
        direccion: ubicacion.direccion
      };

      const { data: ubicacionInserted, error: ubicacionError } = await this.supabase
        .from('Ubicacion')
        .insert(ubicacionData)
        .select()
        .single();

      if (ubicacionError) {
        logger.error('Error al persistir ubicación', ubicacionError);
        return { success: false, error: `Error al persistir ubicación: ${ubicacionError.message}` };
      }

      return { 
        success: true, 
        data: { id: ubicacionInserted.id, direccion: ubicacionInserted.direccion }
      };
    } catch (error) {
      logger.error('Error inesperado al persistir ubicación', error);
      return { success: false, error: error.message };
    }
  }

}

export default UsuarioPersistence;
