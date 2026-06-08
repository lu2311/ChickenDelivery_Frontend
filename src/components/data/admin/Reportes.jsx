import { useState } from "react";
import descargas from '../icons/descargas.png';

export default function Reportes({ pedidos, productos }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const ventasTotal = pedidos.reduce((s, p) => s + p.total, 0);
  const productosActivos = productos.filter((p) => p.estado).length;

  const masVendidos = [
    {
      producto: "Pollo a la Brasa 1/4",
      cantidad: 2,
      totalGenerado: 36.0,
    },
    {
      producto: "Combo Familiar",
      cantidad: 1,
      totalGenerado: 75.0,
    },
  ];

  const datosGrafico = [116.5, 80, 95, 110, 116.5, 90, 0];
  const maxGrafico = Math.max(...datosGrafico);

  return (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
      <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Reportes</h5>

      <button className="btn-primario" style={{ padding: "10px 14px", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={() => alert("Exportando PDF...")}>
        <img src={descargas} alt="Descarga" style={{ width: 25, height: 25 }} /> EXPORTAR A PDF
      </button>
    </div>

    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 10, color: "#555" }}>
        Filtrar por Fecha
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <input className="campo-texto" style={{ width: 180, padding: "12px", fontSize: "1rem" }} placeholder="Fecha Inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        <input className="campo-texto" style={{ width: 180, padding: "12px", fontSize: "1rem" }} placeholder="Fecha Fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
      </div>
    </div>

    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 26 }}>

      <div className="tarjeta-stat">
        <div className="etiqueta">Ventas del día</div>
        <div className="valor" style={{ fontSize: "1.6rem" }}>S/{ventasTotal.toFixed(2)}</div>
      </div>

      <div className="tarjeta-stat">
        <div className="etiqueta">Pedidos Registrados</div>
        <div className="valor">{pedidos.length}</div>
      </div>

      <div className="tarjeta-stat">
        <div className="etiqueta">Productos Activos</div>
        <div className="valor">S/{productosActivos * 18}.25</div>
      </div>

      <div className="panel-pedido" style={{ flex: 1, minWidth: 260, padding: 16 }}>

        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: "1rem", color: "#555" }}>
          Ventas por Día
        </div>

        <div className="barra-chart" style={{ height: 100 }}>
          {datosGrafico.map((v, i) => (
            <div
              key={i}
              className="barra"
              style={{
                height: `${maxGrafico ? (v / maxGrafico) * 90 : 0}px`,
                background: "#c0392b",
                opacity: v === 0 ? 0.15 : 1
              }}
              title={`S/${v}`}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {["L", "M", "Mi", "J", "V", "S", "D"].map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "0.85rem", color: "#999" }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: "0.85rem", color: "#666" }}>
          <div style={{ width: 10, height: 10, background: "#c0392b", borderRadius: 2 }} />
          Ventas (S/)
        </div>

      </div>
    </div>

    <div className="panel-pedido" style={{ padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: "1rem" }}>
        Productos Más Vendidos
      </div>

      <table className="tabla-datos" style={{ fontSize: "0.95rem" }}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad Vendida</th>
            <th>Total Generado</th>
          </tr>
        </thead>

        <tbody>
          {masVendidos.map((p, i) => (
            <tr key={i}>
              <td>{p.producto}</td>
              <td>{p.cantidad}</td>
              <td>S/ {p.totalGenerado.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}