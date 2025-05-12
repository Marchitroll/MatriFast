/**
 * Enumeración de los tipos de documento permitidos.
 */
const TIPOS_DOCUMENTO = Object.freeze({
    DNI: 'DNI',
    CE: 'CE', // Carné de Extranjería
    PTP: 'PTP', // Permiso Temporal de Permanencia
    CODIGO_ESTUDIANTE: 'CODIGO_ESTUDIANTE',
    OTRO: 'OTRO' // Para otros tipos de documentos no especificados. Usará ValidadorGenerico
});

export default TIPOS_DOCUMENTO;
