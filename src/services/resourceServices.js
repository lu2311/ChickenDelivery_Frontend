import { apiRequest } from "./api";

const crud = (path) => ({
  listar: () => apiRequest(path),
  obtener: (id) => apiRequest(`${path}/${id}`),
  crear: (data) => apiRequest(path, { method: "POST", body: JSON.stringify(data) }),
  actualizar: (id, data) => apiRequest(`${path}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  eliminar: (id) => apiRequest(`${path}/${id}`, { method: "DELETE" }),
});

export const clienteService = crud("/clientes");
export const usuarioService = crud("/usuarios");
export const promocionService = crud("/promociones");
export const categoriaService = crud("/categorias");
export const ventaService = {
  ...crud("/ventas"),
  porRango: (start, end) => apiRequest(`/ventas/rango-fechas?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`),
};
export const detalleVentaService = crud("/detalles-venta");
export const detallePromocionService = crud("/detalles-promocion");
export const comprobanteService = {
  ...crud("/comprobantes"),
  porVenta: (idVenta) => apiRequest(`/comprobantes/venta/${idVenta}`),
};
export const deliveryService = crud("/deliveries");

export const prediccionService = {
  obtener: (data) => apiRequest("/prediccion", { method: "POST", body: JSON.stringify(data) }),
  estado: () => apiRequest("/prediccion/estado"),
  entrenar: () => apiRequest("/prediccion/entrenar", { method: "POST" }),
};
