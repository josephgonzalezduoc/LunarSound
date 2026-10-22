import { useState } from "react";
import { moneda } from "../utils/tienda";
export default function Resumen({ pedidos, productos }) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const lista = pedidos.filter(
    (p) =>
      (!desde || p.fecha.slice(0, 10) >= desde) &&
      (!hasta || p.fecha.slice(0, 10) <= hasta),
  );
  return (
    <>
      <h1>Resumen de ventas</h1>
      <div className="row g-3 mb-4">
        {[
          ["Desde", desde, setDesde],
          ["Hasta", hasta, setHasta],
        ].map(([label, value, set]) => (
          <div key={label} className="col-sm-6">
            <label htmlFor={label}>{label}</label>
            <input
              id={label}
              className="form-control"
              type="date"
              value={value}
              onChange={(e) => set(e.target.value)}
            />
          </div>
        ))}
      </div>
      {desde && hasta && desde > hasta ? (
        <p role="alert">La fecha inicial debe ser anterior a la final.</p>
      ) : (
        <div className="row g-3">
          {[
            ["Pedidos", lista.length],
            [
              "Total ventas",
              moneda(lista.reduce((s, p) => s + p.total, 0)),
            ],
            [
              "Productos sin stock",
              productos.filter((p) => p.stock === 0).length,
            ],
          ].map(([label, value]) => (
            <div className="col-md-4" key={label}>
              <article className="card p-4">
                <h2 className="h5">{label}</h2>
                <strong className="fs-3">{value}</strong>
              </article>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
