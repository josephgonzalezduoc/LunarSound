# Informe de pruebas y cobertura Lunar sound


## Entorno

React 18.3.1, Vite 5.4.11, Vitest 2.1.8, React Testing Library 16.1.0, jsdom 25.0.1 y proveedor de cobertura V8. Versiones reproducibles en package-lock.json. Comandos: npm test y npm run test:coverage, dentro de frontend. Node del entorno de verificación: 24.19.0.

Se ejecutaron 18 pruebas y todas aprobaron. También se verificó npm run build. Una prueba de integración usa MemoryRouter y monta App para verificar la compra completa. Las pruebas se limpian entre ejecuciones con cleanup, localStorage.clear y restoreAllMocks. No hay pruebas deshabilitadas.

## Registro de pruebas

| N° | Comportamiento | Resultado |
| --- | --- | --- |
| 1 | 01 filtra por marca y categoría | OK |
| 2 | 02 calcula total según cantidad y precio del catálogo | OK |
| 3 | 03 valida precio y stock del producto | OK |
| 4 | 04 exige dirección para despacho y no para retiro | OK |
| 5 | 05 rechaza carrito vacío y cantidades superiores al stock | OK |
| 6 | 06 crea pedido con cliente y precios históricos | OK |
| 7 | 07 usa un spy para verificar persistencia JSON real | OK |
| 8 | 08 recupera datos iniciales si localStorage está corrupto | OK |
| 9 | 09 renderiza props y llama al mock de agregar | OK |
| 10 | 10 deshabilita agregar cuando no hay stock | OK |
| 11 | 11 muestra error con credenciales incorrectas | OK |
| 12 | 12 permite ingresar con cuenta activa y clave demo | OK |
| 13 | 13 cliente solo ve pedidos propios | OK |
| 14 | 14 filtra catálogo mediante escritura y muestra vacío | OK |
| 15 | 15 bloquea sección administrativa a cliente | OK |
| 16 | 16 compra completa descuenta stock y separa historial entre clientes | OK |
| 17 | 17 administrador crea y edita producto desde el formulario | OK |
| 18 | 18 administrador crea usuario y evita correo duplicado | OK |

Todas están en frontend/src/tests/tienda.test.jsx. Las pruebas 01–08 evalúan reglas y almacenamiento; 09–15, componentes, acceso e interacciones; 16–18, flujos de compra y administración.

## Mocks y spies

La prueba 09 usa vi.fn como onAgregar y verifica su llamada con el código del producto. Las pruebas de login usan callbacks simulados para comprobar ingreso y rechazo. La prueba 07 usa vi.spyOn(Storage.prototype, "setItem") para observar la llamada real, comprobar el JSON y recuperar lo guardado. El spy se restaura al terminar. MemoryRouter permite probar navegación sin depender del historial del navegador.

## Cobertura obtenida

El alcance medido incluye App.jsx, componentes, páginas y utilidades. No incluye estilos, archivos de datos, main.jsx ni dependencias de terceros. No es una medición de todo el repositorio.

| Métrica | Resultado |
| --- | --- |
| statements | 82.13% |
| branches | 81.35% |
| functions | 63.79% |
| lines | 82.13% |

## Análisis

Las utilidades y la tarjeta de producto alcanzan cobertura alta. El flujo de integración comprueba que el stock inicial 8 baja a 7 y que otro cliente no ve el pedido; una prueba detectaría una regresión en esas reglas, pero no se afirma haber encontrado un fallo de producción previamente existente.

La cobertura de funciones es menor: faltan algunos manejadores de eventos y variantes de interfaz. El detalle, mapa y resumen por fechas tienen escasa cobertura. Las ramas de carrito y estados del pedido necesitan más escenarios. No debe interpretarse el 100% de ramas que puede aparecer en archivos no ejecutados completamente como prueba de validación exhaustiva: hay que revisar también líneas y funciones.

Próximas mejoras: prueba de despacho con dirección inválida desde el formulario, eliminación de producto con confirmación, actualización de estado como vendedor, fechas del resumen y administración de cuentas desactivadas. Las pruebas actuales no comprueban el mapa descargando mosaicos ni adaptación visual real a los tres tamaños de pantalla. Esa revisión manual sigue pendiente.

## Evidencia y conclusión

resultado-tests.txt contiene la salida real y coverage-summary.json las métricas generadas. Ejecuta npm run test:coverage para reconstruir el reporte HTML local. Los resultados apoyan las reglas principales de compra y la separación visual por cliente. Aún no cubren todos los eventos ni sustituyen revisión manual, pruebas de seguridad o pruebas con backend.
