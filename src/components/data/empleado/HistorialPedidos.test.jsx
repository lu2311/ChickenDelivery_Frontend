import { render, screen, within } from "@testing-library/react";
import HistorialPedidos from "./HistorialPedidos";

const pedido = (id, fechaVenta) => ({
  id: String(id),
  fechaVenta,
  fecha: fechaVenta,
  cliente: "Cliente",
  total: 10,
  comprobante: "Pendiente",
});

test("muestra primero las ventas más recientes", () => {
  render(
    <HistorialPedidos
      navegar={jest.fn()}
      pedidos={[
        pedido(4, "2026-07-04T16:54:12"),
        pedido(13, "2026-07-04T18:59:41"),
        pedido(12, "2026-07-04T18:58:44"),
      ]}
    />,
  );

  const filas = screen.getAllByRole("row").slice(1);
  expect(within(filas[0]).getByText("13")).toBeTruthy();
  expect(within(filas[1]).getByText("12")).toBeTruthy();
  expect(within(filas[2]).getByText("4")).toBeTruthy();
});
