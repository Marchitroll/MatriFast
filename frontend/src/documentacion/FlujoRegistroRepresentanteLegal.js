/**
 * DOCUMENTACIÓN: Flujo completo de registro de Representante Legal
 * 
 * Este archivo documenta el flujo completo implementado para el registro
 * de usuarios tipo "REPRESENTANTE LEGAL" en MatriFast.
 */

// ============================================================================
// 1. INTERFAZ DE USUARIO (Register.jsx)
// ============================================================================

/*
El usuario accede a /register y:
1. Selecciona rol "REPRESENTANTE LEGAL" en el dropdown
2. Se renderiza automáticamente el componente RepresentanteLegalFields
3. Llena todos los campos requeridos:
   - Datos personales: nombres, apellidos, fecha nacimiento, sexo
   - Documento: tipo (desde enum Supabase) y número
   - Tipo de relación: desde enum de base de datos
   - Número de celular: formato peruano (9 dígitos)
   - Dirección: texto simple
   - Checkbox: ¿Vive con el estudiante?
*/

// ============================================================================
// 2. CAMPOS ESPECÍFICOS (RepresentanteLegalFields.jsx)
// ============================================================================

/*
Componente que maneja:
- Estados de carga para enums (useEffect + useState)
- Validaciones en tiempo real
- Dropdowns poblados desde Supabase:
  * Sexos (M, F)
  * Tipos de documento (DNI, CE, PTP)
  * Tipos de relación (PADRE, MADRE, TUTOR, etc.)
- Campos específicos de RL:
  * Número de celular con validación formato peruano
  * Dirección
  * Checkbox viveConEstudiante
*/

// ============================================================================
// 3. GESTIÓN DE ESTADO (useRegisterForm.js)
// ============================================================================

/*
Hook que coordina:
- Estados comunes: email, password, confirmPassword, role
- Estados específicos: roleSpecificData (objeto dinámico según rol)
- Validaciones: campos comunes y específicos por rol
- Proceso de envío: handleSubmit()

Flujo del envío:
1. Validar campos comunes (email, password, etc.)
2. Llamar al UsuarioService.registrarUsuarioCompleto()
3. Si persistencia exitosa → registrar en Supabase Auth
4. Mostrar resultado al usuario
*/

// ============================================================================
// 4. ORQUESTACIÓN (UsuarioService.js)
// ============================================================================

/*
Fachada que coordina:
1. Validación exhaustiva (UsuarioValidator)
2. Creación de objetos (UsuarioCreator)
3. Persistencia (UsuarioPersistence)

Método principal:
await usuarioService.registrarUsuarioCompleto(
  { email, password, role: "REPRESENTANTE LEGAL" }, 
  {
    nombres, aPaterno, aMaterno, fechaNacimiento, sexo,
    tipoDocumento, numeroDocumento,
    tipoRelacion, numeroCelular, direccion, viveConEstudiante
  }
);
*/

// ============================================================================
// 5. VALIDACIÓN (UsuarioValidator.js)
// ============================================================================

/*
Campos requeridos para REPRESENTANTE LEGAL:
[
  'nombres', 'aPaterno', 'fechaNacimiento', 'sexo',     // Persona
  'tipoDocumento', 'numeroDocumento',                   // Documento
  'tipoRelacion', 'numeroCelular',                      // RL específico
  'direccion'                                           // Ubicacion
]

Validaciones adicionales:
- Formato de email
- Longitud de password
- Coincidencia de passwords
- Presencia de todos los campos requeridos
*/

// ============================================================================
// 6. CREACIÓN DE OBJETOS (UsuarioCreator.js)
// ============================================================================

/*
Proceso usando Factory Pattern:

1. Crear Documento:
   new Documento(tipoDocumento, numeroDocumento)

2. Crear Ubicacion:
   new Ubicacion(direccion)

3. Crear RepresentanteLegal usando Factory:
   this.representanteLegalFactory.crearUsuario(
     'id-pendiente', nombres, aPaterno, aMaterno,
     fechaNacimiento, sexo, documento, email, role,
     tipoRelacion, ubicacion, numeroCelular, viveConEstudiante
   );

Retorna: { 
  success: true, 
  data: { representanteLegal, documento, ubicacion }
}
*/

// ============================================================================
// 7. PERSISTENCIA (UsuarioPersistence.js)
// ============================================================================

/*
Secuencia de inserción en base de datos:

1. Obtener IDs de catálogos:
   - idSexo (tabla Sexo)
   - idTipoDocumento (tabla TipoDocumento)
   - idTipoRelacion (tabla TipoRelacion)

2. Insertar en tabla Ubicacion:
   INSERT INTO Ubicacion (direccion)
   RETURNS idDireccion

3. Insertar en tabla Persona:
   INSERT INTO Persona (nombres, aPaterno, aMaterno, idSexo, 
                        fechaNacimiento, idDocumento, nroDocumento)

4. Obtener idRol para "REPRESENTANTE LEGAL"

5. Insertar en tabla Usuario:
   INSERT INTO Usuario (idPersona, email, idRol)

6. Insertar en tabla RepresentanteLegal:
   INSERT INTO RepresentanteLegal (idUsuario, idRelacion, idDireccion,
                                   celular, viveConEstudiante, idEstudiante)
   
   Nota: idEstudiante se deja como NULL inicialmente y se asigna 
         cuando se establezca la relación con un estudiante específico

7. Actualizar objeto con ID real de BD
*/

// ============================================================================
// 8. AUTENTICACIÓN FINAL (AuthContext.jsx)
// ============================================================================

/*
Solo si persistencia fue exitosa:
1. Crear usuario en Supabase Auth
2. Establecer sesión
3. Usuario puede acceder a la aplicación

Si falla la persistencia, NO se crea en Auth (evita usuarios huérfanos)
*/

// ============================================================================
// EJEMPLO DE USO COMPLETO
// ============================================================================

/*
// 1. Usuario llena formulario en /register
const datosFormulario = {
  // Datos comunes
  email: "juan.perez@email.com",
  password: "password123",
  role: "REPRESENTANTE LEGAL",
  
  // Datos específicos de RL
  nombres: "Juan Carlos",
  aPaterno: "Pérez",
  aMaterno: "García", 
  fechaNacimiento: "1985-05-15",
  sexo: "M",
  tipoDocumento: "DNI",
  numeroDocumento: "12345678",
  tipoRelacion: "PADRE",
  numeroCelular: "987654321",
  direccion: "Av. Lima 123, Distrito Centro",
  viveConEstudiante: true
};

// 2. El sistema procesa automáticamente:
//    - Valida campos
//    - Crea objetos de dominio
//    - Persiste en BD (5 tablas)
//    - Registra en Auth
//    - Usuario puede usar la aplicación

// 3. Resultado en base de datos:
//    Persona: ID=101, nombres="Juan Carlos", aPaterno="Pérez"...
//    Usuario: ID=201, email="juan.perez@email.com", idRol=3...
//    RepresentanteLegal: ID=301, idUsuario=201, tipoRelacion="PADRE"...
*/

// ============================================================================
// ESTRUCTURA DE ARCHIVOS MODIFICADOS/UTILIZADOS
// ============================================================================

/*
NUEVOS/MODIFICADOS:
✓ UsuarioPersistence.js → persistirRepresentanteLegal() implementado

EXISTENTES UTILIZADOS:
✓ RepresentanteLegalFactory.js → Factory pattern
✓ RepresentanteLegalFields.jsx → Formulario con enums async
✓ UsuarioCreator.js → crearObjetoRepresentanteLegal()
✓ UsuarioService.js → case 'REPRESENTANTE LEGAL'
✓ UsuarioValidator.js → validaciones específicas
✓ Register.jsx → integración del componente
✓ useRegisterForm.js → manejo de estado

ENUMS UTILIZADOS (con EnumService):
✓ TiposRelacion.js → PADRE, MADRE, TUTOR...
✓ TiposDocumento.js → DNI, CE, PTP...
✓ Sexos.js → M, F
✓ RolesUsuario.js → REPRESENTANTE LEGAL
*/

export default {
  description: "Flujo completo de registro de Representante Legal implementado y funcional"
};
