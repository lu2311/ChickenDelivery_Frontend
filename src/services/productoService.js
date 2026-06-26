import { API, authHeaders, handleResponse } from "./api";

export const productoService = {
  obtener(id) {
    return fetch(`${API}/productos/${id}`, { headers: authHeaders() }).then(handleResponse);
  },
  actualizar(id, data) {
    return fetch(`${API}/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  listar() {
    return fetch(`${API}/productos`, { headers: authHeaders() }).then(handleResponse);
  },
  crear(data) {
    return fetch(`${API}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  eliminar(id) {
    return fetch(`${API}/productos/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleResponse);
  },
};