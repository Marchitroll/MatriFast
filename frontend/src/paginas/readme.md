# 📁 páginas

Aquí están las pantallas completas de la aplicación.

Cada archivo representa una vista o página, como:

- La página para iniciar sesión.
- La página para registrar una matrícula.
- La página para ver la lista de estudiantes.

Estas páginas juntan los componentes (botones, formularios, etc.) y la funcionalidad (consultas, registros) para mostrarle al usuario lo que necesita y permitirle interactuar con el sistema.

## 📄 Register.jsx

### Descripción
Implementa el formulario de registro de usuarios en la plataforma MatriFast. Soporta diferentes tipos de usuarios (principalmente Docente y Representante Legal) con campos dinámicos según el rol seleccionado.

### Flujo de datos del registro de usuario

#### 1. **Captura de datos en la UI (`Register.jsx`)**
   - Utiliza el hook personalizado `useRegisterForm()` que encapsula toda la lógica del formulario.
   - **Campos comunes**: email, password, confirmPassword, role.
   - **Campos específicos por rol**: Se almacenan en `roleSpecificData` mediante `handleRoleSpecificDataChange()`.
   - **Renderizado condicional**: Muestra `DocenteFields` o `RepresentanteLegalFields` según el rol seleccionado.

#### 2. **Validación inicial (`useRegisterForm.js` - `handleSubmit()`)**
   ```
   Validaciones comunes → Validaciones específicas → Procesamiento
   ```
   - **Validaciones comunes**: Email formato válido, contraseña > 6 caracteres, coincidencia de contraseñas, rol seleccionado.
   - **Validaciones específicas**: Delega a `UsuarioService.validarCamposRequeridos()` que usa `UsuarioValidator`.

#### 3. **Registro en sistema de autenticación (`AuthContext.jsx`)**
   - Llama a `registrarNuevoUsuario(email, password)` del `AuthContext`.
   - Internamente ejecuta `supabase.auth.signUp()` para crear el usuario en Supabase Auth.
   - **Resultado**: Obtiene `authUserId` del usuario recién creado.

#### 4. **Creación de objetos de dominio (`UsuarioService.js` → `UsuarioCreator.js`)**
   
   **4.1. Orquestación en UsuarioService:**
   ```
   registrarUsuarioCompleto() → registrarUsuario() → UsuarioCreator.crearUsuario()
   ```
   
   **4.2. Creación de objetos en UsuarioCreator según el rol:**
   
   **Para DOCENTE:**
   - Crea objeto `Documento` (tipo, número, validación)
   - Usa `DocenteFactory.crearUsuario()` para crear instancia de `Docente`
   
   **Para ESTUDIANTE:**
   - Crea objeto `Documento`
   - Crea dos objetos `Ubicacion` (lugar de nacimiento y domicilio actual)
   - Crea objeto `Lenguas` (perfil lingüístico)
   - Crea objeto `RepresentanteLegal` (datos del inscriptor)
   - Usa `EstudianteFactory.crearUsuario()` para crear instancia de `Estudiante`
   
   **Para REPRESENTANTE LEGAL:**
   - Crea objeto `Documento`
   - Crea objeto `Ubicacion`
   - Crea objeto `Lenguas`
   - Usa `RepresentanteLegalFactory.crearUsuario()` para crear instancia de `RepresentanteLegal`

#### 5. **Persistencia en base de datos (`UsuarioPersistence.js`)**
   
   **5.1. Flujo de persistencia para DOCENTE:**
   ```
   1. Obtener IDs de catálogos (idSexo, idTipoDocumento)
   2. Insertar en tabla Persona → obtener idPersona
   3. Obtener idRol para "DOCENTE"
   4. Insertar en tabla Usuario (idPersona, email, idRol) → obtener idUsuario
   5. Insertar en tabla Docente (idUsuario)
   ```
   
   **5.2. Flujo de persistencia para ESTUDIANTE:**
   ```
   Similar a docente, pero inserta en tabla Estudiante con objetos relacionados
   ```
   
   **5.3. REPRESENTANTE LEGAL:**
   ```
   Persistencia aún no implementada (retorna error controlado)
   ```

#### 6. **Manejo de resultados y retroalimentación**
   - **Éxito**: Se actualiza `registroCompleto = true` en `useRegisterForm`.
   - **Error**: Se actualiza el estado `error` que se muestra en la UI.
   - **Logging**: Se registra cada paso del proceso mediante `Logger.js`.

#### 7. **Arquitectura del flujo de datos**
   ```
   Register.jsx (UI)
        ↓
   useRegisterForm.js (Estado y lógica)
        ↓
   AuthContext.jsx (Autenticación)
        ↓
   UsuarioService.js (Orquestación)
        ↓
   UsuarioCreator.js (Creación de objetos)
        ↓
   UsuarioPersistence.js (Persistencia BD)
   ```

**Nota importante**: El flujo actual registra primero en Supabase Auth y luego procesa los objetos de dominio. Si hay errores en la creación de objetos o persistencia, el usuario queda registrado en Auth pero sin datos completos en BD (esto requiere manejo de rollback en futuras versiones).

### Arquitectura

- **Patrón de diseño**: Implementa Factory Pattern mediante `DocenteFactory` y `RepresentanteLegalFactory`.
- **Gestión de estado**: Hooks personalizados para separar la lógica de presentación.
- **Validaciones**: Centralizadas en servicios para facilitar su mantenimiento.
- **Renderizado condicional**: Muestra componentes específicos según el rol seleccionado.

### Interacción con otros componentes

- `AuthPageLayout`: Para la estructura general de la página.
- `AuthFormField`: Para campos de formulario estandarizados.
- `RoleSelect`: Para la selección de rol.
- `DocenteFields` y `RepresentanteLegalFields`: Para campos específicos según rol.
