# 📁 services

En esta carpeta definimos la **lógica de negocio** del sistema de matrículas.

Aquí se hace:

- Verificar reglas antes de guardar datos (por ejemplo, validar que un estudiante tenga representante).
- Coordinar varias operaciones a la vez (crear matrícula y notificar, por ejemplo).
- Aplicar cálculos o validaciones más complejas.

Los “services” son los **encargados** de asegurarse de que las acciones que hace el usuario cumplen las reglas del proyecto antes de enviarlas al repositorio.
