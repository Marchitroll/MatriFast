import { describe, it, expect,beforeEach, vi } from 'vitest'
import Documento from '../src/modelos/Documento.js'
// para hacer los test de matriculaService, estudianteCreator y EstudiantePersistence
import { registrarMatricula } from '../src/servicios/MatriculaService.js';
const { default: EstudianteCreator }     = await import('../src/servicios/EstudianteCreator.js');
const { default: EstudiantePersistence } = await import('../src/servicios/EstudiantePersistence.js');
const supabase = (await import('../src/config/ClienteSupabase.js'));
//importaciones para test de Estudiante 
import EstudiantePersistence from '../src/servicios/EstudiantePersistence.js';
import { ServicioEducativoPersistence } from  '../src/servicios/ServicioEducativoPersistence.js';




describe('Documento', () => {
  describe('Constructor', () => {
    it('debería crear un documento válido con tipo DNI', () => {
      const documento = new Documento('DNI', '12345678')
      expect(documento.tipo).toBe('DNI')
      expect(documento.numero).toBe('12345678')
    })

    it('debería lanzar error si el tipo es null', () => {
      expect(() => {
        new Documento(null, '12345678')
      }).toThrow('El tipo de documento no puede ser nulo o indefinido')
    })

    it('debería lanzar error si el número es null', () => {
      expect(() => {
        new Documento('DNI', null)
      }).toThrow('El número de documento no puede ser nulo o indefinido')
    })

    it('debería lanzar error para un número de DNI inválido', () => {
      expect(() => {
        new Documento('DNI', '123')
      }).toThrow('El número "123" no es válido para el tipo de documento "DNI".')
    })
  })
})

/*
//matriculaService
// ─── mockearemos el EstudianteCreator porque tiene datos precargados como el rol "ESTUDIANTE"
jest.mock('../src/servicios/EstudianteCreator.js', () => ({
  default: { crear: jest.fn(() => ({ alumno: true })) }
}));
jest.mock('../src/servicios/EstudiantePersistence.js', () => ({
  default: { persistirEstudiante: jest.fn(() => Promise.resolve(111)) }
}));
jest.mock('../src/config/ClienteSupabase.js', () => {
  const insert = jest.fn();
  return { default: { from: () => ({ insert }) } };
});



//crear datos para pasar por el documento.nombre, documento.idNivel, documento.idModalidad
const dtoOK   = { nombres: 'Ana', idNivel: 1, idModalidad: 2 };
const error= 77;//cualquier numero como generico para forzar el error 
describe('registrarMatricula – pruebas de caja blanca', () => {
  beforeEach(() => {
    // profundidad de camino: insert devuelve id 999 por sea caso tenga algunos datos al inicio
    //acá se mockea la conexion al supabase para ingrearle datos, se usará mas adelante tambien para ver si se logra hacer inserts de persistencia
    supabase.from().insert.mockResolvedValue({ data: [{ id: 999 }], error: null });
  });

  // 1 ─ Validación inicial 
  it('lanza si faltan campos requeridos',  () => {
    const dto = { ...dtoOK };
     dto.nombres = null
  expect(registrarMatricula(dto, error))
  .toThrow('Campos requeridos faltantes');
  });

  // 2 ─ EstudianteCreator falla : recordar que se usó un try/catch
  it('propaga error de EstudianteCreator',  () => {
    EstudianteCreator.crear.mockImplementation(() => { throw new Error('boom'); });
     expect(registrarMatricula(dtoOK, error))
      .toThrow('No se pudo crear la entidad Estudiante: boom');
  });

  // 3 ─ EstudiantePersistence falla : recordar que se usó un try/catch
  it('propaga error de EstudiantePersistence',  () => {
    EstudiantePersistence.persistirEstudiante.mockRejectedValue(new Error('db down'));
     expect(registrarMatricula(dtoOK, error))
      .toThrow('Error al guardar el estudiante: db down');
  });

  // 4 ─ Supabase devuelve error si el supabase no devuelve el insert de la matricula
  it('lanza si Supabase devuelve error al insertar matrícula',  () => {
    supabase.from().insert.mockResolvedValue({ data: null, error: { code: '77' } });
     expect(registrarMatricula(dtoOK, error))
      .toThrow('Error desconocido al insertar matrícula');
  });

  // 5 ─ Supabase no devuelve filas: Esto es para un error en el supabase aun cuando se ingresó el insert correcto
  it('lanza si Supabase responde sin filas',  () => {
    supabase.from().insert.mockResolvedValue({ data: [], error: null });
     expect(registrarMatricula(dtoOK, error))
      .toThrow('Supabase no devolvió la fila de Matrícula insertada');
  });
// 6. Camino cuando todo es correcto
  it('devuelve idMatricula cuando todo es correcto', async () => {
  supabase.from().insert.mockResolvedValue({ data: [{ id: 999 }], error: null });

  const resp = await registrarMatricula(dtoOK, error);

  expect(resp).toEqual({ dtOk: true, idMatricula: 999 });
});
});

//CREACION DE TEST DE CREACION DE USUARIO
//── Mocks ───────────────────────────────────────────────────── 

// 1) Mock de Supabase para usarlo en los test
const insertFn = vi.fn();       // reutilizamos la misma función insert
const supabaseFrom = vi.fn(() => ({ insert: insertFn }));
vi.mock('../src/config/ClienteSupabase.js', () => ({
  default: { from: supabaseFrom }
}));

// 2) Mock de ServicioEducativoPersistence
vi.mock('../src/servicios/ServicioEducativoPersistence.js', () => ({
  ServicioEducativoPersistence: { persistir: vi.fn() }
}));


// Documentos de base válido 
const estOK = {
  persona: { toPlain: () => ({ nombres: 'Ana' }) },
  servicioEducativo: { any: true },
  toPlain: (idU, idS) => ({ idUsuario: idU, idServicioEducativo: idS })
};

// Creacion de datos mockeados para asegurar la insertacion del Estudiante
function InsertacionDelEstudiante() {

  // Persona → Usuario → Estudiantes
  insertFn
    .mockResolvedValueOnce({ data: { id: 10 }, error: null }) // Persona
    .mockResolvedValueOnce({ data: { id: 20 }, error: null }) // Usuario
    .mockResolvedValueOnce({ data: { id: 30 }, error: null }); // Estudiantes
}



describe('persistirEstudiante – 5 casos clave', () => {
  // 1. Documento incompleto: falta persona o servicioEducativo 
  it('lanza error cuando el objeto Estudiante está incompleto',  () => {
     expect(
      EstudiantePersistence.persistirEstudiante({})
    ).toThrow('incompleto');
  });

  // 2. idServicioEducativo no retornado 
  it('lanza si persistir devuelve idServicioEducativo null',  () => {
    InsertacionDelEstudiante();
    ServicioEducativoPersistence.persistir.mockResolvedValue(null);

     expect(
      EstudiantePersistence.persistirEstudiante(estOK)
    ).toThrow('idServicioEducativo');
  });

  // 3 Supabase falla al insertar Persona 
  it('lanza si Supabase devuelve error al insertar Persona', async () => {
    InsertacionDelEstudiante();
    insertFn
      .mockResolvedValueOnce({ data: null, error: { message: 'boomP' } }); // Persona

    await expect(
      EstudiantePersistence.persistirEstudiante(estOK)
    ).rejects.toThrow('persona no pudo ser creado');
  });

  // 4. Supabase falla al insertar Usuario 
  it('propaga error si falla el insert de Usuario',  () => {
    InsertacionDelEstudiante();
    // Persona OK
    insertFn
      .mockResolvedValueOnce({ data: { id: 10 }, error: null })             // Persona
      .mockResolvedValueOnce({ data: null, error: new Error('uFail') });    // Usuario

     expect(
      EstudiantePersistence.persistirEstudiante(estOK)
    ).toThrow('uFail');
  });
  //5. falla en insertar en el Supabase el Estudiante

    it('lanza si inserción en Estudiantes falla',  () => {
    InsertacionDelEstudiante() //soloen este caso, mockeamos tambien la falla del estudiante para que pueda crear la falla en persistir
    //por eso remockeamos todo 
    insertFn
      .mockResolvedValueOnce({ data: { id: 10 }, error: null }) // Persona
      .mockResolvedValueOnce({ data: { id: 20 }, error: null }) // Usuario
      .mockResolvedValueOnce({ data: null, error: { message: 'eFail' } }) // Est

     expect(
      EstudiantePersistence.persistirEstudiante(estOK)
    ).toThrow('eFail')
  })

    // 6. Persistir Estudiante de manera exitosa
  it('devuelve idEstudiante (30) cuando todo es correcto',  () => {
    InsertacionDelEstudiante();

    const id =  EstudiantePersistence.persistirEstudiante(estOK);

    expect(id).toBe(30);
    expect(ServicioEducativoPersistence.persistir).toHaveBeenCalledWith(
      estOK.servicioEducativo
    );
    expect(insertFn).toHaveBeenCalledTimes(3);      // Persona, Usuario, Est
  });
});
*/
