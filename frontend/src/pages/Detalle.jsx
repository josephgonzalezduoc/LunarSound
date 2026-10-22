import { useParams, Link } from "react-router-dom";
import { moneda } from "../utils/tienda";
export default function Detalle({ productos, onAgregar }) {
  const { id } = useParams();
  const p = productos.find((p) => p.id === id);
  if (!p)
    return (
      <p>
        Producto no encontrado. <Link to="/">Volver</Link>
      </p>
    );
  return (
    <article className="card p-4">
      <Link to="/">← Volver al catálogo</Link>
      <h1 className="mt-3">{p.nombre}</h1>
      <p>
        {p.marca} · {p.modelo} · {p.categoria}
      </p>
      <p>{p.descripcion}</p>
      <strong className="fs-3">{moneda(p.precio)}</strong>
      <p>Stock disponible: {p.stock}</p>
      {onAgregar && (
        <button
          className="btn btn-primary align-self-start"
          disabled={!p.stock}
          onClick={() => onAgregar(p.id)}
        >
          Agregar al carrito
        </button>
      )}
    </article>
  );
}
