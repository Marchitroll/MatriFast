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

### Flujo de trabajo

1. **Inicialización y estado**:
   - Utiliza el hook personalizado `useRegisterForm()` que encapsula toda la lógica del formulario.
   - Controla campos como email, password, role y datos específicos según el rol.

2. **Validación de sesión**:
   - Si el usuario ya tiene una sesión activa, lo redirige a la página principal.

3. **Renderizado del formulario**:
   - Muestra campos comunes para todos los usuarios (email, contraseña).
   - Incluye selector de rol con `RoleSelect`.
   - Renderiza dinámicamente campos específicos según el rol:
     - `DocenteFields` para el rol DOCENTE.
     - `RepresentanteLegalFields` para el rol REPRESENTANTE LEGAL.

4. **Gestión de datos**:
   - Los cambios en campos comunes actualizan su estado respectivo.
   - Los cambios en campos específicos actualizan el objeto `roleSpecificData`.

5. **Envío del formulario**:
   - Valida los campos comunes y específicos.
   - Crea las instancias de objetos necesarias mediante servicios:
     - Para DOCENTE: `Documento` y `Docente`.
     - Para REPRESENTANTE LEGAL: `Documento`, `Ubicacion`, `Lenguas` y `RepresentanteLegal`.
   - Muestra los objetos creados en consola (sin persistencia en base de datos).
   - Maneja apropiadamente los posibles errores.

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
