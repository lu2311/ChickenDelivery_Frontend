import { useState, useEffect } from "react";
import { productoService } from "../../../services/productoService";
import { categoriaService } from "../../../services/categoriaService";
import lapiz from '../icons/lapiz.png';
import basura from '../icons/basura.png';

export default function GestionProductos({ productos, setProductos, mostrarNotificacion }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEdicion, setProductoEdicion] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    idCategoria: "",
    descripcion: "",
    estado: true,
  });

  useEffect(() => {
    productoService.listar().then(setProductos);
    categoriaService.listar().then(setCategorias);
  }, []);

  const abrirNuevo = () => {
    setProductoEdicion(null);
    setForm({ nombre: "", precio: "", idCategoria: "", descripcion: "", estado: true });
    setModalAbierto(true);
  };

  const abrirEdicion = (producto) => {
    setProductoEdicion(producto);
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      idCategoria: producto.idCategoria,
      descripcion: producto.descripcion || "",
      estado: producto.estado,
    });
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.nombre || !form.precio || !form.idCategoria) return;
    const payload = { nombre: form.nombre, precio: parseFloat(form.precio), idCategoria: parseInt(form.idCategoria), descripcion: form.descripcion };
    try {
      if (productoEdicion) {
        await productoService.actualizar(productoEdicion.id, { ...payload, estado: form.estado });
      } else {
        await productoService.crear(payload);
      }
      const data = await productoService.listar();
      setProductos(data);
      mostrarNotificacion(productoEdicion ? "Producto actualizado" : "Producto creado");
      setModalAbierto(false);
    } catch (e) {
      mostrarNotificacion("Error al guardar");
    }
  };

  const toggleEstado = async (id) => {
    const producto = productos.find(p => p.id === id);
    await productoService.actualizar(id, { ...producto, estado: !producto.estado });
    const data = await productoService.listar();
    setProductos(data);
  };

  const eliminar = async (id) => {
    await productoService.eliminar(id);
    const data = await productoService.listar();
    setProductos(data);
    mostrarNotificacion("Producto eliminado");
  };

  const productosFiltrados = productos.filter(p => {
    const coincideTexto = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !filtroCategoria || p.idCategoria === parseInt(filtroCategoria);
    return coincideTexto && coincideCategoria;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Gestión de Productos</h5>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input style={{ flex: 1, minWidth: 200, padding: "10px", fontSize: "0.95rem" }}
            placeholder="Buscar producto..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />

          <select style={{ padding: "10px", fontSize: "0.95rem" }}
            value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

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
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td style={{ fontSize: "0.95rem" }}>{p.nombre}</td>
                <td style={{ fontSize: "0.95rem" }}>S/ {p.precio.toFixed(2)}</td>
                <td style={{ fontSize: "0.95rem" }}>{p.nombreCategoria}</td>

                <td>
                  <span className={p.estado ? "badge-activo" : "badge-factura"} style={{ fontSize: "0.9rem", padding: "4px 8px" }}>
                    {p.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>
                  <button className={`toggle-switch ${p.estado ? "toggle-on" : "toggle-off"}`} onClick={() => toggleEstado(p.id)} style={{ marginRight: 8, transform: "scale(1.1)" }} />
                  <button className="btn-accion editar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => abrirEdicion(p)}><img src={lapiz} alt="Editar" style={{ width: '25px', height: '25px' }} /></button>
                  <button className="btn-accion eliminar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => eliminar(p.id)}><img src={basura} alt="Basura" style={{ width: '25px', height: '25px' }} /></button>
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

              <select className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} value={form.idCategoria} onChange={(e) => setForm(f => ({ ...f, idCategoria: e.target.value }))}>
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              <textarea
                className="campo-texto"
                placeholder="Descripción (opcional)"
                value={form.descripcion}
                onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))}
                style={{ padding: "12px", fontSize: "1rem", width: "100%", minHeight: "60px", resize: "vertical" }}
              />
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