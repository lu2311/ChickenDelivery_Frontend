import { API, authHeaders, handleResponse } from "./api";

export const clienteService = {
  listar() {
    return fetch(`${API}/clientes`, { headers: authHeaders() }).then(handleResponse);
  },
  crear(data) {
    return fetch(`${API}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  eliminar(id) {
    return fetch(`${API}/clientes/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleResponse);
  },
};