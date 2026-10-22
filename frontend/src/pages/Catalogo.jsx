import { useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { filtrarProductos } from "../utils/tienda";
export default function Catalogo({ productos, onAgregar }) {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("");
  const lista = filtrarProductos(productos, texto, categoria);
  return (
    <>
      <section className="hero mb-4">
        <small>INSTRUMENTOS Y EQUIPOS MUSICALES</small>
        <h1>Encuentra el sonido que te lleve a la luna</h1>
        <p>Instrumentos, amplificadores y accesorios en un solo lugar.</p>
      </section>
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <label htmlFor="buscar" className="form-label">
            Buscar por nombre, marca o modelo
          </label>
          <input
            id="buscar"
            className="form-control"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ejemplo: Yamaha"
          />
        </div>
        <div className="col-md-5">
          <label htmlFor="categoria" className="form-label">
            Categoría
          </label>
          <select
            id="categoria"
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {[...new Set(productos.map((p) => p.categoria))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <p>{lista.length} productos encontrados</p>
      <div className="row g-4">
        {lista.map((p) => (
          <div className="col-sm-6 col-lg-4" key={p.id}>
            <ProductoCard producto={p} onAgregar={onAgregar} />
          </div>
        ))}
      </div>
      {!lista.length && (
        <p role="status">No encontramos productos con esos filtros.</p>
      )}
    </>
  );
}
