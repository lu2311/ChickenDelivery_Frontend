import { useState } from "react";
import lupa from '../icons/lupa.png';
import flecha_izq from '../icons/flecha-izquierda.png';

export default function HistorialPedidos({ navegar, pedidos }) {
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const pedidosFiltrados = pedidos.filter(p =>
    p.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.id.includes(busqueda)
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Historial de Pedidos</h5>
        <button className="btn-volver" style={{ padding: "10px 14px", fontSize: "1rem" }} onClick={() => navegar("empleado-home")}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img src={flecha_izq} alt="Flecha_izq" style={{ width: 15, height: 15 }} />
            VOLVER
          </div>
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <div className="buscador" style={{ flex: 2, minWidth: 220, padding: "10px" }}>
          <span><img src={lupa} alt="Lupa" style={{ width: '28px', height: '28px' }} /></span>
          <input style={{ fontSize: "1rem" }} placeholder="Buscar por cliente o Nº pedido..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        <input className="campo-texto" style={{ flex: 1, minWidth: 150, padding: "12px", fontSize: "1rem" }} type="text" placeholder="Fecha Inicio" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />

        <input className="campo-texto" style={{ flex: 1, minWidth: 150, padding: "12px", fontSize: "1rem" }} type="text" placeholder="Fecha Fin" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
      </div>

      <div className="panel-pedido" style={{ padding: 16 }}>
        <table className="tabla-datos" style={{ fontSize: "0.95rem" }}>
          <thead>
            <tr>
              <th>Nº Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Comprobante</th>
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 700, fontSize: "0.95rem" }}>{p.id}</td>
                <td style={{ fontSize: "0.95rem" }}>{p.fecha}</td>
                <td style={{ fontSize: "0.95rem" }}>{p.cliente}</td>
                <td style={{ fontSize: "0.95rem" }}>S/ {p.total.toFixed(2)}</td>
                <td>
                  <span className={p.comprobante === "Boleta" ? "badge-boleta" : "badge-factura"} style={{ fontSize: "0.9rem", padding: "4px 8px" }}>
                    {p.comprobante}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}