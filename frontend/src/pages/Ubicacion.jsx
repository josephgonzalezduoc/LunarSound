import { useEffect, useRef } from "react";
import L from "leaflet";
export default function Ubicacion() {
  const contenedor = useRef(null);
  useEffect(() => {
    const mapa = L.map(contenedor.current).setView([-33.623466, -70.799082], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapa);
    L.circleMarker([-33.623466, -70.799082], { radius: 10 })
      .addTo(mapa)
      .bindPopup("Ubicación Lunar Sound.");
    return () => mapa.remove();
  }, []);
  return (
    <>
      <h1>Ubicación y retiro</h1>
      <p>
        Cruce Calera de Tango, Región Metropolitana
      </p>
      <div
        ref={contenedor}
        className="mapa"
        aria-label="Mapa referencial de Calera de Tango"
      />
      <p className="mt-3">
        El mapa requiere conexión a internet. Confirma la dirección antes de
        retirar un pedido.
      </p>
    </>
  );
}
