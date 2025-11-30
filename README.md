# MatriFast 🎓

Sistema de gestión de matrículas escolares para el sistema educativo peruano.

## Descripción

**MatriFast** es una aplicación web que permite gestionar el proceso de matrícula escolar, incluyendo el registro de docentes, representantes legales y estudiantes, así como el llenado de la Ficha Única de Matrícula del SIAGIE.

## Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| Frontend | React 19, Vite 6, React Router DOM 7 |
| Backend | Supabase (PostgreSQL + Auth) |
| Testing | Vitest, Testing Library |
| Despliegue | GitHub Pages |
| Chatbot | Google Gemini API |

## Arquitectura del Proyecto

El proyecto sigue principios **SOLID**, **DRY**, **KISS** y **YAGNI**, implementando patrones de diseño:

```
frontend/src/
├── components/           # Componentes React
│   ├── common/          # PasswordInput, EnumSelect, FormField, SubmitButton
│   ├── forms/           # PersonaFields, DocenteFields, RepresentanteLegalFields
│   └── layout/          # AuthPageLayout
├── pages/               # Páginas: Home, Login, Register, Perfil, Formulario
├── domain/              # Lógica de dominio
│   ├── entities/        # Persona, Usuario, Docente, RepresentanteLegal, Documento
│   ├── builders/        # DocenteBuilder, RepresentanteLegalBuilder (Builder Pattern)
│   └── validators/      # ValidadorDNI, ValidadorCE, ValidadorPTP
├── services/            # Servicios de aplicación
│   ├── repositories/    # BaseRepository + repos específicos (Repository Pattern)
│   ├── EnumService.js   # Facade para enumeraciones
│   ├── UsuarioCreator.js # Strategy Pattern para creación por rol
│   └── GeminiService.js # Integración con chatbot IA
├── context/             # AuthContext (autenticación)
├── hooks/               # useEnums, useRegisterForm, useMatriculaForm
└── config/              # ClienteSupabase
```

### Patrones de Diseño Implementados

| Patrón | Uso |
|--------|-----|
| **Builder** | `DocenteBuilder`, `RepresentanteLegalBuilder` - construcción fluida de objetos |
| **Strategy** | `UsuarioCreator` - estrategias de creación por rol |
| **Repository** | `BaseRepository` + hijos - abstracción de persistencia |
| **Facade** | `EnumService` - API simple para múltiples enums |

## Instalación

```powershell
# Clonar repositorio
git clone https://github.com/Marchitroll/MatriFast.git
cd MatriFast/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con:
# VITE_SUPABASE_URL=tu_url
# VITE_SUPABASE_ANON_KEY=tu_key
# VITE_GEMINI_API_KEY=tu_api_key (opcional, para chatbot)

# Ejecutar en desarrollo
npm run dev
```

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (http://localhost:5173) |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa de producción |
| `npm run test` | Ejecutar tests con Vitest |
| `npm run test:ui` | Tests con interfaz visual |
| `npm run lint` | Verificar código con ESLint |
| `npm run deploy` | Desplegar a GitHub Pages |

## Rutas de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuarios (Docente/Representante Legal) |
| `/formulario` | Formulario de matrícula |
| `/perfil` | Edición de perfil |

## Características

- ✅ Autenticación con Supabase Auth
- ✅ Registro multi-rol (Docente, Representante Legal)
- ✅ Validación de documentos peruanos (DNI, CE, PTP)
- ✅ Formulario de matrícula basado en Ficha Única SIAGIE
- ✅ Chatbot con IA (Google Gemini) para asistencia
- ✅ Componentes reutilizables (DRY)
- ✅ Arquitectura limpia y mantenible

## Requisitos

- Node.js 18+
- npm 9+
- Navegador moderno (Chrome/Firefox/Edge/Safari)
- Cuenta de Supabase (para backend)

## Licencia

MIT - Ver archivo `LICENSE`

---

**Desarrollado para la modernización de la gestión educativa en Perú** 🇵🇪