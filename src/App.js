import { useState, useEffect } from "react";
import "./App.css";

import { productosIniciales, clientesIniciales, pedidosIniciales, usuariosIniciales, promocionesIniciales } from "./components/data/iniciales";

import PantallaLogin from "./components/data/auth/PantallaLogin";
import LayoutEmpleado from "./components/data/empleado/LayoutEmpleado";
import LayoutAdmin from "./components/data/admin/LayoutAdmin";
import Notificacion from "./components/data/common/Notificacion";

export default function App() {
  const [sesionActiva, setSesionActiva] = useState(false);
  const [rolUsuario, setRolUsuario] = useState("empleado");
  const [pantallaActual, setPantallaActual] = useState("login");
  const [notificacion, setNotificacion] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [productos, setProductos] = useState(productosIniciales);
  const [clientes, setClientes] = useState(clientesIniciales);
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [promociones, setPromociones] = useState(promocionesIniciales);

  const mostrarNotificacion = (msg) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 2500);
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuarioActual(user);
      setRolUsuario(user.rol === "Administrador" ? "admin" : "empleado");
      setSesionActiva(true);
      setPantallaActual(user.rol === "Administrador" ? "admin-panel" : "empleado-home");
    }
  }, []);

  const manejarLogin = (usuario) => {
    setUsuarioActual(usuario);
    setRolUsuario(usuario.rol);

    setSesionActiva(true);

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
      {notificacion && <Notificacion mensaje={notificacion} />}

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
          setPromociones={setPromociones}
          mostrarNotificacion={mostrarNotificacion}
        />
      )}
    </>
  );
}