import { useState } from "react";
import basura from '../icons/basura.png';
import { promocionService } from "../../../services/resourceServices";

export default function GestionPromociones({
  promociones,
  setPromociones,
  mostrarNotificacion,
}) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    precioCombo: "",
    fechaInicio: "",
    fechaFin: "",
    estado: true,
  });

  const guardar = async () => {
    if (!form.nombre) return;

    try {
      const guardada = await promocionService.crear({ ...form, precioCombo: Number(form.precioCombo) });
      setPromociones((prev) => [...prev, { ...guardada, precioCombo: Number(guardada.precioCombo) }]);
      mostrarNotificacion("Promoción creada");
      setModalAbierto(false);

    setForm({
      nombre: "",
      codigo: "",
      descripcion: "",
      precioCombo: "",
      fechaInicio: "",
      fechaFin: "",
      estado: true,
    });
    } catch (error) { mostrarNotificacion(error); }
  };

  const toggleEstado = async (promocion) => {
    try {
      const actualizada = await promocionService.actualizar(promocion.id, { ...promocion, estado: !promocion.estado });
      setPromociones((prev) => prev.map((p) => p.id === promocion.id ? { ...actualizada, precioCombo: Number(actualizada.precioCombo) } : p));
    } catch (error) { mostrarNotificacion(error); }
  };

  const eliminar = async (id) => {
    await promocionService.eliminar(id);
    setPromociones((prev) =>
      prev.filter((p) => p.id !== id)
    );

    mostrarNotificacion("Promoción eliminada");
  };

  return (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
      <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Gestión de Promociones</h5>

      <button className="btn-primario" style={{ padding: "12px 14px", fontSize: "1rem" }} onClick={() => setModalAbierto(true)}>
        + NUEVA PROMOCIÓN
      </button>
    </div>

    <div className="panel-pedido" style={{ padding: 16 }}>
      <table className="tabla-datos" style={{ fontSize: "0.95rem" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio combo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {promociones.map((p) => (
            <tr key={p.id}>
              <td style={{ fontSize: "0.95rem" }}>{p.nombre}</td>
              <td style={{ fontSize: "0.95rem" }}>{p.codigo}</td>
              <td style={{ fontSize: "0.95rem" }}>S/ {p.precioCombo.toFixed(2)}</td>
              <td style={{ fontSize: "0.95rem" }}>{p.fechaInicio}</td>
              <td style={{ fontSize: "0.95rem" }}>{p.fechaFin}</td>

              <td>
                <button className={`toggle-switch ${p.estado ? "toggle-on" : "toggle-off"}`} style={{ transform: "scale(1.1)" }} onClick={() => toggleEstado(p)} />
              </td>

              <td>
                <button className="btn-accion eliminar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => eliminar(p.id)}>
                  <img src={basura} alt="Basura" style={{ width: '25px', height: '25px' }} />
                </button>
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
            Nueva Promoción
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Nombre*" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />

            <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Código*" value={form.codigo} onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))} />

            <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />

            <input className="campo-texto" type="number" step="0.01" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Precio combo*" value={form.precioCombo} onChange={(e) => setForm((f) => ({ ...f, precioCombo: e.target.value }))} />

            <input className="campo-texto" type="date" style={{ padding: "12px", fontSize: "1rem" }} value={form.fechaInicio} onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))} />

            <input className="campo-texto" type="date" style={{ padding: "12px", fontSize: "1rem" }} value={form.fechaFin} onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value }))} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
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
