import { useState } from "react";
import lapiz from '../icons/lapiz.png';
import basura from '../icons/basura.png';
import { usuarioService } from "../../../services/resourceServices";

export default function GestionUsuarios({
  usuarios,
  setUsuarios,
  mostrarNotificacion,
}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEdicion, setUsuarioEdicion] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    contrasenia: "",
    rol: "Empleado",
  });

  const guardar = async () => {
    if (!form.nombre || !form.usuario) return;

    try {
      const payload = { ...form, estado: usuarioEdicion?.estado ?? true };
      const guardado = usuarioEdicion
        ? await usuarioService.actualizar(usuarioEdicion.id, payload)
        : await usuarioService.crear(payload);
      if (usuarioEdicion) {
        setUsuarios((prev) => prev.map((u) => u.id === usuarioEdicion.id ? guardado : u));
        mostrarNotificacion("Usuario actualizado");
      } else {
        setUsuarios((prev) => [...prev, guardado]);
        mostrarNotificacion("Usuario creado");
      }

    setModalAbierto(false);

    setUsuarioEdicion(null);

    setForm({
      nombre: "",
      usuario: "",
      contrasenia: "",
      rol: "Empleado",
    });
    } catch (error) { mostrarNotificacion(error); }
  };

  const abrirEdicion = (usuario) => {
    setUsuarioEdicion(usuario);

    setForm({
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      contrasenia: "",
      rol: usuario.rol,
    });

    setModalAbierto(true);
  };

  const eliminar = async (id) => {
    await usuarioService.eliminar(id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    mostrarNotificacion("Usuario eliminado");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Gestión de Usuarios</h5>

        <button className="btn-primario" style={{ padding: "12px 14px", fontSize: "1rem" }} onClick={() => setModalAbierto(true)}>
          + NUEVO USUARIO
        </button>
      </div>

      <div className="panel-pedido" style={{ padding: 16 }}>
        <table className="tabla-datos" style={{ fontSize: "0.95rem" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.usuario}</td>

                <td>
                  <span className={u.rol === "Administrador" ? "badge-admin" : "badge-empleado"} style={{ fontSize: "0.9rem", padding: "4px 8px" }}>
                    {u.rol}
                  </span>
                </td>

                <td>
                  <button className="btn-accion editar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => abrirEdicion(u)}>
                    <img src={lapiz} alt="Editar" style={{ width: '25px', height: '25px' }} />
                  </button>

                  <button className="btn-accion eliminar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => eliminar(u.id)}>
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
            <div className="modal-titulo">
              {usuarioEdicion ? "Editar Usuario" : "Nuevo Usuario"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Nombre completo*" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />

              <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Usuario*" value={form.usuario} onChange={(e) => setForm((f) => ({ ...f, usuario: e.target.value }))} />

              <input className="campo-texto" type="password" style={{ padding: "12px", fontSize: "1rem" }} placeholder={usuarioEdicion ? "Nueva contraseña (opcional)" : "Contraseña*"} value={form.contrasenia} onChange={(e) => setForm((f) => ({ ...f, contrasenia: e.target.value }))} />

              <select className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} value={form.rol} onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}>
                <option>Empleado</option>
                <option>Administrador</option>
              </select>
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
