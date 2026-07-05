import { apiRequest } from "./api";

export const productoService = {
  listar() {
    return apiRequest("/productos");
  },
  crear(data) {
    return apiRequest("/productos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  actualizar(id, data) {
    return apiRequest(`/productos/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  eliminar(id) {
    return apiRequest(`/productos/${id}`, { method: "DELETE" });
  },
};
