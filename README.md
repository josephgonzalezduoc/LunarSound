# Lunar-Sound

Proyecto académico Frontend React sencillo para una tienda de instrumentos musicales. Se usa JavaScript, componentes funcionales, useState, props y Bootstrap. No utiliza TypeScript, Redux ni una arquitectura de capas avanzada.

## Iniciar desde cero

1. Instalar Node.js 22 LTS (o una versión compatible con las dependencias).
2. Descomprimir este proyecto y abrir la carpeta lunar-sound en Visual Studio Code.
3. Abrir Terminal > Nueva terminal.
4. Ejecutar, una línea a la vez:

```bash
cd frontend
npm install
npm run dev
```

Abrir la dirección que aparece en la terminal, normalmente http://127.0.0.1:5173. Mantener la terminal abierta. Para detenerla, Ctrl+C.

## Cuentas de demostración

Todas usan la contraseña `claveprueba123`.

| Correo | Rol |
| --- | --- |
| admin@lunarsound.cl | Administrador |
| vendedor@lunarsound.cl | Vendedor |
| mauricio@lunarsound.cl | Cliente |
| joseph@lunarsound.cl | Otro cliente para verificar separación del historial |

## Funciones

- Catálogo con los 51 productos de la muestra oficial, búsqueda, categorías y detalle.
- Cliente: carrito, cantidades, retiro o despacho, validación de dirección, pago simulado, historial propio.
- Vendedor: editar stock y actualizar estado de los pedidos.
- Administrador: crear, editar y eliminar productos; crear, editar y desactivar usuarios; asignar roles y ver resumen de ventas por fechas.
- Mapa Leaflet con un punto referencial de Calera de Tango.
- Guardado del negocio en localStorage. Carrito y sesión solo viven en memoria: al recargar hay que iniciar sesión nuevamente.

## Pruebas y compilación

Desde frontend:

```bash
npm test
npm run test:coverage
npm run build
```

Hay 18 pruebas. El reporte visual de cobertura se genera en `frontend/coverage/index.html`. Se incluyen evidencias de ejecución en documentacion/evidencias. Son resultados de esta versión, no pruebas de que toda función carezca de errores.

## Organización

- frontend/src/App.jsx: estado compartido, rutas y operaciones de productos, usuarios y pedidos. También contiene el encabezado y pie comunes.
- frontend/src/pages: pantallas.
- frontend/src/components: tarjeta reutilizable y protección visual de rutas.
- frontend/src/utils: reglas de negocio y almacenamiento.
- frontend/src/data: productos oficiales y usuarios demo.
- frontend/src/tests: pruebas con Vitest y React Testing Library.

## Alcance y límites

Esta es una demostración frontend de P2. Las cuentas y roles locales NO implementan autenticación segura: quien controla el navegador puede modificar los datos. No hay backend, JWT, base de datos, cobros reales, envío real de productos, sincronización entre dispositivos, AWS ni Docker. Corresponden a la evolución Full Stack y deben implementarse con las instrucciones de P3/EFT.

Los 340 productos descritos en el caso son el tamaño del negocio; el Excel entregado contiene una muestra de 51 productos, que es la utilizada.

El mapa descarga mosaicos de OpenStreetMap y requiere internet. La ubicación es referencial. El resumen suma todos los pedidos simulados del período, incluidos los que están en preparación.

Para reiniciar los datos de demostración: abrir herramientas del navegador > Application/Aplicación > Local Storage y eliminar únicamente `sv-datos`. Recargar. Esto borra productos, cuentas y pedidos modificados en la demo.
