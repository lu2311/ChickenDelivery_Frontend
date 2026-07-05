import BarraSuperior from "../common/BarraSuperior";
import EmpleadoHome from "./EmpleadoHome";
import NuevoPedido from "./NuevoPedido";
import GestionClientes from "./GestionClientes";
import HistorialPedidos from "./HistorialPedidos";
import EmitirComprobante from "./EmitirComprobante";
import VoiceflowChat from "../common/VoiceflowChat";

export default function LayoutEmpleado({ pantalla, navegar, onSalir, clientes, setClientes, pedidos, setPedidos, productos, promociones, mostrarNotificacion, usuario }) {
  return (
    <>
      <VoiceflowChat />

      <BarraSuperior titulo="Ikigai Deli Express - Empleado" usuario="Juan Pérez" onSalir={onSalir} />

      <div className="contenido-centrado">
        {pantalla === "empleado-home" && <EmpleadoHome navegar={navegar} pedidos={pedidos} usuario={usuario} clientes={clientes} productos={productos} promociones={promociones} setPedidos={setPedidos} mostrarNotificacion={mostrarNotificacion} />}
        {pantalla === "nuevo-pedido" && <NuevoPedido navegar={navegar} clientes={clientes} productos={productos} promociones={promociones} pedidos={pedidos} setPedidos={setPedidos} mostrarNotificacion={mostrarNotificacion} usuario={usuario} />}
        {pantalla === "clientes" && <GestionClientes navegar={navegar} clientes={clientes} setClientes={setClientes} mostrarNotificacion={mostrarNotificacion} esAdmin={false} />}
        {pantalla === "historial" && <HistorialPedidos navegar={navegar} pedidos={pedidos} />}
        {pantalla === "emitir-comprobante" && <EmitirComprobante navegar={navegar} pedidos={pedidos} setPedidos={setPedidos} mostrarNotificacion={mostrarNotificacion} />}
      </div>
    </>
  );
}
