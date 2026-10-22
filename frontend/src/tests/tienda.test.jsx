import { it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  filtrarProductos,
  calcularTotal,
  validarProducto,
  validarEntrega,
  crearPedido,
} from "../utils/tienda";
import { guardarDatos, cargarDatos } from "../utils/almacenamiento";
import ProductoCard from "../components/ProductoCard";
import Login from "../pages/Login";
import Pedidos from "../pages/Pedidos";
import Catalogo from "../pages/Catalogo";
import Protegida from "../components/Protegida";
import App from "../App";
const p = {
  id: "p1",
  nombre: "Guitarra",
  marca: "Yamaha",
  modelo: "F310",
  categoria: "Cuerdas",
  precio: 100,
  stock: 2,
};
afterEach(() => vi.restoreAllMocks());
it("01 filtra por marca y categoría", () => {
  expect(filtrarProductos([p], "YAMAHA", "Cuerdas")).toEqual([p]);
  expect(filtrarProductos([p], "Yamaha", "Teclas")).toEqual([]);
});
it("02 calcula total según cantidad y precio del catálogo", () => {
  expect(calcularTotal([{ id: "p1", cantidad: 2 }], [p])).toBe(200);
  expect(calcularTotal([], [p])).toBe(0);
});
it("03 valida precio y stock del producto", () => {
  expect(validarProducto({ ...p, precio: 0 })).not.toBe("");
  expect(validarProducto({ ...p, stock: -1 })).not.toBe("");
  expect(validarProducto({ ...p, stock: 1.5 })).not.toBe("");
  expect(validarProducto(p)).toBe("");
});
it("04 exige dirección para despacho y no para retiro", () => {
  expect(validarEntrega("despacho", "")).not.toBe("");
  expect(validarEntrega("retiro", "")).toBe("");
  expect(validarEntrega("despacho", "Calle Uno 123")).toBe("");
});
it("05 rechaza carrito vacío y cantidades superiores al stock", () => {
  expect(() => crearPedido([], [p], { id: "u1" }, "retiro", "")).toThrow(
    "vacío",
  );
  expect(() =>
    crearPedido([{ id: "p1", cantidad: 3 }], [p], { id: "u1" }, "retiro", ""),
  ).toThrow("stock");
});
it("06 crea pedido con cliente y precios históricos", () => {
  const pedido = crearPedido(
    [{ id: "p1", cantidad: 2 }],
    [p],
    { id: "u1", nombre: "Ana" },
    "retiro",
    "",
    "2026-10-19T12:00:00Z",
  );
  expect(pedido).toMatchObject({
    usuarioId: "u1",
    total: 200,
    estado: "En preparación",
  });
  expect(pedido.items[0]).toMatchObject({
    nombre: "Guitarra",
    precio: 100,
    cantidad: 2,
  });
});
it("07 usa un spy para verificar persistencia JSON real", () => {
  const spy = vi.spyOn(Storage.prototype, "setItem");
  guardarDatos("prueba", { stock: 2 });
  expect(spy).toHaveBeenCalledWith("prueba", '{"stock":2}');
  expect(cargarDatos("prueba", {})).toEqual({ stock: 2 });
});
it("08 recupera datos iniciales si localStorage está corrupto", () => {
  localStorage.setItem("prueba", "{invalido");
  expect(cargarDatos("prueba", [])).toEqual([]);
});
it("09 renderiza props y llama al mock de agregar", async () => {
  const agregar = vi.fn();
  render(
    <MemoryRouter>
      <ProductoCard producto={p} onAgregar={agregar} />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "Guitarra" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Agregar" }));
  expect(agregar).toHaveBeenCalledWith("p1");
});
it("10 deshabilita agregar cuando no hay stock", () => {
  render(
    <MemoryRouter>
      <ProductoCard producto={{ ...p, stock: 0 }} onAgregar={vi.fn()} />
    </MemoryRouter>,
  );
  expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();
});
it("11 muestra error con credenciales incorrectas", async () => {
  const ingresar = vi.fn();
  render(<Login usuarios={[]} onIngresar={ingresar} />);
  await userEvent.type(
    screen.getByLabelText("Correo electrónico"),
    "falso@correo.cl",
  );
  await userEvent.type(screen.getByLabelText("Contraseña"), "incorrecta");
  await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
  expect(screen.getByRole("alert")).toHaveTextContent("incorrectos");
  expect(ingresar).not.toHaveBeenCalled();
});
it("12 permite ingresar con cuenta activa y clave prueba", async () => {
  const ingresar = vi.fn();
  render(
    <Login
      usuarios={[
        { id: "u1", nombre: "Ana", correo: "ana@correo.cl", activo: true },
      ]}
      onIngresar={ingresar}
    />,
  );
  await userEvent.type(
    screen.getByLabelText("Correo electrónico"),
    "ana@correo.cl",
  );
  await userEvent.type(screen.getByLabelText("Contraseña"), "claveprueba1234");
  await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
  expect(ingresar).toHaveBeenCalledWith("u1");
});
it("13 cliente solo ve pedidos propios", () => {
  const base = {
    fecha: "2026-10-19T12:00:00Z",
    items: [],
    total: 0,
    estado: "En preparación",
  };
  render(
    <Pedidos
      usuario={{ id: "u1", rol: "Cliente" }}
      pedidos={[
        { ...base, id: "pedido-1", usuarioId: "u1", cliente: "Ana" },
        { ...base, id: "pedido-2", usuarioId: "u2", cliente: "Luis" },
      ]}
    />,
  );
  expect(screen.getByText(/Ana/)).toBeInTheDocument();
  expect(screen.queryByText(/Luis/)).not.toBeInTheDocument();
});
it("14 filtra catálogo mediante escritura y muestra vacío", async () => {
  render(
    <MemoryRouter>
      <Catalogo productos={[p]} />
    </MemoryRouter>,
  );
  await userEvent.type(
    screen.getByLabelText("Buscar por nombre, marca o modelo"),
    "Batería",
  );
  expect(screen.getByRole("status")).toHaveTextContent("No encontramos");
});
it("15 bloquea sección administrativa a cliente", () => {
  render(
    <MemoryRouter>
      <Protegida usuario={{ rol: "Cliente" }} roles={["Administrador"]}>
        <p>Secreto</p>
      </Protegida>
    </MemoryRouter>,
  );
  expect(screen.getByText(/No tienes permisos/)).toBeInTheDocument();
  expect(screen.queryByText("Secreto")).not.toBeInTheDocument();
});
it("16 compra completa descuenta stock y separa historial entre clientes", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>,
  );
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "cliente@lunarsound.cl",
  );
  await user.type(screen.getByLabelText("Contraseña"), "claveprueba123");
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
  await user.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
  await user.click(screen.getByRole("link", { name: "Carrito (1)" }));
  await user.click(
    screen.getByRole("button", { name: "Confirmar pedido y continuar con el pago" }),
  );
  expect(
    screen.getByRole("heading", { name: "Mis pedidos" }),
  ).toBeInTheDocument();
  const datos = JSON.parse(localStorage.getItem("sv-datos"));
  expect(datos.pedidos).toHaveLength(1);
  expect(datos.productos[0].stock).toBe(7);
  await user.click(screen.getByRole("button", { name: "Salir" }));
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "otro@lunarsound.cl",
  );
  await user.type(screen.getByLabelText("Contraseña"), "claveprueba1234");
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
  await user.click(screen.getByRole("link", { name: "Pedidos" }));
  expect(screen.getByText("Aún no hay pedidos.")).toBeInTheDocument();
});
it("17 administrador crea y edita producto desde el formulario", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>,
  );
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "admin@lunarsound.cl",
  );
  await user.type(screen.getByLabelText("Contraseña"), "claveprueba1234");
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
  await user.click(screen.getByRole("link", { name: "Inventario" }));
  await user.type(
    screen.getByLabelText("Nombre", { exact: true }),
    "Producto prueba",
  );
  await user.type(screen.getByLabelText("Marca", { exact: true }), "Demo");
  await user.type(
    screen.getByLabelText("Categoría", { exact: true }),
    "Pruebas",
  );
  await user.type(screen.getByLabelText("Precio CLP"), "5000");
  await user.type(screen.getByLabelText("Stock", { exact: true }), "3");
  await user.click(
    screen.getByRole("button", { name: "Guardar", exact: true }),
  );
  await user.type(screen.getByLabelText("Buscar producto"), "Producto prueba");
  expect(
    screen.getByRole("cell", { name: "Producto prueba" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Editar", exact: true }));
  await user.clear(screen.getByLabelText("Stock", { exact: true }));
  await user.type(screen.getByLabelText("Stock", { exact: true }), "5");
  await user.click(
    screen.getByRole("button", { name: "Guardar", exact: true }),
  );
  expect(
    JSON.parse(localStorage.getItem("sv-datos")).productos.find(
      (p) => p.nombre === "Producto prueba",
    ).stock,
  ).toBe(5);
});
it("18 administrador crea usuario y evita correo duplicado", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>,
  );
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "admin@lunarsound.cl",
  );
  await user.type(screen.getByLabelText("Contraseña"), "claveprueba123");
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
  await user.click(screen.getByRole("link", { name: "Usuarios" }));
  await user.type(screen.getByLabelText("Nombre", { exact: true }), "Nuevo");
  await user.type(
    screen.getByLabelText("Correo", { exact: true }),
    "nuevo@demo.cl",
  );
  await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
  expect(
    screen.getByRole("cell", { name: "nuevo@prueba.cl" }),
  ).toBeInTheDocument();
  await user.type(
    screen.getByLabelText("Nombre", { exact: true }),
    "Duplicado",
  );
  await user.type(
    screen.getByLabelText("Correo", { exact: true }),
    "nuevo@prueba.cl",
  );
  await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
  expect(screen.getByRole("alert")).toHaveTextContent("ya existe");
});
