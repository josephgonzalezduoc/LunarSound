import { useState } from "react";
export default function Usuarios({ usuarios, onGuardar, usuarioActual }) {
  const vacio = { nombre: "", correo: "", rol: "Cliente", activo: true };
  const [form, setForm] = useState(vacio);
  const [error, setError] = useState("");
  function enviar(e) {
    e.preventDefault();
    if (
      !form.nombre.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)
    ) {
      setError("Ingresa un nombre y correo válidos.");
      return;
    }
    if (
      usuarios.some(
        (u) =>
          u.correo === form.correo.trim().toLowerCase() && u.id !== form.id,
      )
    ) {
      setError("Ese correo ya existe.");
      return;
    }
    onGuardar({
      ...form,
      nombre: form.nombre.trim(),
      correo: form.correo.trim().toLowerCase(),
    });
    setForm(vacio);
    setError("");
  }
  return (
    <>
      <h1>Administración de usuarios</h1>
      <p>
        Las cuentas nuevas usan la contraseña claveprueba123.
      </p>
      <form onSubmit={enviar} className="card p-3 mb-4">
        <h2 className="h5">{form.id ? "Editar usuario" : "Crear usuario"}</h2>
        {["nombre", "correo"].map((c) => (
          <div key={c}>
            <label className="form-label" htmlFor={`u-${c}`}>
              {c === "nombre" ? "Nombre" : "Correo"}
            </label>
            <input
              id={`u-${c}`}
              type={c === "correo" ? "email" : "text"}
              className="form-control mb-2"
              required
              value={form[c]}
              onChange={(e) => setForm({ ...form, [c]: e.target.value })}
            />
          </div>
        ))}
        <label htmlFor="rol">Rol</label>
        <select
          id="rol"
          className="form-select mb-3"
          value={form.rol}
          disabled={form.id === usuarioActual.id}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
        >
          {["Cliente", "Vendedor", "Administrador"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            className="me-2"
            checked={form.activo}
            disabled={form.id === usuarioActual.id}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          Cuenta activa
        </label>
        {error && <p role="alert">{error}</p>}
        <div className="mt-3">
          <button className="btn btn-primary me-2">Guardar usuario</button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setForm(vacio);
              setError("");
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{u.activo ? "Activo" : "Desactivado"}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setForm({ ...u })}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
