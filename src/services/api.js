export const API = "http://localhost:8080/api";

export function handleResponse(res) {
  if (!res.ok) return res.json().then(e => Promise.reject(e.error));
  return res.json();
}

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}