const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const value = localStorage.getItem("user");
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || body?.message || `API request failed with HTTP ${response.status}`);
  }

  return body;
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options = {}) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: (path, body, options = {}) =>
    request(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
};
