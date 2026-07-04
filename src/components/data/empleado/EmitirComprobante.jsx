import { useState } from "react";
import flecha_izq from '../icons/flecha-izquierda.png';
import impresora from '../icons/impresora.png';
import descargas from '../icons/descargas.png';
import { comprobanteService } from "../../../services/resourceServices";

export default function EmitirComprobante({
  navegar,
  pedidos,
  setPedidos,
  mostrarNotificacion,
}) {
  const [tipoComprobante, setTipoComprobante] = useState("Boleta");
  const [nombreCliente, setNombreCliente] = useState(pedidos[0]?.cliente || "");
  const [razonSocial, setRazonSocial] = useState("");
  const [ruc, setRuc] = useState("");
  const [direccion, setDireccion] = useState(pedidos[0]?.delivery?.direccionEntrega || pedidos[0]?.direccionCliente || "");

  const [pedidoId, setPedidoId] = useState(pedidos[0]?.id || "");
  const pedidoSeleccionado = pedidos.find((pedido) => String(pedido.id) === String(pedidoId)) || null;
  const direccionPedido = pedidoSeleccionado?.delivery?.direccionEntrega || pedidoSeleccionado?.direccionCliente || "No registrada";

  const seleccionarPedido = (id) => {
    setPedidoId(id);
    const pedido = pedidos.find((item) => String(item.id) === String(id));
    setNombreCliente(pedido?.cliente || "");
    setDireccion(pedido?.delivery?.direccionEntrega || pedido?.direccionCliente || "");
  };

  const totalItems = pedidoSeleccionado?.detalles?.map((detalle) => ({
    descripcion: `${detalle.cantidad} x ${detalle.nombreProducto}`,
    monto: Number(detalle.subtotal),
  })) || [];

  const total = Number(pedidoSeleccionado?.total || 0);
  const subtotal = total / 1.18;

  const igv = subtotal * 0.18;
  const emitir = async (accion) => {
    if (!pedidoSeleccionado) return;
    try {
      const comprobante = await comprobanteService.crear({
        tipoComprobante,
        numeroComprobante: `${tipoComprobante === "Boleta" ? "B001" : "F001"}-${Date.now()}`,
        total,
        rucCliente: tipoComprobante === "Factura" ? ruc : null,
        razonSocial: tipoComprobante === "Factura" ? razonSocial : (nombreCliente || pedidoSeleccionado.cliente),
        direccionFiscal: tipoComprobante === "Factura" ? direccion : direccionPedido,
        idVenta: Number(pedidoSeleccionado.id),
      });
      setPedidos((prev) => prev.map((pedido) => String(pedido.id) === String(pedidoSeleccionado.id) ? { ...pedido, comprobante: comprobante.tipoComprobante } : pedido));
      mostrarNotificacion(`Comprobante ${accion}`);
    } catch (error) { mostrarNotificacion(error); }
  };

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
          <select className="campo-texto" style={{ marginBottom: 18 }} value={pedidoId} onChange={(e) => seleccionarPedido(e.target.value)}>
            {pedidos.map((pedido) => <option key={pedido.id} value={pedido.id}>Pedido #{pedido.id} - {pedido.cliente}</option>)}
          </select>
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
              onClick={() => emitir("impreso")}
            >
              <img src={impresora} alt="Impresora" style={{ width: 25, height: 25 }} />
              IMPRIMIR
            </button>

            <button className="btn-primario" style={{ padding: "10px 14px", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => emitir("generado")}
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
              <div>
                Cliente: {nombreCliente || pedidoSeleccionado?.cliente || "-"}<br />
                Dirección: {direccionPedido}
              </div>
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
