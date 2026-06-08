import { useState } from "react";
import lupa from '../icons/lupa.png';
import flecha_izq from '../icons/flecha-izquierda.png';

export default function NuevoPedido({
  navegar,
  clientes,
  productos,
  pedidos,
  setPedidos,
  mostrarNotificacion
}) {
  const [nombre, setNombre] = useState("");
  const [dniTelefono, setDniTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [categoriaActiva, setCategoriaActiva] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [itemsPedido, setItemsPedido] = useState([]);

  const categorias = ["TODOS", "POLLO", "BEBIDAS", "COMBOS"];

  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria =
      categoriaActiva === "TODOS" ||
      p.categoria.toUpperCase() === categoriaActiva;

    const coincideBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda && p.estado;
  });

  const agregarProducto = (prod) => {
    setItemsPedido((prev) => {
      const existe = prev.find((i) => i.id === prod.id);

      if (existe) {
        return prev.map((i) =>
          i.id === prod.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }

      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, delta) => {
    setItemsPedido((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, cantidad: Math.max(1, i.cantidad + delta) }
            : i
        )
        .filter(
          (i) => !(i.id === id && i.cantidad + delta < 1)
        )
    );
  };

  const total = itemsPedido.reduce(
    (s, i) => s + i.precio * i.cantidad,
    0
  );

  const registrarPedido = () => {
    if (!nombre || itemsPedido.length === 0) return;

    const nuevoPedido = {
      id: String(pedidos.length + 1).padStart(3, "0"),
      fecha:
        new Date().toLocaleDateString("es-PE") +
        " " +
        new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      cliente: nombre,
      total,
      comprobante: "Boleta",
    };

    setPedidos((prev) => [...prev, nuevoPedido]);

    mostrarNotificacion("Pedido registrado correctamente");
    navegar("empleado-home");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Registro de Pedido</h5>

        <button className="btn-volver" style={{ padding: "10px 14px", fontSize: "1rem" }} onClick={() => navegar("empleado-home")}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img src={flecha_izq} alt="Flecha_izq" style={{ width: 15, height: 15 }} />
            VOLVER
          </div>
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 340 }}>

          <div className="panel-pedido" style={{ marginBottom: 18, padding: 16 }}>
            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 14, color: "#555" }}>
              Información del Cliente
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input className="campo-texto" style={{ flex: 1, minWidth: 140, padding: "12px", fontSize: "1rem" }} placeholder="Nombre*" value={nombre} onChange={(e) => setNombre(e.target.value)} />

              <input className="campo-texto" style={{ flex: 1, minWidth: 140, padding: "12px", fontSize: "1rem" }} placeholder="DNI o Teléfono*" value={dniTelefono} onChange={(e) => setDniTelefono(e.target.value)} />

              <select className="campo-texto" style={{ flex: 1, minWidth: 140, padding: "12px", fontSize: "1rem" }} value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <option>Efectivo</option>
                <option>Yape</option>
                <option>Tarjeta</option>
              </select>
            </div>
          </div>

          <div className="panel-pedido" style={{ padding: 16 }}>

            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, color: "#555" }}>
              Productos
            </div>

            <div className="buscador" style={{ marginBottom: 12, padding: "10px" }}>
              <span style={{ fontSize: "1.1rem" }}><img src={lupa} alt="Lupa" style={{ width: '25px', height: '25px' }} /></span>
              <input style={{ fontSize: "1rem" }} placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {categorias.map((cat) => (
                <button key={cat} className={`tab-categoria ${categoriaActiva === cat ? "activo" : ""}`} style={{ padding: "8px 12px", fontSize: "0.95rem" }} onClick={() => setCategoriaActiva(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {productosFiltrados.map((prod) => (
              <div key={prod.id} className="producto-item" style={{ padding: "10px 12px" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{prod.nombre}</div>
                  <div style={{ color: "#888", fontSize: "0.9rem" }}>S/ {prod.precio.toFixed(2)}</div>
                </div>

                <button className="btn-primario" style={{ padding: "8px 14px", fontSize: "0.95rem" }} onClick={() => agregarProducto(prod)}>
                  + AGREGAR
                </button>
              </div>
            ))}

            {productosFiltrados.length === 0 && (
              <div style={{ color: "#aaa", fontSize: "0.95rem", padding: "14px 0" }}>
                Sin productos en esta categoría
              </div>
            )}

          </div>
        </div>

        <div className="contenedor-panel-pedido">
          <div className="panel-pedido" style={{ padding: 16 }}>

            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 14, color: "#555" }}>
              Resumen del Pedido
            </div>

            <table className="tabla-datos" style={{ marginBottom: 10, fontSize: "0.95rem" }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {itemsPedido.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontSize: "0.95rem" }}>{item.nombre}</td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button className="btn-accion" onClick={() => cambiarCantidad(item.id, -1)} style={{ fontSize: "0.95rem", padding: "2px 6px" }}>
                          −
                        </button>

                        <span style={{ fontSize: "0.95rem" }}>{item.cantidad}</span>

                        <button className="btn-accion" onClick={() => cambiarCantidad(item.id, 1)} style={{ fontSize: "0.95rem", padding: "2px 6px" }}>
                          +
                        </button>
                      </div>
                    </td>

                    <td style={{ fontSize: "0.95rem" }}>S/ {item.precio.toFixed(2)}</td>
                    <td style={{ fontSize: "0.95rem" }}>S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {itemsPedido.length === 0 && (
              <div style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: 10 }}>
                Sin productos agregados
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid #eee", paddingTop: 10, marginBottom: 16, fontSize: "1rem" }}>
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secundario" style={{ padding: "10px 12px", fontSize: "0.95rem" }} onClick={() => navegar("empleado-home")}>
                CANCELAR
              </button>

              <button className="btn-verde" style={{ padding: "10px 12px", fontSize: "0.95rem" }} onClick={registrarPedido} disabled={!nombre || itemsPedido.length === 0}>
                🖨 REGISTRAR
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}