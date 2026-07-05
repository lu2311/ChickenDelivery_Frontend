import { render, screen } from "@testing-library/react";
import EmitirComprobante from "./EmitirComprobante";

jest.mock("jspdf", () => ({ jsPDF: jest.fn() }));

test("muestra productos y promociones dentro del comprobante", () => {
  render(<EmitirComprobante
    navegar={jest.fn()}
    setPedidos={jest.fn()}
    mostrarNotificacion={jest.fn()}
    pedidos={[{
      id: "18", cliente: "Cliente", total: 99,
      detalles: [{ cantidad: 1, nombreProducto: "Pollo Familiar", subtotal: 74 }],
      detallePromociones: [{ cantidad: 1, nombrePromocion: "Combo universitario", subtotal: 20 }],
    }]}
  />);

  expect(screen.getByText("1 x Pollo Familiar")).toBeTruthy();
  expect(screen.getByText("1 x Combo universitario")).toBeTruthy();
});
