import { combinarPedidos } from "./mergeOrders";

test("una carga atrasada no elimina un pedido recién registrado", () => {
  const servidor = [{ id: "1", total: 20 }];
  const actuales = [{ id: "1", total: 20 }, { id: "2", total: 35 }];

  expect(combinarPedidos(servidor, actuales)).toEqual([
    { id: "1", total: 20 },
    { id: "2", total: 35 },
  ]);
});

