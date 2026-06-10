import BarraSuperior from "../common/BarraSuperior";
import AdminPanel from "./AdminPanel";
import GestionProductos from "./GestionProductos";
import GestionPromociones from "./GestionPromociones";
import GestionUsuarios from "./GestionUsuarios";
import Reportes from "./Reportes";
import Prediccion from "./Prediccion";
import VoiceflowChat from "../common/VoiceflowChat";

import panelIcon from '../icons/panel.png';
import productosIcon from '../icons/productos.png';
import promocionesIcon from '../icons/promociones.png';
import reportesIcon from '../icons/reportes.png';
import añadiruIcon from '../icons/añadiru.png';
import prediccionIcon from '../icons/prediccion.png';

export default function LayoutAdmin({
  pantalla,
  navegar,
  onSalir,
  productos,
  setProductos,
  clientes,
  pedidos,
  usuarios,
  setUsuarios,
  promociones,
  setPromociones,
  mostrarNotificacion
}) {
  const menuItems = [
    {
      id: "admin-panel",
      icono: <img src={panelIcon} alt="" style={{ width: "35px", height: "35px" }} />,
      label: "Panel Principal",
    },
    {
      id: "admin-productos",
      icono: <img src={productosIcon} alt="" style={{ width: "35px", height: "35px" }} />,
      label: "Productos",
    },
    {
      id: "admin-promociones",
      icono: <img src={promocionesIcon} alt="" style={{ width: "35px", height: "35px" }} />,
      label: "Promociones",
    },
    {
      id: "admin-reportes",
      icono: <img src={reportesIcon} alt="" style={{ width: "35px", height: "35px" }} />,
      label: "Reportes",
    },
    {
      id: "admin-usuarios",
      icono: <img src={añadiruIcon} alt="" style={{ width: "35px", height: "35px" }} />,
      label: "Usuarios",
    },
    {
      id: "admin-prediccion",
      icono: <img src={prediccionIcon} alt="" style={{ width: "35px", height: "35px" }} />,
      label: "Predicción",
    },
  ];

  return (
    <>
      <VoiceflowChat />

      <BarraSuperior
        titulo="Ikigai Deli Express - Administración"
        usuario="Administración"
        onSalir={onSalir}
      />

      <div className="sidebar">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${
              pantalla === item.id ? "activo" : ""
            }`}
            onClick={() => navegar(item.id)}
          >
            <span style={{ fontSize: "1.1rem" }}>
              {item.icono}
            </span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="contenido-con-sidebar">
        {pantalla === "admin-panel" && (
          <AdminPanel pedidos={pedidos} productos={productos} />
        )}

        {pantalla === "admin-productos" && (
          <GestionProductos
            productos={productos}
            setProductos={setProductos}
            mostrarNotificacion={mostrarNotificacion}
          />
        )}

        {pantalla === "admin-promociones" && (
          <GestionPromociones
            promociones={promociones}
            setPromociones={setPromociones}
            mostrarNotificacion={mostrarNotificacion}
          />
        )}

        {pantalla === "admin-reportes" && (
          <Reportes
            pedidos={pedidos}
            productos={productos}
          />
        )}

        {pantalla === "admin-usuarios" && (
          <GestionUsuarios
            usuarios={usuarios}
            setUsuarios={setUsuarios}
            mostrarNotificacion={mostrarNotificacion}
          />
        )}

        {pantalla === "admin-prediccion" && (
          <Prediccion />
        )}
      </div>
    </>
  );
}