import { API, authHeaders, handleResponse } from "./api";

export const categoriaService = {
  listar() {
    return fetch(`${API}/categorias`, { headers: authHeaders() }).then(handleResponse);
  },
};