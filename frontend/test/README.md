# Tests del Proyecto MatriFast

Este directorio contiene las pruebas automatizadas para los modelos del proyecto MatriFast.

## ¿Qué son los tests?

Los tests son pequeños programas que verifican automáticamente que nuestro código funciona correctamente. En lugar de probar manualmente cada función, los tests lo hacen por nosotros de forma rápida y confiable.

## Estructura de Tests

Actualmente tenemos:
- `Documento.test.js` - Pruebas para el modelo Documento
- `setup.js` - Configuración global para todos los tests

## Herramientas Utilizadas

- **Vitest**: Framework de testing rápido y moderno
- **@testing-library**: Utilidades adicionales para testing

## Cómo Ejecutar los Tests

### Desde la Terminal

1. Abre una terminal
2. Navega al directorio frontend:
   ```bash
   cd frontend
   ```
3. Ejecuta uno de estos comandos:
   ```bash
   # Ejecutar todos los tests
   npm test

   # Ejecutar tests una sola vez (sin modo watch)
   npm run test:run

   # Ejecutar tests con interfaz visual
   npm run test:ui
   ```

### Desde VS Code

1. Abre la paleta de comandos (`Ctrl+Shift+P`)
2. Busca "Test: Run All Tests" o usa `Ctrl+; A`
3. Los resultados aparecerán en el panel de tests

## Cómo Interpretar los Resultados

### Resultados Exitosos ✅
```
✓ debería crear un documento válido con tipo DNI
✓ debería lanzar error si el tipo es null
```
- ✅ Verde: El test pasó correctamente
- El código funciona como se esperaba

### Resultados con Error ❌
```
✗ debería crear un documento válido con tipo DNI
  Expected: "DNI"
  Received: "OTRO"
```
- ❌ Rojo: El test falló
- Muestra qué se esperaba vs qué se recibió
- Indica que hay un problema en el código

### Información Adicional
```
Test Files  1 passed (1)
Tests       2 passed (2)
Duration    245ms
```
- **Test Files**: Número de archivos de test ejecutados
- **Tests**: Número total de pruebas individuales
- **Duration**: Tiempo que tomó ejecutar todos los tests

## Estructura de un Test

```javascript
describe('Documento', () => {                    // Grupo de tests
  it('debería crear un documento válido', () => { // Test individual
    const documento = new Documento('DNI', '12345678')
    expect(documento.tipo).toBe('DNI')           // Verificación
  })
})
```

- `describe()`: Agrupa tests relacionados
- `it()`: Define un test individual
- `expect()`: Verifica que algo sea como esperamos

## Agregar Nuevos Tests

Para crear un nuevo archivo de test:

1. Crea un archivo con extensión `.test.js` en esta carpeta
2. Importa lo necesario:
   ```javascript
   import { describe, it, expect } from 'vitest'
   import MiModelo from '../src/modelos/MiModelo.js'
   ```
3. Escribe tus pruebas siguiendo la estructura mostrada arriba

## Consejos

- **Ejecuta los tests frecuentemente** mientras desarrollas
- **Un test que falla no es malo** - te ayuda a encontrar problemas temprano
- **Mantén los tests simples** - cada test debe verificar una sola cosa
- **Usa nombres descriptivos** para que sea fácil entender qué hace cada test
