import { useState } from "react";
import "./App.css";

import PantallaLogin from "./components/data/auth/PantallaLogin";
import LayoutEmpleado from "./components/data/empleado/LayoutEmpleado";
import LayoutAdmin from "./components/data/admin/LayoutAdmin";
import Notificacion from "./components/data/common/Notificacion";
import { productoService } from "./services/productoService";
import { categoriaService, clienteService, promocionService, usuarioService, ventaService } from "./services/resourceServices";
import { combinarPedidos } from "./utils/mergeOrders";

const CACHE_DURATION = 15 * 60 * 1000;

const claveCache = (usuario) => `chicken-data:${usuario.rol}:${usuario.id}`;

function leerCache(usuario) {
  try {
    const cache = JSON.parse(sessionStorage.getItem(claveCache(usuario)));
    return cache && Date.now() - cache.guardadoEn < CACHE_DURATION ? cache.datos : null;
  } catch {
    return null;
  }
}

function guardarCache(usuario, datos) {
  try {
    sessionStorage.setItem(claveCache(usuario), JSON.stringify({ guardadoEn: Date.now(), datos }));
  } catch {
    // La aplicación puede continuar normalmente si el navegador bloquea el almacenamiento.
  }
}

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
    setPantallaActual(usuario.rol === "admin" ? "admin-panel" : "empleado-home");

    const cache = leerCache(usuario) || {};
    const datosCargados = {
      productos: cache.productos || [],
      clientes: cache.clientes || [],
      pedidos: cache.pedidos || [],
      usuarios: cache.usuarios || [],
      promociones: cache.promociones || [],
      categorias: cache.categorias || [],
    };
    setProductos(datosCargados.productos);
    setClientes(datosCargados.clientes);
    setPedidos(datosCargados.pedidos);
    setUsuarios(datosCargados.usuarios);
    setPromociones(datosCargados.promociones);
    setCategorias(datosCargados.categorias);

    const cargar = (nombre, peticion, actualizar, transformar = (datos) => datos) => peticion
      .then((datos) => {
        const resultado = transformar(datos);
        if (nombre === "pedidos") {
          actualizar((pedidosActuales) => {
            const pedidosCombinados = combinarPedidos(resultado, pedidosActuales);
            datosCargados[nombre] = pedidosCombinados;
            guardarCache(usuario, datosCargados);
            return pedidosCombinados;
          });
          return;
        }
        datosCargados[nombre] = resultado;
        actualizar(resultado);
        guardarCache(usuario, datosCargados);
      });

    const transformarProductos = (datos) => datos.map((p) => ({
      ...p,
      precio: Number(p.precio),
      categoria: p.nombreCategoria || "Sin categoría",
    }));
    const transformarVentas = (datos) => datos.map((v) => ({
      ...v,
      id: String(v.id),
      fecha: v.fechaVenta ? new Date(v.fechaVenta).toLocaleString("es-PE") : "",
      cliente: v.nombreCliente || "Sin cliente",
      total: Number(v.total),
      comprobanteData: v.comprobante || null,
      comprobante: v.comprobante?.tipoComprobante || "Pendiente",
    }));
    const transformarPromociones = (datos) => datos.map((p) => ({
      ...p,
      precioCombo: Number(p.precioCombo),
    }));

    try {
      const cargasComunes = [
        cargar("productos", productoService.listar(), setProductos, transformarProductos),
        cargar("pedidos", ventaService.listar(), setPedidos, transformarVentas),
        cargar("promociones", promocionService.listar(), setPromociones, transformarPromociones),
      ];
      const cargasPorRol = usuario.rol === "admin"
        ? [
            cargar("usuarios", usuarioService.listar(), setUsuarios),
            cargar("categorias", categoriaService.listar(), setCategorias),
          ]
        : [cargar("clientes", clienteService.listar(), setClientes)];

      await Promise.all([...cargasComunes, ...cargasPorRol]);
    } catch (error) {
      mostrarNotificacion(error || "No se pudieron cargar los datos");
    }
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
          promociones={promociones}
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
