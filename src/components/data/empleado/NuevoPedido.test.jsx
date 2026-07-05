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
