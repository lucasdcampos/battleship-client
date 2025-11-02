const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error('API error: ' + res.status + ' ' + res.statusText + (text ? ' - ' + text : ''));
    err.status = res.status;
    throw err;
  }
  return res.json().catch(() => null);
}

export async function getMe() {
  return apiFetch('/users/me/', { method: 'GET' });
}

export async function getUser(id) {
  return apiFetch(`/users/${id}/`, { method: 'GET' });
}

export async function updateUser(id, data) {
  return apiFetch(`/users/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function updateUserConfig(id, data) {
  const path = id ? `/users/${id}/config/` : '/users/config/';
  return apiFetch(path, { method: 'PUT', body: JSON.stringify(data) });
}

export default { getMe, getUser, updateUser, updateUserConfig };
