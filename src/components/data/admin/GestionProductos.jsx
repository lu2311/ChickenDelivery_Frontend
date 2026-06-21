import { useState } from "react";
import lapiz from '../icons/lapiz.png';
import basura from '../icons/basura.png';

export default function GestionProductos({ productos, setProductos, mostrarNotificacion }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEdicion, setProductoEdicion] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria: "Pollo",
    estado: true,
  });

  const abrirNuevo = () => {
    setProductoEdicion(null);
    setForm({ nombre: "", precio: "", categoria: "Pollo", estado: true });
    setModalAbierto(true);
  };

  const abrirEdicion = (producto) => {
    setProductoEdicion(producto);
    setForm({ nombre: producto.nombre, precio: producto.precio, categoria: producto.categoria, estado: producto.estado });
    setModalAbierto(true);
  };

  const guardar = () => {
    if (!form.nombre || !form.precio) return;
    const precio = parseFloat(form.precio);

    if (productoEdicion) {
      setProductos((prev) => prev.map((p) => p.id === productoEdicion.id ? { ...p, ...form, precio } : p));
      mostrarNotificacion("Producto actualizado");
    } else {
      setProductos((prev) => [...prev, { id: Date.now(), ...form, precio }]);
      mostrarNotificacion("Producto creado");
    }

    setModalAbierto(false);
  };

  const toggleEstado = (id) => {
    setProductos((prev) => prev.map((p) => p.id === id ? { ...p, estado: !p.estado } : p));
  };

  const eliminar = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    mostrarNotificacion("Producto eliminado");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Gestión de Productos</h5>

        <button className="btn-primario" style={{ padding: "12px 14px", fontSize: "1rem" }} onClick={abrirNuevo}>
          + NUEVO PRODUCTO
        </button>
      </div>

      <div className="panel-pedido" style={{ padding: 16 }}>
        <table className="tabla-datos" style={{ fontSize: "0.95rem" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td style={{ fontSize: "0.95rem" }}>{p.nombre}</td>
                <td style={{ fontSize: "0.95rem" }}>S/ {p.precio.toFixed(2)}</td>
                <td style={{ fontSize: "0.95rem" }}>{p.categoria}</td>

                <td>
                  <span className={p.estado ? "badge-activo" : "badge-factura"} style={{ fontSize: "0.9rem", padding: "4px 8px" }}>
                    {p.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>
                  <button className={`toggle-switch ${p.estado ? "toggle-on" : "toggle-off"}`} onClick={() => toggleEstado(p.id)} style={{ marginRight: 8, transform: "scale(1.1)" }} />
                  <button className="btn-accion editar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => abrirEdicion(p)}><img src={lapiz} alt="Editar" style={{ width: '25px', height: '25px' }} /></button>
                  {/*<button className="btn-accion eliminar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => eliminar(p.id)}><img src={basura} alt="Basura" style={{ width: '25px', height: '25px' }} /></button>*/}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="overlay-modal">
          <div className="modal-contenido" style={{ padding: 20 }}>
            <div className="modal-titulo" style={{ fontSize: "1.2rem" }}>
              {productoEdicion ? "Editar Producto" : "Nuevo Producto"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Nombre del producto" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />

              <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} />

              <select className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}>
                <option>Pollo</option>
                <option>Bebidas</option>
                <option>Combos</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
              <button className="btn-secundario" style={{ padding: "10px 14px", fontSize: "1rem" }} onClick={() => setModalAbierto(false)}>
                Cancelar
              </button>

              <button className="btn-primario" style={{ padding: "10px 14px", fontSize: "1rem" }} onClick={guardar}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}