# Preparación de la entrega

## Datos por completar

Sección, grupo, nombres de integrantes, enlace GitHub, enlace del video y versión final evaluada. Los documentos Markdown incluidos son editables y se pueden abrir en VS Code. Antes de subirlos al AVA, completa los datos y conviértelos a los formatos requeridos por el curso; el informe de testing puede trasladarse a la plantilla 09 oficial.

## Revisión pendiente

- Ejecutar desde una carpeta limpia en tu computador.
- Revisar todas las vistas en navegador a 360, 768 y 1280 px. La revisión visual no pudo realizarse en el entorno de creación porque no había un navegador ejecutable.
- Verificar mapa con conexión a internet y confirmar ubicación comercial real.
- Probar manualmente eliminación de producto, edición/desactivación de usuario, cambio de estado de pedido, resumen por fechas y restricciones del vendedor.
- Completar documentos y revisar que representen la versión final que entregarás.

## GitHub

Crea un repositorio público para este proyecto. Desde la raíz lunar-sound, donde está este README, ejecuta:

```bash
git init
git add .
git commit -m "Agregar frontend inicial Sonido Vivo y pruebas"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

Reemplaza URL_DE_TU_REPOSITORIO por el enlace real. Configura tu nombre y correo en Git si lo solicita. No se incluye un historial ficticio: los integrantes deben hacer modificaciones reales, revisarlas, entenderlas y registrar sus propios aportes. No subir node_modules, dist ni coverage. Las evidencias seleccionadas en documentacion sí se pueden guardar.

El profesor pide que el ZIP final se descargue con GitHub > Code > Download ZIP. No subir este ZIP de trabajo como si ya fuera esa descarga. GitHub, video y ZIP deben corresponder a la misma versión. Identifica la versión final con una etiqueta o el hash del commit en los documentos.

## Video sugerido

Mostrar la aplicación funcionando, con narración. No requiere aparecer con el rostro.

1. Identificar sección, integrantes y Forma B.
2. Ingresar como cliente, filtrar catálogo y abrir detalle.
3. Agregar producto al carrito. Elegir despacho, mostrar validación de dirección y luego completar correctamente.
4. Confirmar pedido y mostrar historial.
5. Ingresar como vendedor para mostrar stock y cambiar estado del pedido.
6. Ingresar como administrador, mostrar CRUD de productos, gestión de usuarios y resumen.
7. Mostrar adaptación a móvil y mapa referencial indicando su limitación.
8. Mostrar App.jsx, ProductoCard y dos pruebas representativas: mock y spy.
9. Ejecutar npm test y npm run test:coverage. Explicar resultados y áreas no cubiertas.
10. Mostrar GitHub y aportes reales de los integrantes.

## AVA

Según las instrucciones adjuntas: miércoles 21/10/2026, antes de las 10:30 AM. Cada estudiante debe registrar personalmente grupo, contexto, enlace GitHub, enlace Google Drive al video, ZIP descargado desde GitHub y documento de testing. Las guías generales también solicitan ERS V2: prepáralo y adjúntalo donde corresponda. Comprueba permisos de los enlaces desde incógnito. La defensa técnica posterior es individual y presencial.
