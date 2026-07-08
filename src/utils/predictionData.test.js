import { combinarSemanaConPedidosHoy, ventasPorHoraSemanaActual } from "./predictionData";

test("reemplaza la fila de hoy con los pedidos actuales", () => {
  const resultado = combinarSemanaConPedidosHoy(
    [{ fecha: "2026-07-06", delivery: 2, recojo: 1 }, { fecha: "2026-07-07", delivery: 1, recojo: 0 }],
    [
      { fechaVenta: "2026-07-07T10:00:00", tipoEntrega: "Delivery" },
      { fechaVenta: "2026-07-07T11:00:00", tipoEntrega: "Recojo" },
      { fechaVenta: "2026-07-07T12:00:00", tipoEntrega: "Delivery" },
    ],
    new Date("2026-07-07T17:00:00Z"),
  );

  expect(resultado).toEqual([
    { fecha: "2026-07-06", delivery: 2, recojo: 1 },
    { fecha: "2026-07-07", delivery: 2, recojo: 1 },
  ]);
});

test("agrupa dinámicamente las ventas de la semana por hora de Lima", () => {
  const resultado = ventasPorHoraSemanaActual([
    { fechaVenta: "2026-07-07T10:15:00" },
    { fechaVenta: "2026-07-07T10:45:00" },
    { fechaVenta: "2026-07-06T12:00:00" },
    { fechaVenta: "2026-06-30T10:00:00" },
  ], new Date("2026-07-07T17:00:00Z"));

  expect(resultado.find((item) => item.hora === 10).ventas).toBe(2);
  expect(resultado.find((item) => item.hora === 12).ventas).toBe(1);
});
