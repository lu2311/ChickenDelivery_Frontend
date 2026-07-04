import { useState } from "react";
import "./App.css";

import PantallaLogin from "./components/data/auth/PantallaLogin";
import LayoutEmpleado from "./components/data/empleado/LayoutEmpleado";
import LayoutAdmin from "./components/data/admin/LayoutAdmin";
import Notificacion from "./components/data/common/Notificacion";
import { productoService } from "./services/productoService";
import { categoriaService, clienteService, promocionService, usuarioService, ventaService } from "./services/resourceServices";

export default function App() {
  const [sesionActiva, setSesionActiva] = useState(false);
  const [rolUsuario, setRolUsuario] = useState("empleado");
  const [pantallaActual, setPantallaActual] = useState("login");
  const [notificacion, setNotificacion] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const mostrarNotificacion = (msg, tipo) => {
    const mensaje = String(msg || "Ocurrió un error");
    const esError = tipo === "error" || /error|no se|violación|obligatori|incorrect|existe|inválid/i.test(mensaje);
    setNotificacion({ mensaje, tipo: esError ? "error" : "exito" });
    setTimeout(() => setNotificacion(null), 2500);
  };

  const manejarLogin = async (usuario) => {
    setUsuarioActual(usuario);
    setRolUsuario(usuario.rol);

    setSesionActiva(true);

    try {
      const [productosApi, clientesApi, ventasApi, usuariosApi, promocionesApi, categoriasApi] = await Promise.all([
        productoService.listar(),
        clienteService.listar(),
        ventaService.listar(),
        usuarioService.listar(),
        promocionService.listar(),
        categoriaService.listar(),
      ]);
      setProductos(productosApi.map((p) => ({ ...p, precio: Number(p.precio), categoria: p.nombreCategoria || "Sin categoría" })));
      setClientes(clientesApi);
      setPedidos(ventasApi.map((v) => ({
        ...v,
        id: String(v.id),
        fecha: v.fechaVenta ? new Date(v.fechaVenta).toLocaleString("es-PE") : "",
        cliente: v.nombreCliente || "Sin cliente",
        total: Number(v.total),
        comprobante: v.comprobante?.tipoComprobante || "Pendiente",
      })));
      setUsuarios(usuariosApi);
      setPromociones(promocionesApi.map((p) => ({ ...p, precioCombo: Number(p.precioCombo) })));
      setCategorias(categoriasApi);
    } catch (error) {
      mostrarNotificacion(error || "No se pudieron cargar los datos");
    }

    setPantallaActual(
      usuario.rol === "admin"
        ? "admin-panel"
        : "empleado-home"
    );
  };

const manejarSalir = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  setSesionActiva(false);
  setUsuarioActual(null);
  setPantallaActual("login");
};

  const navegar = (pantalla) => setPantallaActual(pantalla);

  return (
    <>
      {notificacion && <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} />}

      {!sesionActiva && <PantallaLogin onLogin={manejarLogin} />}

      {sesionActiva && rolUsuario === "empleado" && (
        <LayoutEmpleado
          pantalla={pantallaActual}
          navegar={navegar}
          setPantalla={setPantallaActual}
          usuario={usuarioActual}
          onSalir={manejarSalir}
          clientes={clientes}
          setClientes={setClientes}
          pedidos={pedidos}
          setPedidos={setPedidos}
          productos={productos}
          mostrarNotificacion={mostrarNotificacion}
        />
      )}

      {sesionActiva && rolUsuario === "admin" && (
        <LayoutAdmin
          pantalla={pantallaActual}
          navegar={navegar}
          setPantalla={setPantallaActual}
          onSalir={manejarSalir}
          productos={productos}
          setProductos={setProductos}
          clientes={clientes}
          pedidos={pedidos}
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          promociones={promociones}
          categorias={categorias}
          setPromociones={setPromociones}
          mostrarNotificacion={mostrarNotificacion}
        />
      )}
    </>
  );
}
