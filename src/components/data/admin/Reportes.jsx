import { useState } from "react";
import { jsPDF } from "jspdf";
import descargas from '../icons/descargas.png';

export default function Reportes({ pedidos, productos, mostrarNotificacion }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const fecha = pedido.fechaVenta ? new Date(pedido.fechaVenta) : null;
    if (!fecha || Number.isNaN(fecha.getTime())) return !fechaInicio && !fechaFin;
    if (fechaInicio && fecha < new Date(`${fechaInicio}T00:00:00`)) return false;
    if (fechaFin && fecha > new Date(`${fechaFin}T23:59:59`)) return false;
    return true;
  });
  const ventasTotal = pedidosFiltrados.reduce((s, p) => s + p.total, 0);
  const productosActivos = productos.filter((p) => p.estado).length;

  const masVendidos = Object.values(pedidosFiltrados.flatMap((pedido) => pedido.detalles || []).reduce((acumulado, detalle) => {
    const clave = detalle.idProducto;
    acumulado[clave] ||= { producto: detalle.nombreProducto, cantidad: 0, totalGenerado: 0 };
    acumulado[clave].cantidad += detalle.cantidad;
    acumulado[clave].totalGenerado += Number(detalle.subtotal);
    return acumulado;
  }, {})).sort((a, b) => b.cantidad - a.cantidad);

  const datosGrafico = [1, 2, 3, 4, 5, 6, 0].map((day) => pedidosFiltrados
    .filter((pedido) => new Date(pedido.fechaVenta).getDay() === day)
    .reduce((total, pedido) => total + Number(pedido.total), 0));
  const maxGrafico = Math.max(...datosGrafico);

  const exportarPdf = () => {
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      mostrarNotificacion("La fecha inicial no puede ser posterior a la fecha final", "error");
      return;
    }

    try {
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const money = (value) => `S/ ${Number(value || 0).toFixed(2)}`;
      const period = fechaInicio || fechaFin
        ? `${fechaInicio || "Inicio"} al ${fechaFin || "Hoy"}`
        : "Todos los registros";
      let y = 20;

      pdf.setFillColor(192, 57, 43);
      pdf.rect(0, 0, 210, 34, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("IKIGAI DELI EXPRESS", 16, 16);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("Reporte de ventas y productos", 16, 24);

      pdf.setTextColor(45, 45, 45);
      y = 46;
      pdf.setFontSize(10);
      pdf.text(`Periodo: ${period}`, 16, y);
      pdf.text(`Generado: ${new Date().toLocaleString("es-PE")}`, 194, y, { align: "right" });

      y += 12;
      const cards = [
        ["Ventas", money(ventasTotal)],
        ["Pedidos", String(pedidosFiltrados.length)],
        ["Productos activos", String(productosActivos)],
      ];
      cards.forEach(([label, value], index) => {
        const x = 16 + index * 61;
        pdf.setFillColor(248, 246, 245);
        pdf.roundedRect(x, y, 55, 25, 3, 3, "F");
        pdf.setFontSize(8);
        pdf.setTextColor(110, 105, 102);
        pdf.text(label, x + 5, y + 8);
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(40, 40, 40);
        pdf.text(value, x + 5, y + 18);
        pdf.setFont("helvetica", "normal");
      });

      y += 38;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Productos más vendidos", 16, y);
      y += 8;
      pdf.setFillColor(238, 234, 232);
      pdf.rect(16, y - 5, 178, 8, "F");
      pdf.setFontSize(9);
      pdf.text("Producto", 19, y);
      pdf.text("Cantidad", 142, y, { align: "right" });
      pdf.text("Total", 191, y, { align: "right" });
      pdf.setFont("helvetica", "normal");

      if (!masVendidos.length) {
        y += 10;
        pdf.setTextColor(120, 120, 120);
        pdf.text("No hay ventas en el periodo seleccionado.", 19, y);
      } else {
        masVendidos.forEach((product, index) => {
          y += 9;
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
          if (index % 2) {
            pdf.setFillColor(250, 249, 248);
            pdf.rect(16, y - 6, 178, 8, "F");
          }
          pdf.setTextColor(45, 45, 45);
          pdf.text(pdf.splitTextToSize(product.producto || "Producto", 105)[0], 19, y);
          pdf.text(String(product.cantidad), 142, y, { align: "right" });
          pdf.text(money(product.totalGenerado), 191, y, { align: "right" });
        });
      }

      const suffix = `${fechaInicio || "inicio"}-${fechaFin || "hoy"}`;
      pdf.save(`reporte-ventas-${suffix}.pdf`);
      mostrarNotificacion("Reporte PDF descargado correctamente");
    } catch (error) {
      mostrarNotificacion(`No se pudo generar el PDF: ${error.message || error}`, "error");
    }
  };

  return (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
      <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Reportes</h5>

      <button className="btn-primario" style={{ padding: "10px 14px", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={exportarPdf}>
        <img src={descargas} alt="Descarga" style={{ width: 25, height: 25 }} /> EXPORTAR A PDF
      </button>
    </div>

    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 10, color: "#555" }}>
        Filtrar por Fecha
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <input className="campo-texto" type="date" style={{ width: 180, padding: "12px", fontSize: "1rem" }} value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        <input className="campo-texto" type="date" style={{ width: 180, padding: "12px", fontSize: "1rem" }} value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
      </div>
    </div>

    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 26 }}>

      <div className="tarjeta-stat">
        <div className="etiqueta">Ventas del día</div>
        <div className="valor" style={{ fontSize: "1.6rem" }}>S/{ventasTotal.toFixed(2)}</div>
      </div>

      <div className="tarjeta-stat">
        <div className="etiqueta">Pedidos Registrados</div>
        <div className="valor">{pedidosFiltrados.length}</div>
      </div>

      <div className="tarjeta-stat">
        <div className="etiqueta">Productos Activos</div>
        <div className="valor">{productosActivos}</div>
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
