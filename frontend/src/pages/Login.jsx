import { useState } from "react";
import { claveDemo } from "../data/usuarios";
export default function Login({ usuarios, onIngresar }) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  function enviar(e) {
    e.preventDefault();
    const usuario = usuarios.find(
      (u) => u.correo === correo.trim().toLowerCase() && u.activo,
    );
    if (!usuario || clave !== claveDemo) {
      setError("Correo o contraseña incorrectos, o cuenta desactivada.");
      return;
    }
    onIngresar(usuario.id);
  }
  return (
    <section className="login card p-4 mx-auto">
      <span className="text-primary fw-bold">Lunar Sound</span>
      <h1 className="mt-2">Una experiencia de sonido lunar.</h1>
      <p>Ingresa para explorar el catálogo.</p>
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      <form onSubmit={enviar}>
        <label className="form-label" htmlFor="correo">
          Correo
        </label>
        <input
          id="correo"
          className="form-control mb-3"
          type="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <label className="form-label" htmlFor="clave">
          Contraseña
        </label>
        <input
          id="clave"
          className="form-control mb-3"
          type="password"
          required
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        <button className="btn btn-primary w-100">Ingresar</button>
      </form>
      <details className="mt-4">
        <summary>Cuentas de prueba</summary>
        <p className="mt-2">Contraseña: claveprueba123</p>
        <ul>
          {usuarios
            .filter((u) => u.activo)
            .map((u) => (
              <li key={u.id}>
                {u.correo} — {u.rol}
              </li>
            ))}
        </ul>
      </details>
    </section>
  );
}
