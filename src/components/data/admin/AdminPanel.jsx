export default function AdminPanel({ pedidos, productos }) {
  const ventasTotal = pedidos.reduce((s, p) => s + p.total, 0);
  const productosActivos = productos.filter((p) => p.estado).length;

  return (
    <div>
      <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 18 }}>Panel de Administración</h3>

      <div className="tarjeta-stat">
        <div className="etiqueta">Ventas del día</div>
        <div className="valor">S/{ventasTotal.toFixed(2)}</div>
      </div>

      <div className="tarjeta-stat">
        <div className="etiqueta">Productos Activos</div>
        <div className="valor">{productosActivos}</div>
      </div>
    </div>
  );
}