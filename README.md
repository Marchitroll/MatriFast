# MatriFast 🎓

[![Tests](https://img.shields.io/badge/tests-209%20passed-brightgreen)](https://github.com/Marchitroll/MatriFast)
[![Coverage](https://img.shields.io/badge/coverage-35%25-yellow)](https://github.com/Marchitroll/MatriFast)
[![React](https://img.shields.io/badge/React-19.2.6-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3.3-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> Sistema de gestión de matrículas escolares para el sistema educativo peruano 🇵🇪

---

## 📑 Tabla de Contenidos

- [Descripción](#-descripción)
- [Inicio Rápido](#-inicio-rápido)
- [Tecnologías](#️-tecnologías)
- [Arquitectura](#️-arquitectura-del-proyecto)
- [Patrones de Diseño](#-patrones-de-diseño)
- [Custom Hooks](#-custom-hooks)
- [Validación de Documentos Peruanos](#-validación-de-documentos-peruanos)
- [Testing](#-testing)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Rutas de la Aplicación](#️-rutas-de-la-aplicación)
- [Licencia](#-licencia)

---

## 📋 Descripción

**MatriFast** es una aplicación web moderna desarrollada con React que permite gestionar el proceso de matrícula escolar, basándose en la **Ficha Única de Matrícula del SIAGIE** (Sistema de Información de Apoyo a la Gestión de la Institución Educativa) del Ministerio de Educación del Perú.

### Características principales

- ✅ **Autenticación completa** con Supabase Auth
- ✅ **Registro multi-rol** (Docente / Representante Legal)
- ✅ **Validación de documentos peruanos** (DNI, CE, PTP, Código de Estudiante)
- ✅ **Formulario de matrícula** basado en Ficha Única SIAGIE
- ✅ **Chatbot con IA** (Google Gemini) para asistencia
- ✅ **Arquitectura limpia** con 6 patrones de diseño
- ✅ **Suite de tests** con 209 tests unitarios

---

## 🚀 Inicio Rápido

```powershell
# Clonar e instalar
git clone https://github.com/Marchitroll/MatriFast.git
cd MatriFast/frontend
corepack pnpm install

# Configurar variables de entorno (ver sección correspondiente)
cp .env.example .env

# Ejecutar en desarrollo
corepack pnpm run dev
```

Importante: los comandos de desarrollo se ejecutan dentro de `frontend/`; la raíz del repo no contiene `package.json`.
Usamos `corepack pnpm` para ejecutar siempre la versión de pnpm declarada en el proyecto, sin depender de una instalación global distinta en cada equipo.

La aplicación estará disponible en `http://localhost:5173`

---

## 🛠️ Tecnologías

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Frontend | React | 19.2.6 |
| Build Tool | Vite | 7.3.3 |
| Routing | React Router DOM | 7.15.0 |
| Backend | Supabase (PostgreSQL + Auth) | 2.105.4 |
| Testing | Vitest 4.1.6 + Testing Library 16.3.2 |
| Cobertura | @vitest/coverage-v8 | 4.1.6 |
| Utilidades | peru-utils | 3.2.0 |
| Chatbot | Google Gemini API | 1.5-flash |

## 🏗️ Arquitectura del Proyecto

El proyecto sigue principios **SOLID**, **DRY**, **KISS** y **YAGNI**, con una arquitectura modular orientada al dominio:

```
frontend/src/
├── 📄 pages/                    # Páginas de la aplicación
│   ├── Home.jsx                 # Página de inicio
│   ├── Login.jsx                # Autenticación de usuarios
│   ├── Register.jsx             # Registro multi-rol
│   ├── Perfil.jsx               # Edición de perfil
│   └── Formulario.jsx           # Formulario de matrícula SIAGIE
│
├── 🧩 components/               # Componentes React reutilizables
│   ├── common/                  # Componentes genéricos
│   │   ├── EnumSelect.jsx       # Selector de enumeraciones con loading
│   │   ├── FormField.jsx        # Campo de formulario con label
│   │   ├── PasswordInput.jsx    # Input contraseña con toggle visibilidad
│   │   └── SubmitButton.jsx     # Botón submit con estado de carga
│   ├── forms/                   # Formularios específicos
│   │   ├── PersonaFields.jsx    # Campos base de persona (reutilizable)
│   │   ├── DocenteFields.jsx    # Campos específicos de docente
│   │   ├── RepresentanteLegalFields.jsx  # Campos de representante
│   │   ├── FormularioMatricula.jsx       # Matrícula completa
│   │   └── RoleSelect.jsx       # Selector de rol
│   ├── layout/
│   │   └── AuthPageLayout.jsx   # Layout para Login/Register
│   └── Chatbot.jsx              # Asistente virtual con Gemini AI
│
├── 🏛️ domain/                   # Capa de dominio (DDD)
│   ├── entities/                # Entidades del negocio
│   │   ├── Persona.js           # Clase base abstracta
│   │   ├── Usuario.js           # Usuario (hereda de Persona)
│   │   ├── Docente.js           # Docente (hereda de Usuario)
│   │   ├── RepresentanteLegal.js # Rep. Legal (hereda de Usuario)
│   │   ├── Documento.js         # Documento de identidad
│   │   └── Ubicacion.js         # Dirección/ubicación
│   ├── builders/                # Patrón Builder
│   │   ├── DocenteBuilder.js    # Builder fluido para Docente
│   │   └── RepresentanteLegalBuilder.js
│   └── validators/              # Validadores de documentos
│       ├── ValidadorDocumento.js      # Factory de validadores
│       ├── ValidadorDNI.js            # DNI peruano
│       ├── ValidadorCE.js             # Carné de Extranjería
│       ├── ValidadorPTP.js            # Permiso Temporal
│       ├── ValidadorCodigoEstudiante.js
│       └── ValidadorGenerico.js       # Validador base
│
├── ⚙️ services/                 # Capa de servicios
│   ├── repositories/            # Patrón Repository
│   │   ├── BaseRepository.js    # Operaciones CRUD genéricas
│   │   ├── PersonaRepository.js
│   │   ├── UsuarioRepository.js
│   │   ├── DocenteRepository.js
│   │   └── RepresentanteLegalRepository.js
│   ├── EnumService.js           # Facade para enumeraciones (con caché)
│   ├── GeminiService.js         # Integración con Google Gemini
│   ├── UsuarioCreator.js        # Factory/Strategy de usuarios
│   ├── UsuarioPersistence.js    # Persistencia de usuarios
│   ├── UsuarioService.js        # Orquestación de operaciones
│   └── Logger.js                # Servicio de logging
│
├── 🔄 context/
│   └── AuthContext.jsx          # Contexto de autenticación Supabase
│
├── 🎣 hooks/                    # Custom Hooks
│   ├── useEnums.js              # Carga de enumeraciones
│   ├── useRegisterForm.js       # Lógica de registro
│   ├── useMatriculaForm.js      # Lógica de matrícula
│   └── useEstudianteForm.js     # Lógica de estudiante
│
└── ⚡ config/
    └── ClienteSupabase.js       # Cliente de Supabase
```

### Jerarquía de Entidades

```
Persona (abstracta)
├── #id, #nombres, #aPaterno, #aMaterno, #fechaNacimiento, #sexo, #documento
├── calcularEdad(), nombreCompleto(), toString(), toPlainObject()
│
└── Usuario (abstracta)
    ├── #email, #rol
    │
    ├── Docente
    │   └── rol fijo: 'DOCENTE'
    │
    └── RepresentanteLegal
        ├── #tipoRelacion, #direccion, #numeroCelular, #viveConEstudiante
        └── agregarEstudiante()
```

---

## 🎨 Patrones de Diseño

El proyecto implementa 6 patrones de diseño para mantener código limpio y extensible:

| Patrón | Archivo(s) | Descripción |
|--------|------------|-------------|
| **Builder** | `DocenteBuilder.js`, `RepresentanteLegalBuilder.js` | Construcción fluida de objetos complejos con interfaz encadenada |
| **Strategy** | `UsuarioCreator.js` | Estrategias intercambiables de creación según rol (OCP) |
| **Repository** | `BaseRepository.js` + específicos | Abstracción de persistencia sobre Supabase |
| **Facade** | `EnumService.js` | API unificada para múltiples enumeraciones con caché |
| **Factory** | `ValidadorDocumento.js` | Creación de validadores según tipo de documento |
| **Template Method** | `ValidadorGenerico.js` | Algoritmo base de validación extensible |

### Ejemplo: Builder Pattern

```javascript
// Construcción fluida de un Docente
const docente = new DocenteBuilder()
  .conPersona({ nombres: 'Juan', aPaterno: 'Pérez', aMaterno: 'López' })
  .conFechaNacimiento('1985-06-15')
  .conSexo('M')
  .conDocumento('DNI', '12345678')
  .conEmail('juan.perez@email.com')
  .build();

// O usando el factory method
const docente = DocenteBuilder.fromFormData(formData, email);
```

### Ejemplo: Strategy Pattern

```javascript
// UsuarioCreator selecciona estrategia según rol
const ESTRATEGIAS = {
  'DOCENTE': (datos, especificos) => DocenteBuilder.fromFormData(...),
  'REPRESENTANTE LEGAL': (datos, especificos) => RepresentanteLegalBuilder.fromFormData(...)
};

// Extensible sin modificar código existente (OCP)
UsuarioCreator.registrarEstrategia('NUEVO_ROL', nuevaEstrategia);
```

---

## 🎣 Custom Hooks

Hooks personalizados que encapsulan lógica de negocio reutilizable:

| Hook | Propósito |
|------|-----------|
| `useEnums` | Carga todas las enumeraciones (sexos, tiposDocumento, roles, modalidades) usando `EnumService` con valores por defecto en caso de error |
| `useRegisterForm` | Gestiona estado completo del formulario de registro: email, passwords, rol, datos específicos, validaciones y submit |
| `useMatriculaForm` | Estado del formulario de matrícula: formData, loading, errores, handlers |
| `useEstudianteForm` | Registro de estudiante sin cuenta Auth (solo persistencia en BD) |

### Ejemplo de uso

```javascript
// En un componente
const { sexos, tiposDocumento, roles, isLoading } = useEnums();
const { formData, handleChange, handleSubmit, error } = useMatriculaForm();
```

---

## 🆔 Validación de Documentos Peruanos

Sistema de validación basado en el patrón **Factory + Strategy** para documentos de identidad peruanos:

| Tipo | Descripción | Formato | Regex |
|------|-------------|---------|-------|
| **DNI** | Documento Nacional de Identidad | 8 dígitos numéricos | `^\d{8}$` |
| **CE** | Carné de Extranjería | 9-12 caracteres alfanuméricos | `^[A-Z0-9]{9,12}$` |
| **PTP** | Permiso Temporal de Permanencia | 9-15 caracteres alfanuméricos | `^[A-Z0-9]{9,15}$` |
| **Código Estudiante** | Código interno del estudiante | 5-20 caracteres alfanuméricos | `^[A-Z0-9]{5,20}$` |

### Jerarquía de Validadores

```
ValidadorDocumento (Factory)
│   └── #obtenerValidador(tipo) → selecciona validador
│
ValidadorGenerico (Template Method - clase base abstracta)
├── ValidadorDNI
├── ValidadorCE
├── ValidadorPTP
└── ValidadorCodigoEstudiante
```

### Uso

```javascript
import { Documento } from './domain/entities';

// El documento selecciona automáticamente el validador correcto
const doc = new Documento('DNI', '12345678');
console.log(doc.esValido()); // true

const docInvalido = new Documento('DNI', '123');
console.log(docInvalido.esValido()); // false
```

---

## 🧪 Testing

Suite completa de tests unitarios con alta cobertura en componentes críticos:

```
📊 Estadísticas
├── 18 archivos de test
├── 209 tests pasando ✅
└── ~35% cobertura global
    ├── components/common: 96%
    ├── domain/entities: 86-98%
    ├── domain/builders: 95%+
    └── domain/validators: 90%+
```

### Estructura de Tests

```
test/
├── setup.js                     # Configuración global
├── components/                  # Tests de componentes React
│   ├── EnumSelect.test.jsx
│   ├── FormField.test.jsx
│   ├── PasswordInput.test.jsx
│   └── SubmitButton.test.jsx
├── domain/
│   ├── entities/                # Tests de entidades
│   ├── builders/                # Tests de builders
│   └── validators/              # Tests de validadores
├── hooks/
│   └── useEnums.test.js
└── services/
    ├── EnumService.test.js
    └── UsuarioCreator.test.js
```

### Comandos de Testing

```powershell
corepack pnpm test              # Tests en modo watch
corepack pnpm run test:ui       # Interfaz visual de Vitest
corepack pnpm run test:run      # Ejecutar una vez
corepack pnpm run test:coverage # Generar reporte de cobertura
```

---

## 🔐 Variables de Entorno

Crear archivo `.env` en la carpeta `frontend/`:

```env
# Supabase (OBLIGATORIO)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Google Gemini (OPCIONAL - solo para chatbot)
VITE_GEMINI_API_KEY=tu_api_key_de_gemini
```

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | ✅ Sí | URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✅ Sí | Clave anónima de Supabase |
| `VITE_GEMINI_API_KEY` | ❌ No | API Key de Google Gemini para el chatbot |

> ⚠️ **Nota**: Sin las variables de Supabase, la aplicación mostrará una alerta crítica y no funcionará.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `corepack pnpm run dev` | Servidor de desarrollo (`http://localhost:5173`) |
| `corepack pnpm run build` | Compilar para producción |
| `corepack pnpm run preview` | Vista previa del build de producción |
| `corepack pnpm test` | Ejecutar tests en modo watch |
| `corepack pnpm run test:ui` | Tests con interfaz visual de Vitest |
| `corepack pnpm run test:run` | Ejecutar tests una sola vez |
| `corepack pnpm run test:coverage` | Tests con reporte de cobertura |
| `corepack pnpm run lint` | Verificar código con ESLint 9 |

---

## 🗺️ Rutas de la Aplicación

| Ruta | Componente | Acceso | Descripción |
|------|------------|--------|-------------|
| `/` | `Home` | Público | Página de bienvenida |
| `/login` | `Login` | Público | Inicio de sesión |
| `/register` | `Register` | Público | Registro multi-rol |
| `/formulario` | `Formulario` | 🔒 Autenticado | Formulario de matrícula SIAGIE |
| `/perfil` | `Perfil` | 🔒 Autenticado | Edición de perfil |

> **Nota**: Se utiliza `HashRouter` para compatibilidad con hosting estático.

---

## 📦 Dependencias

<details>
<summary><strong>Producción</strong></summary>

```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-router-dom": "^7.15.0",
  "@supabase/supabase-js": "^2.105.4",
  "@supabase/auth-ui-react": "^0.4.7",
  "prop-types": "^15.8.1",
  "peru-utils": "^3.2.0"
}
```

</details>

<details>
<summary><strong>Desarrollo</strong></summary>

```json
{
  "vite": "^7.3.3",
  "vitest": "^4.1.6",
  "@testing-library/react": "^16.3.2",
  "@testing-library/jest-dom": "^6.9.1",
  "@vitest/coverage-v8": "^4.1.6",
  "eslint": "^9.39.4",
  "gh-pages": "^6.3.0"
}
```

</details>

---

## 📄 Licencia

MIT - Ver archivo [LICENSE](LICENSE)

---

<div align="center">

**Desarrollado para la modernización de la gestión educativa en Perú** 🇵🇪

</div>