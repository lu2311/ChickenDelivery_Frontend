import usuarios from '../icons/usuarios.png';
import historial from '../icons/historial.png';
import comprobante from '../icons/comprobante.png';

export default function EmpleadoHome({ navegar, pedidos, usuario }) {
  const ventasHoy = pedidos.reduce((s, p) => s + p.total, 0);
  return (
    <div>
      <h5 style={{ fontWeight: 800, marginBottom: 18, fontSize: "1.8rem" }}> Bienvenido, {usuario?.nombre}</h5>

      <button className="btn-primario" style={{ marginBottom: 24, padding: "14px", fontSize: "1rem" }} onClick={() => navegar("nuevo-pedido")}>
        + NUEVO PEDIDO
      </button>

      <div style={{ marginBottom: 24, display: "flex", gap: 14 }}>
        <div className="tarjeta-stat" style={{ padding: "16px 18px" }}>
          <div className="etiqueta" style={{ fontSize: "1.2rem" }}>Pedidos de Hoy</div>
          <div className="valor" style={{ fontSize: "1.6rem" }}>{pedidos.length}</div>
        </div>

        <div className="tarjeta-stat" style={{ padding: "16px 18px" }}>
          <div className="etiqueta" style={{ fontSize: "1.2rem" }}>Ventas de Hoy</div>
          <div className="valor" style={{ fontSize: "1.6rem" }}>S/{ventasHoy.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ marginBottom: 10, fontWeight: 700, fontSize: "1.6rem" }}>Acceso Rápido</div>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-acceso-rapido" style={{ padding: "12px 14px", fontSize: "1.2rem" }} onClick={() => navegar("clientes")}><span className="icono" style={{ fontSize: "1.1rem" }}><img src={usuarios} alt="Clientes" style={{ width: '60px', height: '60px'}}/></span>Clientes</button>
        <button className="btn-acceso-rapido" style={{ padding: "12px 14px", fontSize: "1.2rem" }} onClick={() => navegar("historial")}><span className="icono" style={{ fontSize: "1.1rem" }}><img src={historial} alt="Historial" style={{ width: '60px', height: '60px'}}/></span>Historial</button>
        <button className="btn-acceso-rapido" style={{ padding: "12px 14px", fontSize: "1.2rem" }} onClick={() => navegar("emitir-comprobante")}><span className="icono" style={{ fontSize: "1.1rem" }}><img src={comprobante} alt="Historial" style={{ width: '60px', height: '60px'}}/></span>Emitir Comprobante</button>
      </div>
    </div>
  );
}