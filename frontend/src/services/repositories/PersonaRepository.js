/**
 * Repositorio para persistencia de Persona
 */
import BaseRepository from './BaseRepository';
import logger from '../Logger';

class PersonaRepository extends BaseRepository {
  /**
   * Crea una persona en la base de datos
   * @returns {Promise<{id: number}>}
   */
  async crear(persona) {
    const idSexo = await this.getEnumId('Sexo', persona.sexo);
    const idTipoDocumento = await this.getEnumId('TipoDocumento', persona.documento.tipo);

    const datos = {
      nombres: persona.nombres,
      aPaterno: persona.aPaterno,
      aMaterno: persona.aMaterno || null,
      idSexo,
      fechaNacimiento: new Date(persona.fechaNacimiento).toISOString().split('T')[0],
      idDocumento: idTipoDocumento,
      nroDocumento: persona.documento.numero
    };

    const result = await this.insert('Persona', datos);
    logger.info('Persona creada', { id: result.id });
    return result;
  }

  /**
   * Actualiza una persona existente
   */
  async actualizar(idPersona, datosPersona) {
    const updateData = {};
    
    if (datosPersona.nombres) updateData.nombres = datosPersona.nombres;
    if (datosPersona.aPaterno) updateData.aPaterno = datosPersona.aPaterno;
    if (datosPersona.aMaterno !== undefined) updateData.aMaterno = datosPersona.aMaterno;
    if (datosPersona.fechaNacimiento) {
      updateData.fechaNacimiento = new Date(datosPersona.fechaNacimiento).toISOString().split('T')[0];
    }
    if (datosPersona.documento?.numero) {
      updateData.nroDocumento = datosPersona.documento.numero;
    }
    if (datosPersona.sexo) {
      updateData.idSexo = await this.getEnumId('Sexo', datosPersona.sexo);
    }
    if (datosPersona.documento?.tipo) {
      updateData.idDocumento = await this.getEnumId('TipoDocumento', datosPersona.documento.tipo);
    }

    return this.update('Persona', idPersona, updateData);
  }
}

export default PersonaRepository;
