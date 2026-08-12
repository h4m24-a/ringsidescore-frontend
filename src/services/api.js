// Base API client. Points at your Express backend — set VITE_API_URL in a
// .env file (defaults to localhost:4000 for local dev alongside the API).
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// The access token lives in memory only — never localStorage. It's short-lived
// (15 min) and reissued from the httpOnly refresh cookie on page load and on
// 401s, so there's nothing useful to persist client-side.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

// Called by AuthContext when a background refresh fails (e.g. the refresh
// cookie itself expired) so the app can drop back to a signed-out state.
let onAuthExpired = () => {};
export function setOnAuthExpired(handler) {
  onAuthExpired = handler;
}

let refreshInFlight = null;

// Talks to /auth/refresh directly (not through authService) to avoid a
// circular import between api.js and authService.js.
function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Refresh failed");
        const data = await res.json();
        setAccessToken(data.accessToken);
        return data;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

async function doFetch(path, { method, body, auth }) {
  const headers = { "Content-Type": "application/json" };
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include", // required for the httpOnly refresh cookie to be sent/set
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204) — fine
  }

  return { res, data };
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  let { res, data } = await doFetch(path, { method, body, auth });

  // One silent retry on 401: try refreshing the access token first, since
  // it may have simply expired mid-session (15 min lifetime).
  const isAuthRoute = path.startsWith("/auth/");
  if (res.status === 401 && auth && !isAuthRoute) {
    try {
      await refreshAccessToken();
      ({ res, data } = await doFetch(path, { method, body, auth }));
    } catch {
      onAuthExpired();
    }
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.details = data?.errors; // express-validator style field errors
    throw error;
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
