import carrito_compras from '../icons/carrito-compras.png';
export default function Prediccion() {
  const alturas = [45, 35, 62, 55, 75, 80, 45, 70, 68, 50, 40, 65];
  const maxAltura = Math.max(...alturas);

  return (
    <div>
      <h5 style={{ fontWeight: 800, marginBottom: 26, fontSize: "1.3rem" }}>
        Predicción de venta para el día de mañana
      </h5>

      <div style={{ display: "flex", gap: 16, marginBottom: 26, flexWrap: "wrap" }}>
        <div className="tarjeta-stat">
          <div className="etiqueta">Ventas para mañana</div>
          <div className="valor" style={{ fontSize: "1.6rem" }}>S/200.90</div>
        </div>

        <div className="tarjeta-stat">
          <div className="etiqueta">Pedidos previstos</div>
          <div className="valor" style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={carrito_compras} alt="Carro_compras" style={{ width: "35px", height: "35px" }} />
            12
          </div>
        </div>
      </div>

      <div className="panel-pedido" style={{ maxWidth: 700, padding: 16 }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, color: "#555" }}>
          Distribución por hora
        </div>

        <div className="prediccion-barra" style={{ height: 120 }}>
          {alturas.map((h, i) => (
            <div
              key={i}
              className="col"
              style={{ height: `${(h / maxAltura) * 110}px` }}
              title={`${i + 9}:00 - S/${(h * 2).toFixed(0)}`}
            />
          ))}
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "0.85rem", color: "#999" }}>
              {i + 9}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, fontSize: "0.85rem", color: "#888" }}>
          Hora del día (horas)
        </div>
      </div>
    </div>
  );
}
