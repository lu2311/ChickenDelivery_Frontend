import { useState } from "react";
import flecha_izq from '../icons/flecha-izquierda.png';
import impresora from '../icons/impresora.png';
import descargas from '../icons/descargas.png';

export default function EmitirComprobante({
  navegar,
  pedidos,
  mostrarNotificacion,
}) {
  const [tipoComprobante, setTipoComprobante] = useState("Boleta");
  const [nombreCliente, setNombreCliente] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [ruc, setRuc] = useState("");
  const [direccion, setDireccion] = useState("");

  const [pedidoSeleccionado] = useState(
    pedidos[0] || null
  );

  const totalItems = pedidoSeleccionado
    ? [
      {
        descripcion: "2 x Pollo a la Brasa 1/4",
        monto: 36.0,
      },
      {
        descripcion: "1 x Inca Kola 1.5 L",
        monto: 5.5,
      },
    ]
    : [];

  const subtotal = totalItems.reduce(
    (s, i) => s + i.monto,
    0
  );

  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Emitir Comprobante</h5>
        <button className="btn-volver" style={{ padding: "10px 14px", fontSize: "1rem" }} onClick={() => navegar("empleado-home")}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img src={flecha_izq} alt="Flecha_izq" style={{ width: 15, height: 15 }} />
            VOLVER
          </div>
        </button>
      </div>

      <div className="contenedor-comprobante">

        <div className="form-comprobante" style={{ minWidth: 260 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, color: "#555" }}>
              Tipo de Comprobante
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer", fontSize: "0.98rem" }}>
              <input type="radio" checked={tipoComprobante === "Boleta"} onChange={() => setTipoComprobante("Boleta")} style={{ accentColor: "#c0392b", transform: "scale(1.1)" }} />
              Boleta
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer", fontSize: "0.98rem" }}>
              <input type="radio" checked={tipoComprobante === "Factura"} onChange={() => setTipoComprobante("Factura")} style={{ accentColor: "#c0392b", transform: "scale(1.1)" }} />
              Factura
            </label>
          </div>

          {tipoComprobante === "Boleta" && (
            <input
              className="campo-texto"
              style={{ marginBottom: 18, padding: "12px", fontSize: "1rem" }}
              placeholder="Nombre del Cliente"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
            />
          )}

          {tipoComprobante === "Factura" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <input
                className="campo-texto"
                placeholder="Razón Social"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
              />
              <input
                className="campo-texto"
                placeholder="RUC"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
              />

              <input
                className="campo-texto"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-secundario" style={{ padding: "10px 14px", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => mostrarNotificacion("Comprobante impreso")}
            >
              <img src={impresora} alt="Impresora" style={{ width: 25, height: 25 }} />
              IMPRIMIR
            </button>

            <button className="btn-primario" style={{ padding: "10px 14px", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => mostrarNotificacion("PDF descargado")}
            >
              <img src={descargas} alt="Descarga" style={{ width: 25, height: 25 }} />
              DESCARGAR PDF
            </button>
          </div>
        </div>

        <div className="comprobante-preview" style={{ padding: 18 }}>
          <div className="empresa-nombre" style={{ fontSize: "1.1rem" }}>
            IKAGI DELI EXPRESS EIRL
          </div>

          <div className="empresa-info" style={{ fontSize: "0.95rem" }}>
            RUC: 20123456789<br />
            Av. Principal 123, Lima<br />
            Tel: (01) 123-4567
          </div>

          <div style={{ height: 1, background: "#eee", margin: "14px 0" }} />

          <div className="tipo-comprobante" style={{ fontSize: "1rem", fontWeight: 700 }}>
            {tipoComprobante === "Boleta" ? "BOLETA DE VENTA" : "FACTURA"}
          </div>

          <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: 12 }}>
            Nº: 001-00123<br />
            Fecha: {new Date().toLocaleDateString("es-PE")}
          </div>

          <div style={{ fontSize: "0.95rem", marginBottom: 12 }}>
            {tipoComprobante === "Boleta" ? (
              <div>Cliente: {nombreCliente || "-"}</div>
            ) : (
              <div style={{ fontSize: "0.95rem", marginBottom: 12 }}>
                Razón Social: {razonSocial || "-"}<br />
                RUC: {ruc || "-"}<br />
                Dirección: {direccion || "-"}
              </div>
            )}
          </div>

          {totalItems.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", marginBottom: 6 }}>
              <span>{item.descripcion}</span>
              <span>S/ {item.monto.toFixed(2)}</span>
            </div>
          ))}

          <div style={{ height: 1, background: "#eee", margin: "12px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", marginBottom: 4 }}>
            <span>Subtotal:</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", marginBottom: 4 }}>
            <span>IGV (18%):</span>
            <span>S/ {igv.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 800, marginTop: 6 }}>
            <span>Total:</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}