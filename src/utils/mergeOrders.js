export function combinarPedidos(pedidosServidor, pedidosActuales) {
  const pedidosPorId = new Map(
    pedidosServidor.map((pedido) => [String(pedido.id), pedido]),
  );

  pedidosActuales.forEach((pedido) => {
    const id = String(pedido.id);
    if (!pedidosPorId.has(id)) pedidosPorId.set(id, pedido);
  });

  return Array.from(pedidosPorId.values());
}

