import { useState } from "react";
import { moneda, validarProducto } from "../utils/tienda";
const vacio = {
  nombre: "",
  marca: "",
  modelo: "",
  categoria: "",
  precio: "",
  stock: "",
  descripcion: "",
};
export default function Inventario({
  productos,
  usuario,
  onGuardar,
  onEliminar,
}) {
  const [form, setForm] = useState(vacio);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  function enviar(e) {
    e.preventDefault();
    const mensaje = validarProducto(form);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    onGuardar({
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
    });
    setForm(vacio);
    setError("");
  }
  function campo(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const admin = usuario.rol === "Administrador";
  return (
    <>
      <h1>Inventario</h1>
      <p>
        {admin
          ? "Crear, editar y eliminar productos."
          : "Selecciona un producto para actualizar su stock."}
      </p>
      <form className="card p-3 mb-4" onSubmit={enviar}>
        <h2 className="h5">{form.id ? "Editar producto" : "Nuevo producto"}</h2>
        {!admin && !form.id ? (
          <p>Primero selecciona Editar stock en la tabla.</p>
        ) : (
          <>
            <div className="row g-3">
              {[
                ["nombre", "Nombre"],
                ["marca", "Marca"],
                ["modelo", "Modelo"],
                ["categoria", "Categoría"],
                ["precio", "Precio CLP"],
                ["stock", "Stock"],
                ["descripcion", "Descripción"],
              ].map(([name, label]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    className="form-control"
                    type={
                      ["precio", "stock"].includes(name) ? "number" : "text"
                    }
                    min={name === "precio" ? 1 : 0}
                    step="1"
                    disabled={!admin && name !== "stock"}
                    value={form[name]}
                    onChange={campo}
                    required={name !== "modelo" && name !== "descripcion"}
                  />
                </div>
              ))}
            </div>
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-primary">Guardar</button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setForm(vacio);
                  setError("");
                }}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </form>
      <label htmlFor="filtro-inventario">Buscar producto</label>
      <input
        id="filtro-inventario"
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos
              .filter((p) =>
                p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
              )
              .map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{moneda(p.precio)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setForm({ ...p })}
                    >
                      {admin ? "Editar" : "Editar stock"}
                    </button>
                    {admin && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar ${p.nombre}?`))
                            onEliminar(p.id);
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
