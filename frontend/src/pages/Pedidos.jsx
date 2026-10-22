import { moneda } from "../utils/tienda";
export default function Pedidos({ pedidos, usuario, onEstado }) {
  const visibles =
    usuario.rol === "Cliente"
      ? pedidos.filter((p) => p.usuarioId === usuario.id)
      : pedidos;
  return (
    <>
      <h1>
        {usuario.rol === "Cliente" ? "Mis pedidos" : "Gestión de pedidos"}
      </h1>
      {!visibles.length && <p>Aún no hay pedidos.</p>}
      {visibles.map((p) => (
        <article className="card p-3 mb-3" key={p.id}>
          <h2 className="h5">Pedido {p.id.slice(0, 8)}</h2>
          <p>
            {p.cliente} · {new Date(p.fecha).toLocaleString("es-CL")}
          </p>
          <ul>
            {p.items.map((i) => (
              <li key={i.id}>
                {i.nombre} × {i.cantidad} — {moneda(i.precio * i.cantidad)}
              </li>
            ))}
          </ul>
          <p>
            {p.direccion} · {p.pago}
          </p>
          <strong>Total: {moneda(p.total)}</strong>
          <p className="mt-2">Estado: {p.estado}</p>
          {usuario.rol !== "Cliente" && (
            <>
              <label htmlFor={`estado-${p.id}`}>Actualizar estado</label>
              <select
                id={`estado-${p.id}`}
                className="form-select"
                value={p.estado}
                onChange={(e) => onEstado(p.id, e.target.value)}
              >
                {["En preparación", "Despachado", "Entregado"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </>
          )}
        </article>
      ))}
    </>
  );
}
