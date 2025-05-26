# MatriFast 🎓

## Descripción del Proyecto

**MatriFast** es un sistema de gestión educativa diseñado con arquitectura cliente-servidor que permite el registro eficiente de usuarios del sistema educativo y la gestión de matrículas estudiantiles. El sistema está construido con tecnologías modernas que garantizan escalabilidad, mantenibilidad y una experiencia de usuario optimizada.

### Características Principales

- **Gestión de Usuarios Multi-Rol**: Registro y administración de docentes, representantes legales y estudiantes
- **Sistema de Matrícula Digital**: Formularios inteligentes para el proceso de matrícula estudiantil
- **Arquitectura Orientada a Objetos**: Implementación de patrones de diseño como Factory, Strategy y Repository
- **Validación Robusta**: Validadores específicos para diferentes tipos de documentos (DNI, CE, PTP)
- **Interfaz Responsiva**: Diseño moderno y adaptable a diferentes dispositivos
- **Base de Datos Relacional**: Gestión eficiente de datos con PostgreSQL através de Supabase

### Tecnologías Utilizadas

#### Frontend
- **React 18** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción y servidor de desarrollo
- **React Router DOM** - Enrutamiento del lado del cliente
- **CSS3** - Estilos modernos con variables CSS

#### Backend
- **Supabase** - Backend-as-a-Service (BaaS)
- **PostgreSQL** - Base de datos relacional
- **Supabase Auth** - Sistema de autenticación JWT

## Requisitos Técnicos

### Sistema Operativo
- Windows 10/11, macOS 10.15+, o Linux Ubuntu 18.04+

### Software Requerido
- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior (incluido con Node.js)
- **Git** 2.30.0 o superior
- **Navegador Web** moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Especificaciones Mínimas de Hardware
- **RAM**: 4 GB mínimo, 8 GB recomendado
- **Almacenamiento**: 500 MB de espacio libre
- **Conexión a Internet**: Requerida para Supabase

## Instalación y Configuración

### 1. Clonar el Repositorio
```powershell
git clone <url-del-repositorio>
cd MatriFast
```

### 2. Instalar Dependencias del Frontend
```powershell
cd frontend
npm install
```

### 3. Configuración de Variables de Entorno

Crear un archivo `.env` en la carpeta `frontend/` con las siguientes variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Nota**: Contacta al administrador del proyecto para obtener las credenciales de Supabase.

### 4. Verificar la Configuración
```powershell
npm run dev
```

Si todo está configurado correctamente, deberías ver el mensaje:
```
Local:   http://localhost:5173/
Network: use --host to expose
```

## Instrucciones de Ejecución

### Desarrollo

#### Iniciar el Servidor de Desarrollo
```powershell
cd frontend
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

#### Modo de Vista Previa de Producción
```powershell
npm run build
npm run preview
```

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Vista previa de la build de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |

### Estructura de URLs

- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/formulario` - Formulario de matrícula
- `/test` - Página de pruebas (desarrollo)

## Buenas Prácticas y Errores Comunes

### ✅ Buenas Prácticas

#### Desarrollo
- **Seguir la arquitectura en capas**: Mantener la separación entre presentación, lógica y datos
- **Usar Factory Pattern**: Para crear nuevos tipos de usuarios, utilizar las factories existentes
- **Validación en capas**: Implementar validaciones tanto en frontend como en modelos de dominio
- **Gestión de estado**: Utilizar hooks personalizados para lógica reutilizable
- **Nomenclatura**: Seguir las convenciones de nombres establecidas (PascalCase para clases, camelCase para variables)

#### Código
```javascript
// ✅ Correcto - Usar Factory para crear usuarios
const docente = DocenteFactory.crear(datosDocente);

// ❌ Incorrecto - Instanciar directamente
const docente = new Docente(datosDocente);
```

### ⚠️ Errores Comunes

#### 1. Variables de Entorno No Configuradas
**Error**: `Error: supabaseUrl and supabaseKey are required`
**Solución**: Verificar que el archivo `.env` exista y contenga las variables correctas

#### 2. Problemas de CORS
**Error**: `Access-Control-Allow-Origin header`
**Solución**: Verificar la configuración de Supabase y las URLs permitidas

#### 3. Validación de Documentos
**Error**: Documento inválido no detectado
**Solución**: Asegurarse de usar los validadores específicos por tipo de documento

```javascript
// ✅ Correcto
const documento = new Documento('12345678', TiposDocumento.DNI);
if (!documento.esValido()) {
    throw new Error('Documento inválido');
}

// ❌ Incorrecto - No validar
const documento = new Documento('123', TiposDocumento.DNI);
```

#### 4. Manejo de Estados Asincrónicos
**Error**: `Cannot read property of undefined`
**Solución**: Siempre verificar el estado de carga antes de acceder a datos

```javascript
// ✅ Correcto
if (usuario && usuario.rol) {
    return <ComponenteRol rol={usuario.rol} />;
}

// ❌ Incorrecto
return <ComponenteRol rol={usuario.rol} />;
```

#### 5. Gestión de Memoria
**Error**: Warning de memory leaks
**Solución**: Limpiar efectos y suscripciones en componentes

```javascript
// ✅ Correcto
useEffect(() => {
    const suscripcion = supabase.auth.onAuthStateChange(callback);
    return () => suscripcion.unsubscribe();
}, []);
```

## Limitaciones del Proyecto

### Funcionalidades Actuales

#### ✅ Completamente Implementado
- ✅ Sistema de autenticación y autorización
- ✅ Registro completo de docentes (con persistencia en BD)
- ✅ Modelos de dominio robustos con validaciones
- ✅ Sistema de validación de documentos
- ✅ Logging centralizado para debugging
- ✅ Interfaces y contratos bien definidos

#### 🚧 Parcialmente Implementado
- 🚧 **Registro de Estudiantes**: Objetos de dominio creados, persistencia en desarrollo
- 🚧 **Formulario de Matrícula**: Interfaz de usuario completada, lógica de negocio en progreso
- 🚧 **Representantes Legales**: Modelo completo, integración con base de datos pendiente


### Limitaciones Técnicas

#### Base de Datos
- **Dependencia de Supabase**: El sistema requiere conexión constante a internet
- **Límites de API**: Sujeto a los límites de rate limiting de Supabase
- **Escalabilidad**: Limitada al plan de Supabase contratado

#### Frontend
- **Compatibilidad**: Requiere navegadores modernos con soporte ES6+
- **Rendimiento**: Optimización para grandes volúmenes de datos pendiente
- **Offline**: No hay soporte para funcionamiento sin conexión

#### Seguridad
- **Encriptación**: Datos sensibles en tránsito, encriptación local pendiente
- **Sesiones**: Dependiente del sistema de sesiones de Supabase
- **Validación**: Validaciones del lado del servidor limitadas a constraints de BD

### Consideraciones de Despliegue

#### Desarrollo
- **Variables de Entorno**: Requiere configuración manual de credenciales
- **Base de Datos**: Dependiente de instancia específica de Supabase
- **Migrations**: Sistema de migraciones de esquema no implementado

#### Producción
- **SSL**: Requiere certificados SSL para producción
- **CDN**: Optimización de assets estáticos pendiente
- **Monitoreo**: Sistema de monitoreo y alertas no implementado
- **Backup**: Estrategia de respaldo automatizada pendiente

---

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la modernización de la gestión educativa**