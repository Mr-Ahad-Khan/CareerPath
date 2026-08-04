// In development Vite proxies /api to localhost. On Vercel, set VITE_API_URL
// to the Render service origin, for example https://careerpath-api.onrender.com.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const API_BASE = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/api$/, '')}/api`
  : '/api';

function getToken() {
  return localStorage.getItem('cp-token');
}

export function setToken(token) {
  if (token) localStorage.setItem('cp-token', token);
  else localStorage.removeItem('cp-token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (err) {
    throw new ApiError('Network error — could not reach the server.', 0);
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      body?.error || body?.message || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }
  return body;
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
