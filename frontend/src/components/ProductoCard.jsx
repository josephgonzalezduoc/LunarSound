import { Link } from "react-router-dom";
import { moneda } from "../utils/tienda";
export default function ProductoCard({ producto, onAgregar }) {
  return (
    <article className="card h-100">
      <div className="instrumento" aria-hidden="true">
        ♫
      </div>
      <div className="card-body d-flex flex-column">
        <small className="text-muted">
          {producto.categoria} · {producto.marca}
        </small>
        <h2 className="h5 mt-2">{producto.nombre}</h2>
        <p>{producto.modelo}</p>
        <strong className="fs-5">{moneda(producto.precio)}</strong>
        <p className={producto.stock ? "text-success" : "text-danger"}>
          {producto.stock ? `Stock: ${producto.stock}` : "Sin stock"}
        </p>
        <div className="mt-auto d-flex gap-2 flex-wrap">
          <Link
            className="btn btn-outline-dark"
            to={`/productos/${producto.id}`}
          >
            Ver detalle
          </Link>
          {onAgregar && (
            <button
              className="btn btn-primary"
              disabled={!producto.stock}
              onClick={() => onAgregar(producto.id)}
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
