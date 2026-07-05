import { deliveryService, detalleVentaService, ventaService } from "./resourceServices";

export async function registrarVentaCompleta({
  usuario,
  cliente,
  items,
  tipoEntrega,
  metodoPago,
  canalVenta,
  direccionEntrega,
}) {
  const subtotal = items.reduce((total, item) => total + Number(item.precio) * item.cantidad, 0);
  const costoDelivery = tipoEntrega === "Delivery" ? 3 : 0;
  const total = subtotal + costoDelivery;

  const venta = await ventaService.crear({
    tipoEntrega,
    metodoPago,
    canalVenta,
    total,
    idUsuario: usuario.id,
    idCliente: cliente?.id || null,
  });

  await Promise.all(items.map((item) => detalleVentaService.crear({
    idVenta: venta.id,
    idProducto: item.id,
    cantidad: item.cantidad,
    precioUnitario: Number(item.precio),
    subtotal: Number(item.precio) * item.cantidad,
  })));

  const delivery = tipoEntrega === "Delivery"
    ? await deliveryService.crear({
        idVenta: venta.id,
        estadoDelivery: "Pendiente",
        costoDelivery,
        direccionEntrega: direccionEntrega.trim(),
      })
    : null;

  return {
    ...venta,
    id: String(venta.id),
    fecha: new Date(venta.fechaVenta).toLocaleString("es-PE"),
    cliente: cliente?.nombre || "Venta anónima",
    direccionCliente: cliente?.direccion || null,
    delivery,
    total: Number(venta.total),
    comprobante: "Pendiente",
  };
}
