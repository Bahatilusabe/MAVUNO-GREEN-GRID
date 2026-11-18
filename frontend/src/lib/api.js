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

export function isSignedIn() {
  return Boolean(getToken());
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
    const error = new Error(
      body?.error || body?.message || `API request failed with HTTP ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  return body;
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options = {}) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: (path, body, options = {}) =>
    request(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

/**
 * A stable idempotency key for a write. The matches endpoint rejects a
 * reused key with different content, so the key must be derived from the
 * request itself rather than from the clock.
 */
export function idempotencyKey(parts) {
  const source = parts.filter(Boolean).join("|");
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `mgg-${(hash >>> 0).toString(16).padStart(8, "0")}-${source.length.toString(16)}`;
}
