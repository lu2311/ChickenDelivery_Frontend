import { esVentaDeHoyEnLima, limaDateKey } from "./limaDate";

describe("fecha local de Lima", () => {
  test("convierte un instante UTC al día calendario de Lima", () => {
    expect(limaDateKey("2026-07-08T03:30:00Z")).toBe("2026-07-07");
  });

  test("interpreta las fechas sin zona del backend como hora local de Lima", () => {
    expect(esVentaDeHoyEnLima(
      { fechaVenta: "2026-07-07T23:45:00" },
      new Date("2026-07-08T03:00:00Z"),
    )).toBe(true);
  });

  test("excluye ventas de otro día en Lima", () => {
    expect(esVentaDeHoyEnLima(
      { fechaVenta: "2026-07-06T23:59:59-05:00" },
      new Date("2026-07-07T12:00:00Z"),
    )).toBe(false);
  });
});

