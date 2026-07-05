export const API = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export function handleResponse(res) {
  if (res.status === 204) return null;
  return res.text().then((text) => {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) return Promise.reject(data?.error || data?.message || "Error de conexión");
    return data;
  });
}

export function apiRequest(path, options = {}) {
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(),
      ...options.headers,
    },
  }).then(handleResponse);
}

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
