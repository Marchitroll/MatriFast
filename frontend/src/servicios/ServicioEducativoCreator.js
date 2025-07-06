import ServicioEducativo from '../modelos/ServicioEducativo.js';

export const ServicioEducativoCreator = {
  crear(dto) {
    return new ServicioEducativo(dto);        // dto ya trae los 6 campos exactos
  }
};
