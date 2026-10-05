import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsuarioPersistence from '../../src/services/UsuarioPersistence';

describe('UsuarioPersistence', () => {
  let persistence;
  let mockDocenteRepo;
  let mockRlRepo;

  beforeEach(() => {
    mockDocenteRepo = {
      persistir: vi.fn().mockResolvedValue({ success: true, data: { id: 10 } }),
      actualizar: vi.fn().mockResolvedValue({ success: true })
    };
    mockRlRepo = {
      persistir: vi.fn().mockResolvedValue({ success: true, data: { id: 20 } }),
      actualizar: vi.fn().mockResolvedValue({ success: true })
    };

    persistence = new UsuarioPersistence(mockDocenteRepo, mockRlRepo);
  });

  describe('persistir()', () => {
    it('debería delegar al repositorio de docente cuando el rol es DOCENTE', async () => {
      const usuarioDocente = { rol: 'DOCENTE', nombres: 'Carlos' };
      const res = await persistence.persistir(usuarioDocente);

      expect(mockDocenteRepo.persistir).toHaveBeenCalledWith(usuarioDocente);
      expect(res.success).toBe(true);
    });

    it('debería delegar al repositorio de representante legal cuando el rol es REPRESENTANTE LEGAL', async () => {
      const usuarioRl = { rol: 'REPRESENTANTE LEGAL', nombres: 'Elena' };
      const res = await persistence.persistir(usuarioRl);

      expect(mockRlRepo.persistir).toHaveBeenCalledWith(usuarioRl);
      expect(res.success).toBe(true);
    });

    it('debería retornar error para rol no soportado', async () => {
      const res = await persistence.persistir({ rol: 'OTRO_ROL' });
      expect(res.success).toBe(false);
      expect(res.error).toContain('no soportado');
    });
  });

  describe('actualizar()', () => {
    it('debería delegar actualización a docente repo', async () => {
      const res = await persistence.actualizar({ rol: 'DOCENTE', id: 10 });
      expect(mockDocenteRepo.actualizar).toHaveBeenCalled();
      expect(res.success).toBe(true);
    });

    it('debería delegar actualización a representante legal repo', async () => {
      const res = await persistence.actualizar({ rol: 'REPRESENTANTE LEGAL', id: 20 });
      expect(mockRlRepo.actualizar).toHaveBeenCalled();
      expect(res.success).toBe(true);
    });
  });
});
