import { API, handleResponse } from "./api";

export const authService = {
  login(usuario, contrasenia) {
    return fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasenia }),
    }).then(handleResponse);
  },
  register(usuario, contrasenia) {
    return fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasenia }),
    }).then(handleResponse);
  },
};