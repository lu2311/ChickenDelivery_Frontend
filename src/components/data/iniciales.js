export const productosIniciales = [
  { id: 1, nombre: "Pollo a la Brasa 1/4", precio: 18.0, categoria: "Pollo", estado: true },
  { id: 2, nombre: "Combo Familiar", precio: 75.0, categoria: "Combos", estado: true },
  { id: 3, nombre: "Inca Kola 1.5L", precio: 5.5, categoria: "Bebidas", estado: true },
  { id: 4, nombre: "Coca Cola 1.5L", precio: 5.0, categoria: "Bebidas", estado: true },
];

export const clientesIniciales = [
  { id: 1, nombre: "María García", dni:"77424866" ,telefono: "987654321", direccion: "Av. Principal 123" },
  { id: 2, nombre: "Carlos López", dni:"77424848" ,telefono: "912345686", direccion: "Jr. Los Pinos 456" },
];

export const pedidosIniciales = [
  { id: "001", fecha: "13/05/2026 10:30", cliente: "María García", total: 41.50, comprobante: "Boleta" },
  { id: "002", fecha: "13/05/2026 11:45", cliente: "Carlos López", total: 75.00, comprobante: "Factura" },
];

export const usuariosIniciales = [
  { id: 1, nombre: "Administrador", usuario: "admin", rol: "Administrador" },
  { id: 2, nombre: "Juan Pérez", usuario: "empleado", rol: "Empleado" },
];

export const promocionesIniciales = [
  { id: 1, nombre: "Combo Familiar 2×1", descuento: "50%", fechaInicio: "30/4/2026", fechaFin: "30/5/2026", productos: "Combo Familiar", estado: true },
];