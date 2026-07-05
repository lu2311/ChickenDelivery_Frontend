import { fireEvent, render, screen } from "@testing-library/react";
import NuevoPedido from "./NuevoPedido";

const baseProps = {
  navegar: jest.fn(), clientes: [], productos: [], pedidos: [],
  setPedidos: jest.fn(), mostrarNotificacion: jest.fn(), usuario: { id: 1 },
};

beforeEach(() => jest.clearAllMocks());

test("informa todos los campos obligatorios al intentar registrar vacío", () => {
  render(<NuevoPedido {...baseProps} />);
  fireEvent.click(screen.getByRole("button", { name: /REGISTRAR/i }));

  expect(baseProps.mostrarNotificacion).toHaveBeenCalledWith(
    "Complete los campos obligatorios: cliente o venta anónima, productos, tipo de entrega, método de pago, canal de venta",
    "error"
  );
});

test("avisa cuando se agrega y elimina un producto", () => {
  const product = { id: 7, nombre: "Papas Grandes", categoria: "COMBOS", precio: 12, estado: true };
  render(<NuevoPedido {...baseProps} productos={[product]} />);

  fireEvent.click(screen.getByRole("button", { name: "+ AGREGAR" }));
  expect(baseProps.mostrarNotificacion).toHaveBeenCalledWith("Producto agregado: Papas Grandes");

  fireEvent.click(screen.getByRole("button", { name: "−" }));
  expect(baseProps.mostrarNotificacion).toHaveBeenCalledWith("Producto eliminado: Papas Grandes");
});

test("muestra las categorías reales y las promociones activas", () => {
  const pollo = { id: 1, nombre: "Pollo Familiar", categoria: "Pollos", precio: 74, estado: true };
  const promo = { id: 4, nombre: "Combo universitario", precioCombo: 20, estado: true };
  render(<NuevoPedido {...baseProps} productos={[pollo]} promociones={[promo]} />);

  fireEvent.click(screen.getByRole("button", { name: "POLLOS" }));
  expect(screen.getByText("Pollo Familiar")).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "PROMOCIONES" }));
  expect(screen.getByText("Combo universitario")).toBeTruthy();
  expect(screen.getByText("S/ 20.00")).toBeTruthy();
});
