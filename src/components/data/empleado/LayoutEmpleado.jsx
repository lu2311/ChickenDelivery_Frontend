import BarraSuperior from "../common/BarraSuperior";
import EmpleadoHome from "./EmpleadoHome";
import NuevoPedido from "./NuevoPedido";
import GestionClientes from "./GestionClientes";
import HistorialPedidos from "./HistorialPedidos";
import EmitirComprobante from "./EmitirComprobante";

export default function LayoutEmpleado({ pantalla, navegar, onSalir, clientes, setClientes, pedidos, setPedidos, productos, mostrarNotificacion, usuario }) {
  return (
    <>
      <BarraSuperior titulo="Ikigai Deli Express - Empleado" usuario="Juan Pérez" onSalir={onSalir} />
      <div className="contenido-centrado">
        {pantalla === "empleado-home" && <EmpleadoHome navegar={navegar} pedidos={pedidos}  usuario={usuario}/>}
        {pantalla === "nuevo-pedido" && <NuevoPedido navegar={navegar} clientes={clientes} productos={productos} pedidos={pedidos} setPedidos={setPedidos} mostrarNotificacion={mostrarNotificacion} />}
        {pantalla === "clientes" && <GestionClientes navegar={navegar} clientes={clientes} setClientes={setClientes} mostrarNotificacion={mostrarNotificacion} esAdmin={false} />}
        {pantalla === "historial" && <HistorialPedidos navegar={navegar} pedidos={pedidos} />}
        {pantalla === "emitir-comprobante" && <EmitirComprobante navegar={navegar} pedidos={pedidos} mostrarNotificacion={mostrarNotificacion} />}
      </div>
    </>
  );
}