import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { productosIniciales } from "./data/productos";
import { usuariosIniciales } from "./data/usuarios";
import { cargarDatos, guardarDatos } from "./utils/almacenamiento";
import { crearPedido } from "./utils/tienda";
import Protegida from "./components/Protegida";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import Inventario from "./pages/Inventario";
import Usuarios from "./pages/Usuarios";
import Resumen from "./pages/Resumen";
import Ubicacion from "./pages/Ubicacion";
export default function App() {
  // pedido y stock juntos
  const [datos, setDatos] = useState(() =>
    cargarDatos("sv-datos", {
      productos: productosIniciales,
      usuarios: usuariosIniciales,
      pedidos: [],
    }),
  );
  const [sesion, setSesion] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [menu, setMenu] = useState(false);
  const navegar = useNavigate();
  const usuario = datos.usuarios.find((u) => u.id === sesion && u.activo);
  const personal = usuario && usuario.rol !== "Cliente";
  const admin = usuario?.rol === "Administrador";
  useEffect(() => {
    guardarDatos("sv-datos", datos);
  }, [datos]);
  function agregar(id) {
    const p = datos.productos.find((p) => p.id === id);
    const actual = carrito.find((i) => i.id === id);
    if ((actual?.cantidad || 0) >= p.stock) {
      setMensaje("No hay más stock disponible.");
      return;
    }
    setCarrito(
      actual
        ? carrito.map((i) =>
            i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i,
          )
        : [...carrito, { id, cantidad: 1 }],
    );
    setMensaje("Producto agregado al carrito.");
  }
  function cantidad(id, valor) {
    const p = datos.productos.find((p) => p.id === id);
    if (p && Number.isInteger(valor) && valor >= 1 && valor <= p.stock)
      setCarrito(
        carrito.map((i) => (i.id === id ? { ...i, cantidad: valor } : i)),
      );
    else setMensaje("La cantidad debe estar entre 1 y el stock disponible.");
  }
  function confirmar(tipo, direccion) {
    const pedido = crearPedido(
      carrito,
      datos.productos,
      usuario,
      tipo,
      direccion,
    );
    setDatos({
      ...datos,
      pedidos: [pedido, ...datos.pedidos],
      productos: datos.productos.map((p) => ({
        ...p,
        stock: p.stock - (carrito.find((i) => i.id === p.id)?.cantidad || 0),
      })),
    });
    setCarrito([]);
    setMensaje("Pedido confirmado. Pago aprobado.");
    navegar("/pedidos");
  }
  function guardarProducto(p) {
    if (!personal) return;
    const anterior = datos.productos.find((x) => x.id === p.id);
    const nuevo = admin
      ? { ...p, id: p.id || crypto.randomUUID() }
      : { ...anterior, stock: p.stock };
    setDatos({
      ...datos,
      productos: anterior
        ? datos.productos.map((x) => (x.id === p.id ? nuevo : x))
        : [...datos.productos, nuevo],
    });
    setMensaje("Producto guardado.");
  }
  function guardarUsuario(u) {
    if (!admin) return;
    setDatos({
      ...datos,
      usuarios: u.id
        ? datos.usuarios.map((x) => (x.id === u.id ? u : x))
        : [...datos.usuarios, { ...u, id: crypto.randomUUID() }],
    });
    setMensaje("Usuario guardado.");
  }
  function proteger(contenido, roles) {
    return (
      <Protegida usuario={usuario} roles={roles}>
        {contenido}
      </Protegida>
    );
  }
  return (
    <>
      <header className="navbar navbar-dark bg-dark">
        <div className="container flex-wrap">
          <span className="navbar-brand fw-bold">☾ Lunar Sound ☽ </span>
          {usuario && (
            <>
              <button
                className="navbar-toggler d-md-none"
                aria-label="Abrir menú"
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                <span className="navbar-toggler-icon" />
              </button>
              <nav
                aria-label="Principal"
                className={`navegacion ${menu ? "abierto" : ""}`}
                onClick={() => setMenu(false)}
              >
                <NavLink to="/">Catálogo</NavLink>
                {!personal && (
                  <NavLink to="/carrito">
                    Carrito ({carrito.reduce((s, i) => s + i.cantidad, 0)})
                  </NavLink>
                )}
                <NavLink to="/pedidos">Pedidos</NavLink>
                <NavLink to="/ubicacion">Ubicación</NavLink>
                {personal && <NavLink to="/inventario">Inventario</NavLink>}
                {admin && (
                  <>
                    <NavLink to="/usuarios">Usuarios</NavLink>
                    <NavLink to="/resumen">Resumen</NavLink>
                  </>
                )}
              </nav>
              <div className="text-light small ms-md-auto">
                {usuario.nombre} · {usuario.rol}{" "}
                <button
                  className="btn btn-sm btn-outline-light ms-2"
                  onClick={() => {
                    setSesion(null);
                    setCarrito([]);
                    setMensaje("");
                    navegar("/login");
                  }}
                >
                  Salir
                </button>
              </div>
            </>
          )}
        </div>
      </header>
      <main className="container py-4">
        {mensaje && usuario && (
          <div
            role="status"
            className="alert alert-info d-flex justify-content-between"
          >
            {mensaje}
            <button
              className="btn-close"
              aria-label="Cerrar mensaje"
              onClick={() => setMensaje("")}
            />
          </div>
        )}
        <Routes>
          <Route
            path="/login"
            element={
              usuario ? (
                <Navigate to="/" />
              ) : (
                <Login
                  usuarios={datos.usuarios}
                  onIngresar={(id) => {
                    setSesion(id);
                    navegar("/");
                  }}
                />
              )
            }
          />
          <Route
            path="/"
            element={proteger(
              <Catalogo
                productos={datos.productos}
                onAgregar={!personal ? agregar : undefined}
              />,
            )}
          />
          <Route
            path="/productos/:id"
            element={proteger(
              <Detalle
                productos={datos.productos}
                onAgregar={!personal ? agregar : undefined}
              />,
            )}
          />
          <Route
            path="/carrito"
            element={proteger(
              <Carrito
                carrito={carrito}
                productos={datos.productos}
                onCantidad={cantidad}
                onQuitar={(id) =>
                  setCarrito(carrito.filter((i) => i.id !== id))
                }
                onConfirmar={confirmar}
              />,
              ["Cliente"],
            )}
          />
          <Route
            path="/pedidos"
            element={proteger(
              <Pedidos
                pedidos={datos.pedidos}
                usuario={usuario || {}}
                onEstado={(id, estado) => {
                  if (personal)
                    setDatos({
                      ...datos,
                      pedidos: datos.pedidos.map((p) =>
                        p.id === id ? { ...p, estado } : p,
                      ),
                    });
                }}
              />,
            )}
          />
          <Route
            path="/inventario"
            element={proteger(
              <Inventario
                productos={datos.productos}
                usuario={usuario || {}}
                onGuardar={guardarProducto}
                onEliminar={(id) => {
                  if (admin) {
                    setDatos({
                      ...datos,
                      productos: datos.productos.filter((p) => p.id !== id),
                    });
                    setCarrito(carrito.filter((i) => i.id !== id));
                  }
                }}
              />,
              ["Administrador", "Vendedor"],
            )}
          />
          <Route
            path="/usuarios"
            element={proteger(
              <Usuarios
                usuarios={datos.usuarios}
                usuarioActual={usuario || {}}
                onGuardar={guardarUsuario}
              />,
              ["Administrador"],
            )}
          />
          <Route
            path="/resumen"
            element={proteger(
              <Resumen pedidos={datos.pedidos} productos={datos.productos} />,
              ["Administrador"],
            )}
          />
          <Route path="/ubicacion" element={proteger(<Ubicacion />)} />
          <Route
            path="*"
            element={
              <p>
                Página no encontrada. <NavLink to="/">Volver al inicio</NavLink>
              </p>
            }
          />
        </Routes>
      </main>
      <footer className="container py-4 border-top text-muted">
        Lunar Sound · DUOC UC · Ingeniería en Informática
      </footer>
    </>
  );
}
