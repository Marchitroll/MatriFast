import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsuarioServiceClass from '../src/servicios/UsuarioService';

// Mock explícito de la clase UsuarioPersistence usada dentro del servicio
vi.mock('../src/servicios/UsuarioPersistence', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      actualizarDocente: vi.fn().mockResolvedValue({
        success: true,
        data: {
          id: 1,
          nombres: 'Juan',
          aPaterno: 'Pérez',
          aMaterno: 'Lopez',
          tipoDocumento: 'DNI',
          numeroDocumento: '12345678',
        },
      }),
      actualizarRepresentanteLegal: vi.fn().mockResolvedValue({
        success: true,
        data: {
          id: 2,
          nombres: 'Lucía',
          aPaterno: 'Ramírez',
          aMaterno: 'Quispe',
          tipoDocumento: 'DNI',
          numeroDocumento: '87654321',
        },
      }),
    })),
  };
});

describe('UsuarioService', () => {
  let service;

  beforeEach(() => {
    service = new UsuarioServiceClass(); // Instancia real con mocks en persistencia
  });

  it('actualiza un docente correctamente', async () => {
    const data = {
      id: 1,
      nombres: 'Juan',
      aPaterno: 'Pérez',
      aMaterno: 'Lopez',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
    };

    const result = await service.actualizarUsuario('DOCENTE', data);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.nombres).toBe('Juan');
  });

  it('retorna error si el rol no es válido', async () => {
    const result = await service.actualizarUsuario('INVALIDO', {});

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
