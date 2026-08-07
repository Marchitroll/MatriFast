# MatriFast 🎓

[![Tests](https://img.shields.io/badge/tests-276%20passed-brightgreen)](https://github.com/Marchitroll/MatriFast)
[![Coverage](https://img.shields.io/badge/coverage-84.4%25-brightgreen)](https://github.com/Marchitroll/MatriFast)
[![React](https://img.shields.io/badge/React-19.2.8-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.0-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Sistema de gestión de matrículas escolares basado en la **Ficha Única de Matrícula SIAGIE** del Ministerio de Educación del Perú 🇵🇪.

---

## 🚀 Inicio Rápido

```powershell
# 1. Clonar el repositorio e instalar dependencias
git clone https://github.com/Marchitroll/MatriFast.git
cd MatriFast
pnpm install

# 2. Configurar variables de entorno (.env)
cp .env.example .env

# 3. Iniciar servidor de desarrollo
pnpm run dev
```

La aplicación estará lista en `http://localhost:5173`.

---

## 🛠️ Tecnologías Principales

- **Frontend:** React 19, Vite 8, React Router DOM 7
- **Backend / DB:** Supabase (PostgreSQL + Auth)
- **Testing & Calidad:** Vitest 4 + Testing Library, ESLint 10, `@vitest/coverage-v8`
- **Utilidades:** `peru-utils` (validación de DNI, CE, PTP)

---

## 🏗️ Arquitectura y Patrones

El proyecto sigue una arquitectura **orientada al dominio (DDD)** aplicando principios **SOLID**, **DRY**, **KISS** y **YAGNI**:

```text
src/
├── 📄 pages/         # Páginas (Login, Register, Perfil, Formulario, Home)
├── 🧩 components/    # Componentes reutilizables (common, forms, layout)
├── 🏛️ domain/        # Entidades, Builders y Validadores de documentos
├── ⚙️ services/      # Service Layer, Repositorios (Supabase) y EnumService
├── 🔄 context/       # AuthContextProvider, AuthContextObject y useAuth
└── 🎣 hooks/         # Custom Hooks (useEnums, useRegisterForm, useMatriculaForm, useEstudianteForm)
```

### Patrones Destacados
- **Strategy Pattern:** `UsuarioCreator` (creación dinámica según rol: Docente, Representante Legal, Estudiante).
- **Repository Pattern:** `BaseRepository` y repositorios específicos desacoplados de Supabase.
- **Builder Pattern:** `DocenteBuilder`, `RepresentanteLegalBuilder`, `UsuarioBuilder`.
- **Facade Pattern:** `EnumService` (gestión centralizada de enumeraciones con caché).
- **Factory & Template Method:** `Documento.js` y validadores de identidad peruanos (DNI, CE, PTP).

---

## 🧪 Pruebas & Calidad

Suite de pruebas automatizadas con **100% de tests aprobados** (276/276 tests):

```powershell
pnpm test:run      # Ejecutar la suite completa de pruebas
pnpm test:coverage # Generar reporte de cobertura (84.4% global)
pnpm run lint      # Verificar análisis estático (0 errores, 0 warnings)
pnpm run build     # Compilar bundle de producción (<200ms)
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz con las credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Ver [LICENSE](LICENSE) para más información.