import { mergeSaleItems, parseCatalogItems } from "./salesChatParser";

const products = [
  { id: 1, nombre: "Pollo Familiar", estado: true, precio: 74 },
  { id: 2, nombre: "1/2 Pollo", estado: true, precio: 42 },
  { id: 3, nombre: "1/4 Pollo", estado: true, precio: 25 },
  { id: 4, nombre: "Coca Cola 1.5L", estado: true, precio: 8 },
  { id: 5, nombre: "Papas Grandes", estado: true, precio: 12 },
];

test("interpreta cantidades y plurales usando el catálogo", () => {
  const result = parseCatalogItems("2 pollos con 3 coca colas", products);
  expect(result.unresolved).toHaveLength(0);
  expect(result.items.map(({ id, cantidad }) => ({ id, cantidad }))).toEqual([
    { id: 1, cantidad: 2 },
    { id: 4, cantidad: 3 },
  ]);
});

test("acepta cantidades escritas con palabras", () => {
  const result = parseCatalogItems("dos pollos y una coca cola", products);
  expect(result.items.map(({ id, cantidad }) => ({ id, cantidad }))).toEqual([
    { id: 1, cantidad: 2 },
    { id: 4, cantidad: 1 },
  ]);
});

test("entiende tamaños de pollo y texto adicional de la venta", () => {
  const result = parseCatalogItems("un medio pollo con 2 coca colas, delivery y efectivo", products);
  expect(result.unresolved).toHaveLength(0);
  expect(result.items.map(({ id, cantidad }) => ({ id, cantidad }))).toEqual([
    { id: 2, cantidad: 1 },
    { id: 4, cantidad: 2 },
  ]);
});

test("acumula productos repetidos sin perder el pedido actual", () => {
  const merged = mergeSaleItems(
    [{ ...products[0], cantidad: 1 }],
    [{ ...products[0], cantidad: 2 }, { ...products[3], cantidad: 3 }]
  );
  expect(merged.map(({ id, cantidad }) => ({ id, cantidad }))).toEqual([
    { id: 1, cantidad: 3 },
    { id: 4, cantidad: 3 },
  ]);
});
