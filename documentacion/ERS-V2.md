# Especificación de requisitos Lunar sound versión 2

Integrantes: Joseph González

## Propósito

Lunar Sound es una tienda de instrumentos musicales ubicada en Viña del Mar. El caso describe ventas remotas dispersas en WhatsApp e Instagram, inventario en Excel desactualizado y falta de historial por cliente. La primera versión permite demostrar una gestión centralizada mediante un frontend React con datos simulados. El mismo sistema debe evolucionar en P3 y EFT.

## Actores y permisos

| Rol | Operaciones en esta versión |
| --- | --- |
| Cliente | Consultar catálogo, detalle y ubicación; gestionar carrito; generar pedido con retiro o despacho y consultar su historial |
| Vendedor | Consultar catálogo, gestionar stock y actualizar estados de pedidos |
| Administrador | Operaciones internas de vendedor, CRUD de productos, gestión de usuarios y resumen de ventas |

No se habilita registro público porque no es obligatorio en el contexto. El administrador crea las cuentas demo. El administrador no puede desactivar ni cambiar su propio rol desde el formulario para evitar quedarse sin acceso accidentalmente.

## Requisitos funcionales

| ID | Requisito | Evidencia en código |
| --- | --- | --- |
| RF01 | Permitir ingreso de cuentas activas y cerrar sesión | Login.jsx, App.jsx |
| RF02 | Restringir visualmente rutas según rol | Protegida.jsx |
| RF03 | Buscar y filtrar catálogo por categoría | Catalogo.jsx, tienda.js |
| RF04 | Mostrar detalle de producto y stock | Detalle.jsx |
| RF05 | Agregar, modificar cantidades y quitar productos del carrito | App.jsx, Carrito.jsx |
| RF06 | Validar stock y dirección antes de confirmar | crearPedido, validarEntrega en tienda.js |
| RF07 | Registrar pedido, total y precios históricos y descontar stock | App.jsx, tienda.js |
| RF08 | Elegir retiro o despacho y simular aprobación del pago | Carrito.jsx |
| RF09 | Mostrar al cliente solo sus pedidos | Pedidos.jsx |
| RF10 | Permitir al personal actualizar estado: En preparación, Despachado, Entregado | Pedidos.jsx |
| RF11 | Crear, consultar, editar y eliminar productos como administrador | Inventario.jsx, App.jsx |
| RF12 | Permitir al vendedor editar solo stock | Inventario.jsx, App.jsx |
| RF13 | Crear, editar, desactivar cuentas y asignar rol | Usuarios.jsx |
| RF14 | Consultar cantidad y monto de pedidos por período | Resumen.jsx |
| RF15 | Mostrar mapa interactivo referencial | Ubicacion.jsx |

## Reglas de negocio

Los precios son positivos y el stock es entero no negativo. Cada cantidad de compra debe ser un entero entre 1 y el stock disponible. La confirmación vuelve a validar el stock. El precio usado es el del catálogo, y el pedido guarda una copia para que cambios posteriores no alteren su historial. El carrito vacío no genera pedidos. El despacho solicita una dirección de al menos ocho caracteres. El retiro no solicita dirección. El despacho no tiene recargo en la demo: es una decisión de alcance, no una tarifa oficial. Los correos de usuarios son únicos al crear o editar cuentas. El borrado de un producto conserva los datos históricos de pedidos ya creados.

El estado puede seleccionarse libremente entre los tres estados de demostración. La demo no impone una secuencia irreversible ni cancela pedidos. No se simulan reparaciones de instrumentos, que no forman parte del flujo principal priorizado.

## Requisitos no funcionales

React + Vite + JavaScript, React Router y Bootstrap. Formularios con etiquetas y retroalimentación visible. Menú colapsable en móvil y tablas con desplazamiento horizontal. Objetivo de revisión: 360, 768 y 1280 px; revisión visual pendiente en equipo del estudiante. Pruebas repetibles con Vitest y React Testing Library. Mantener un repositorio con aportes reales y README de ejecución.

## Datos y persistencia

51 productos importados de la muestra oficial del catálogo, sin inventar las referencias restantes. Atributos: código, categoría, nombre, marca, modelo, stock, precio y descripción. Usuarios de ejemplo y pedidos generados localmente. El objeto sv-datos en localStorage reúne productos, usuarios y pedidos. No hay concurrencia ni sincronización entre pestañas o computadores. El guardado depende de que el navegador permita localStorage.

## Evolución posterior

P3/EFT: sustituir acceso demo y persistencia local por autenticación y autorización en backend Spring Boot, API REST, base de datos y demás requisitos semestrales. La protección frontend solo organiza la demostración; no garantiza confidencialidad. Implementar transacciones y control de concurrencia para evitar sobreventa real. Confirmar ubicación y puntos de retiro. Completar integración de pago según el alcance que establezca el docente.

## Criterios de aceptación

Desde una instalación limpia se puede ejecutar npm install, npm run dev, npm test y npm run build. Se puede demostrar una compra, verificar el descuento de stock, consultar su historial, ingresar con otra cuenta y verificar separación visual de pedidos, gestionar productos y usuarios como administrador y actualizar stock como vendedor. Las pruebas automatizadas incluidas corroboran una parte de estos flujos; el resto debe comprobarse en la revisión manual indicada.
