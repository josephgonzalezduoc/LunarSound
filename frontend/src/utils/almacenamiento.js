export function cargarDatos(clave, inicial) {
  try {
    const dato = localStorage.getItem(clave);
    return dato ? JSON.parse(dato) : inicial;
  } catch {
    return inicial;
  }
}
export function guardarDatos(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}
