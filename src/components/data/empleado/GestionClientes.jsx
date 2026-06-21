import { useState } from "react";
import lupa from '../icons/lupa.png';
import flecha_izq from '../icons/flecha-izquierda.png';
import lapiz from '../icons/lapiz.png';
import basura from '../icons/basura.png';

export default function GestionClientes({
  navegar,
  clientes,
  setClientes,
  mostrarNotificacion,
  esAdmin
}) {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEdicion, setClienteEdicion] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    direccion: ""
  });

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda) ||
      (c.dni && c.dni.includes(busqueda))
  );

  const abrirNuevo = () => {
    setClienteEdicion(null);

    setForm({
      nombre: "",
      dni: "",
      telefono: "",
      direccion: ""
    });

    setModalAbierto(true);
  };

  const abrirEdicion = (c) => {
    setClienteEdicion(c);

    setForm({
      nombre: c.nombre,
      dni: c.dni || "",
      telefono: c.telefono,
      direccion: c.direccion
    });

    setModalAbierto(true);
  };


const guardar = () => {
  if (!form.nombre) return;

  if (form.dni && !/^\d{8}$/.test(form.dni)) {
    mostrarNotificacion("El DNI debe tener 8 dígitos");
    return;
  }

  if (clienteEdicion) {
    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteEdicion.id
          ? { ...c, ...form }
          : c
      )
    );

    mostrarNotificacion("Cliente actualizado");
  } else {
    setClientes((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...form
      }
    ]);

    mostrarNotificacion("Cliente registrado");
  }

  setModalAbierto(false);
};

  const eliminar = (id) => {
    setClientes((prev) =>
      prev.filter((c) => c.id !== id)
    );

    mostrarNotificacion("Cliente eliminado");
  };

  return (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
      <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Clientes</h5>

      {navegar && (  
         <button className="btn-volver" style={{ padding: "10px 14px", fontSize: "1rem" }} onClick={() => navegar("empleado-home")}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img src={flecha_izq} alt="Flecha_izq" style={{ width: 15, height: 15 }} />
            VOLVER
          </div>
        </button>
      )}
    </div>

    <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
      <div className="buscador" style={{ flex: 1, padding: "10px" }}>
        <img src={lupa} alt="Lupa" style={{ width: '28px', height: '28px' }} />
        <input
          style={{ fontSize: "1rem" }}
          placeholder="Buscar por nombre, DNI o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <button className="btn-primario" style={{ padding: "12px 14px", fontSize: "1rem" }} onClick={abrirNuevo}>
        + NUEVO CLIENTE
      </button>
    </div>

    <div className="panel-pedido" style={{ padding: 16 }}>
      <table className="tabla-datos" style={{ fontSize: "0.95rem" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            {/*<th>Acciones</th>*/}
          </tr>
        </thead>

        <tbody>
          {clientesFiltrados.map((c) => (
            <tr key={c.id}>
              <td style={{ fontSize: "0.95rem" }}>{c.nombre}</td>
              <td style={{ fontSize: "0.95rem" }}>{c.dni}</td>
              <td style={{ fontSize: "0.95rem" }}>{c.telefono}</td>
              <td style={{ fontSize: "0.95rem" }}>{c.direccion}</td>

              {/*<td>
                <button className="btn-accion editar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => abrirEdicion(c)}>
                  <img src={lapiz} alt="Editar" style={{ width: '25px', height: '25px' }} />
                </button>

                <button className="btn-accion eliminar" style={{ fontSize: "0.95rem", padding: "4px 6px" }} onClick={() => eliminar(c.id)}>
                  <img src={basura} alt="Basura" style={{ width: '25px', height: '25px' }} />
                </button>
              </td>*/}
            </tr>
          ))}
        </tbody>
      </table>

      {clientesFiltrados.length === 0 && (
        <div style={{ color: "#aaa", fontSize: "0.95rem", padding: "16px" }}>
          No se encontraron clientes
        </div>
      )}
    </div>

    {modalAbierto && (
      <div className="overlay-modal">
        <div className="modal-contenido" style={{ padding: 20 }}>
          <div className="modal-titulo" style={{ fontSize: "1.2rem" }}>
            {clienteEdicion ? "Editar Cliente" : "Nuevo Cliente"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Nombre*" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />

            <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="DNI" value={form.dni} onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))} />

            <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} />

            <input className="campo-texto" style={{ padding: "12px", fontSize: "1rem" }} placeholder="Dirección" value={form.direccion} onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))} />
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