import { describe, it, expect, vi } from 'vitest';
import PersonaRepository from '../../../src/services/repositories/PersonaRepository';

describe('PersonaRepository', () => {
  it('debe crear una persona convirtiendo enums y fechas adecuadamente', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation((tabla) => {
        if (tabla === 'Sexo') {
          return {
            select: () => ({ eq: () => ({ single: async () => ({ data: { id: 1 }, error: null }) }) })
          };
        }
        if (tabla === 'TipoDocumento') {
          return {
            select: () => ({ eq: () => ({ single: async () => ({ data: { id: 2 }, error: null }) }) })
          };
        }
        if (tabla === 'Persona') {
          return {
            insert: () => ({
              select: () => ({ single: async () => ({ data: { id: 100 }, error: null }) })
            })
          };
        }
        return {};
      })
    };

    const repo = new PersonaRepository(mockSupabase);
    const mockPersona = {
      nombres: 'Juan',
      aPaterno: 'Perez',
      aMaterno: 'Gomez',
      sexo: 'MASCULINO',
      fechaNacimiento: '1990-05-15',
      documento: { tipo: 'DNI', numero: '12345678' }
    };

    const res = await repo.crear(mockPersona);
    expect(res).toEqual({ id: 100 });
  });

  it('debe actualizar persona filtrando solo los campos proporcionados', async () => {
    let updateCalledWith = null;
    const mockSupabase = {
      from: vi.fn().mockImplementation((tabla) => {
        if (tabla === 'Sexo') {
          return { select: () => ({ eq: () => ({ single: async () => ({ data: { id: 1 }, error: null }) }) }) };
        }
        if (tabla === 'Persona') {
          return {
            update: (datos) => {
              updateCalledWith = datos;
              return { eq: async () => ({ error: null }) };
            }
          };
        }
        return {};
      })
    };

    const repo = new PersonaRepository(mockSupabase);
    await repo.actualizar(50, { nombres: 'Carlos', sexo: 'MASCULINO' });

    expect(updateCalledWith).toEqual({ nombres: 'Carlos', idSexo: 1 });
  });
});
