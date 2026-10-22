import { Navigate } from "react-router-dom";
export default function Protegida({ usuario, roles, children }) {
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol))
    return (
      <div className="alert alert-warning">
        No tienes permisos suficientes.
      </div>
    );
  return children;
}
