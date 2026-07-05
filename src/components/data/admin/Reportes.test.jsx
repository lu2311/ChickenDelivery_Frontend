import { fireEvent, render, screen } from "@testing-library/react";
import { jsPDF } from "jspdf";
import Reportes from "./Reportes";

jest.mock("jspdf", () => ({ jsPDF: jest.fn() }));

const mockSave = jest.fn();
Object.assign(jsPDF.prototype, {
  setFillColor: jest.fn(), rect: jest.fn(), setTextColor: jest.fn(),
  setFont: jest.fn(), setFontSize: jest.fn(), text: jest.fn(),
  roundedRect: jest.fn(), splitTextToSize: jest.fn((text) => [text]),
  addPage: jest.fn(), save: mockSave,
});

test("genera y descarga el reporte PDF", () => {
  const notify = jest.fn();
  jsPDF.prototype.splitTextToSize.mockImplementation((text) => [text]);
  render(<Reportes
    pedidos={[{ id: 1, fechaVenta: "2026-07-04T12:00:00", total: 74, detalles: [{ idProducto: 1, nombreProducto: "Pollo Familiar", cantidad: 1, subtotal: 74 }] }]}
    productos={[{ id: 1, nombre: "Pollo Familiar", estado: true }]}
    mostrarNotificacion={notify}
  />);

  fireEvent.click(screen.getByRole("button", { name: /EXPORTAR A PDF/i }));

  expect(jsPDF).toHaveBeenCalled();
  expect(notify).toHaveBeenCalledWith("Reporte PDF descargado correctamente");
});
