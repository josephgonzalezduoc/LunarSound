// Funciones pequeñas
export const moneda = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
export function filtrarProductos(productos, texto, categoria) {
  return productos.filter(
    (p) =>
      (categoria === "" || p.categoria === categoria) &&
      `${p.nombre} ${p.marca} ${p.modelo}`
        .toLowerCase()
        .includes(texto.toLowerCase().trim()),
  );
}
export function calcularTotal(carrito, productos) {
  return carrito.reduce(
    (total, item) =>
      total +
      (productos.find((p) => p.id === item.id)?.precio || 0) * item.cantidad,
    0,
  );
}
export function validarEntrega(tipo, direccion) {
  return tipo === "despacho" && direccion.trim().length < 8
    ? "Ingresa una dirección de al menos 8 caracteres."
    : "";
}
export function validarProducto(p) {
  if (!p.nombre.trim() || !p.categoria.trim() || !p.marca.trim())
    return "Completa nombre, categoría y marca.";
  if (!Number.isFinite(Number(p.precio)) || Number(p.precio) <= 0)
    return "El precio debe ser mayor a cero.";
  if (!Number.isInteger(Number(p.stock)) || Number(p.stock) < 0)
    return "El stock debe ser un entero mayor o igual a cero.";
  return "";
}
export function crearPedido(
  carrito,
  productos,
  usuario,
  tipo,
  direccion,
  fecha = new Date().toISOString(),
) {
  if (!carrito.length) throw new Error("El carrito está vacío.");
  const error = validarEntrega(tipo, direccion);
  if (error) throw new Error(error);
  for (const item of carrito) {
    const producto = productos.find((p) => p.id === item.id);
    if (
      !producto ||
      !Number.isInteger(item.cantidad) ||
      item.cantidad < 1 ||
      item.cantidad > producto.stock
    )
      throw new Error("Verifica stock disponible.");
  }
  return {
    id: crypto.randomUUID(),
    usuarioId: usuario.id,
    cliente: usuario.nombre,
    fecha,
    tipo,
    direccion: tipo === "despacho" ? direccion : "Retiro en tienda",
    estado: "En preparación",
    pago: "Pago aprobado",
    total: calcularTotal(carrito, productos),
    items: carrito.map((item) => ({
      ...item,
      nombre: productos.find((p) => p.id === item.id).nombre,
      precio: productos.find((p) => p.id === item.id).precio,
    })),
  };
}
