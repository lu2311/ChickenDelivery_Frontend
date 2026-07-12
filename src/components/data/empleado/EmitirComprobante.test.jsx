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

test("selecciona el último pedido y lo muestra primero", () => {
  render(<EmitirComprobante
    navegar={jest.fn()}
    setPedidos={jest.fn()}
    mostrarNotificacion={jest.fn()}
    pedidos={[
      { id: "4", cliente: "Leonardo", total: 20 },
      { id: "5", cliente: "María", total: 30 },
      { id: "6", cliente: "Carlos", total: 40 },
    ]}
  />);

  const selector = screen.getByRole("combobox");
  const opciones = screen.getAllByRole("option");

  expect(selector.value).toBe("6");
  expect(opciones.map((opcion) => opcion.value)).toEqual(["6", "5", "4"]);
  expect(screen.getByDisplayValue("Carlos")).toBeTruthy();
});
