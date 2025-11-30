# MatriFast 🎓

[![Tests](https://img.shields.io/badge/tests-209%20passed-brightgreen)](https://github.com/Marchitroll/MatriFast)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Sistema de gestión de matrículas escolares para el sistema educativo peruano.

## 📋 Descripción

**MatriFast** es una aplicación web moderna que permite gestionar el proceso de matrícula escolar, incluyendo:
- Registro de docentes y representantes legales
- Gestión de estudiantes y sus datos
- Llenado de la Ficha Única de Matrícula del SIAGIE
- Asistente virtual con IA para consultas

## 🛠️ Tecnologías

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Frontend | React | 19.2.0 |
| Build Tool | Vite | 7.2.4 |
| Routing | React Router DOM | 7.9.6 |
| Backend | Supabase (PostgreSQL + Auth) | 2.86.0 |
| Testing | Vitest + Testing Library | 4.0.14 |
| Cobertura | @vitest/coverage-v8 | 4.0 |
| Utilidades | peru-utils | 3.2.0 |
| Chatbot | Google Gemini API | - |
| Despliegue | GitHub Pages | - |

## 🏗️ Arquitectura del Proyecto

El proyecto sigue principios **SOLID**, **DRY**, **KISS** y **YAGNI**, implementando una arquitectura modular con patrones de diseño:

```
frontend/
├── src/
│   ├── components/              # Componentes React reutilizables
│   │   ├── common/              # Componentes genéricos
│   │   │   ├── EnumSelect.jsx   # Selector de enumeraciones
│   │   │   ├── FormField.jsx    # Campo de formulario
│   │   │   ├── PasswordInput.jsx # Input de contraseña con toggle
│   │   │   └── SubmitButton.jsx # Botón de envío
│   │   ├── forms/               # Componentes de formularios
│   │   │   ├── DocenteFields.jsx
│   │   │   ├── FormularioMatricula.jsx
│   │   │   ├── PersonaFields.jsx
│   │   │   ├── RepresentanteLegalFields.jsx
│   │   │   └── RoleSelect.jsx
│   │   ├── layout/              # Layouts
│   │   │   └── AuthPageLayout.jsx
│   │   └── Chatbot.jsx          # Asistente virtual con Gemini
│   │
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── Home.jsx             # Página de inicio
│   │   ├── Login.jsx            # Inicio de sesión
│   │   ├── Register.jsx         # Registro de usuarios
│   │   ├── Perfil.jsx           # Perfil de usuario
│   │   └── Formulario.jsx       # Formulario de matrícula
│   │
│   ├── domain/                  # Capa de dominio (lógica de negocio)
│   │   ├── entities/            # Entidades del dominio
│   │   │   ├── Persona.js       # Clase base
│   │   │   ├── Usuario.js       # Usuario del sistema
│   │   │   ├── Docente.js       # Docente (hereda de Persona)
│   │   │   ├── RepresentanteLegal.js
│   │   │   ├── Documento.js     # Documento de identidad
│   │   │   └── Ubicacion.js     # Dirección/ubicación
│   │   │
│   │   ├── builders/            # Patrón Builder
│   │   │   ├── DocenteBuilder.js
│   │   │   └── RepresentanteLegalBuilder.js
│   │   │
│   │   └── validators/          # Validadores de documentos
│   │       ├── ValidadorDocumento.js  # Factory de validadores
│   │       ├── ValidadorDNI.js        # DNI peruano (8 dígitos)
│   │       ├── ValidadorCE.js         # Carné de Extranjería
│   │       ├── ValidadorPTP.js        # Permiso Temporal
│   │       ├── ValidadorCodigoEstudiante.js
│   │       └── ValidadorGenerico.js   # Validador base
│   │
│   ├── services/                # Capa de servicios
│   │   ├── repositories/        # Patrón Repository
│   │   │   ├── BaseRepository.js
│   │   │   ├── DocenteRepository.js
│   │   │   ├── PersonaRepository.js
│   │   │   ├── RepresentanteLegalRepository.js
│   │   │   └── UsuarioRepository.js
│   │   ├── EnumService.js       # Facade para enumeraciones
│   │   ├── GeminiService.js     # Integración con IA
│   │   ├── Logger.js            # Servicio de logging
│   │   ├── UsuarioCreator.js    # Factory de usuarios
│   │   ├── UsuarioPersistence.js
│   │   └── UsuarioService.js
│   │
│   ├── context/                 # Contextos React
│   │   └── AuthContext.jsx      # Autenticación
│   │
│   ├── hooks/                   # Custom Hooks
│   │   ├── useEnums.js          # Hook para enumeraciones
│   │   ├── useEstudianteForm.js # Formulario de estudiante
│   │   ├── useMatriculaForm.js  # Formulario de matrícula
│   │   └── useRegisterForm.js   # Formulario de registro
│   │
│   └── config/                  # Configuración
│       └── ClienteSupabase.js   # Cliente de Supabase
│
└── test/                        # Tests unitarios (18 archivos, 209 tests)
    ├── components/              # Tests de componentes
    ├── domain/                  # Tests de dominio
    │   ├── entities/
    │   ├── builders/
    │   └── validators/
    ├── hooks/                   # Tests de hooks
    ├── services/                # Tests de servicios
    └── setup.js                 # Configuración de tests
```

## 🎨 Patrones de Diseño Implementados

| Patrón | Implementación | Descripción |
|--------|----------------|-------------|
| **Builder** | `DocenteBuilder`, `RepresentanteLegalBuilder` | Construcción fluida de objetos complejos |
| **Strategy** | `UsuarioCreator` | Estrategias de creación según rol |
| **Repository** | `BaseRepository` + repositorios específicos | Abstracción de persistencia con Supabase |
| **Facade** | `EnumService` | API simple para múltiples enumeraciones |
| **Factory** | `ValidadorDocumento` | Creación de validadores según tipo |
| **Template Method** | `ValidadorGenerico` | Algoritmo base de validación |

## 🧪 Testing

El proyecto cuenta con una suite completa de tests unitarios:

```
📊 Cobertura de Tests
├── 18 archivos de test
├── 209 tests pasando
└── ~35% cobertura de código
    ├── components/common: 96%
    ├── domain/entities: 86-98%
    ├── domain/builders: 95%+
    └── domain/validators: 90%+
```

### Ejecutar Tests

```powershell
# Tests en modo watch
npm test

# Tests con interfaz visual
npm run test:ui

# Ejecutar una vez
npm run test:run

# Con reporte de cobertura
npm run test:coverage
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm 9+
- Cuenta de [Supabase](https://supabase.com/) (para backend)
- API Key de [Google Gemini](https://ai.google.dev/) (opcional, para chatbot)

### Pasos

```powershell
# 1. Clonar repositorio
git clone https://github.com/Marchitroll/MatriFast.git
cd MatriFast/frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env con:
```

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_GEMINI_API_KEY=tu_api_key_de_gemini  # Opcional
```

```powershell
# 4. Ejecutar en desarrollo
npm run dev
```

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (http://localhost:5173) |
| `npm run build` | Compilar para producción |
| `npm run preview` | Vista previa del build |
| `npm test` | Ejecutar tests en modo watch |
| `npm run test:ui` | Tests con interfaz visual |
| `npm run test:run` | Ejecutar tests una vez |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | Verificar código con ESLint |
| `npm run deploy` | Desplegar a GitHub Pages |

## 🗺️ Rutas de la Aplicación

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Página de inicio | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro de usuarios | Público |
| `/formulario` | Formulario de matrícula | Autenticado |
| `/perfil` | Edición de perfil | Autenticado |

## ✨ Características

### Implementadas
- ✅ Autenticación completa con Supabase Auth
- ✅ Registro multi-rol (Docente / Representante Legal)
- ✅ Validación de documentos peruanos (DNI, CE, PTP)
- ✅ Formulario de matrícula basado en Ficha Única SIAGIE
- ✅ Chatbot con IA (Google Gemini) para asistencia
- ✅ Componentes reutilizables y modulares
- ✅ Arquitectura limpia con patrones de diseño
- ✅ Suite de tests unitarios (209 tests)

### Validación de Documentos

| Tipo | Formato | Validación |
|------|---------|------------|
| DNI | 8 dígitos numéricos | ✅ |
| Carné de Extranjería | 9-12 caracteres alfanuméricos | ✅ |
| PTP | Prefijo PTP + 9 dígitos | ✅ |
| Código de Estudiante | 10 dígitos numéricos | ✅ |

## 📁 Dependencias Principales

### Producción
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "@supabase/supabase-js": "^2.86.0",
  "@supabase/auth-ui-react": "^0.4.7",
  "peru-utils": "^3.2.0"
}
```

### Desarrollo
```json
{
  "vite": "^7.2.4",
  "vitest": "^4.0.14",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "@vitest/coverage-v8": "4.0",
  "eslint": "^9.39.1"
}
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT - Ver archivo [LICENSE](LICENSE)

---

<div align="center">

**Desarrollado para la modernización de la gestión educativa en Perú** 🇵🇪

[Reportar Bug](https://github.com/Marchitroll/MatriFast/issues) · [Solicitar Feature](https://github.com/Marchitroll/MatriFast/issues)

</div>