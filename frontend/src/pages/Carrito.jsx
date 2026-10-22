import { useState } from "react";
import { calcularTotal, moneda } from "../utils/tienda";
export default function Carrito({
  carrito,
  productos,
  onCantidad,
  onQuitar,
  onConfirmar,
}) {
  const [tipo, setTipo] = useState("retiro");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");
  function enviar(e) {
    e.preventDefault();
    try {
      onConfirmar(tipo, direccion);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <>
      <h1>Mi carrito</h1>
      {!carrito.length ? (
        <p>No tienes productos en tu carrito.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table bg-white">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => {
                  const p = productos.find((p) => p.id === item.id);
                  return (
                    <tr key={item.id}>
                      <td>{p?.nombre || "Producto eliminado"}</td>
                      <td>{moneda(p?.precio || 0)}</td>
                      <td>
                        <input
                          className="form-control cantidad"
                          aria-label={`Cantidad de ${p?.nombre}`}
                          type="number"
                          min="1"
                          max={p?.stock || 1}
                          value={item.cantidad}
                          onChange={(e) =>
                            onCantidad(item.id, Number(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onQuitar(item.id)}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h2 className="h4">
            Total: {moneda(calcularTotal(carrito, productos))}
          </h2>
          <form className="card p-3 mt-3" onSubmit={enviar}>
            <h2 className="h5">Entrega y pago</h2>
            <label htmlFor="entrega" className="form-label">
              Tipo de entrega
            </label>
            <select
              id="entrega"
              className="form-select mb-3"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="retiro">Retiro en tienda</option>
              <option value="despacho">Despacho a domicilio</option>
            </select>
            {tipo === "despacho" && (
              <>
                <label htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  className="form-control mb-3"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </>
            )}
            <p>
              Despacho gratuito.
            </p>
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <button className="btn btn-primary align-self-start">
              Confirmar pedido y continuar con pago
            </button>
          </form>
        </>
      )}
    </>
  );
}
