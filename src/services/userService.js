const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};

  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`API error ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }

  return res.json().catch(() => null);
}

/* ✅ sempre via token */
export async function getMe() {
  return apiFetch("/users/me/", { method: "GET" });
}

/* ✅ sempre via token */
export async function getUserConfig() {
  return apiFetch("/users/config/", { method: "GET" });
}

/* ✅ sempre via token */
export async function updateUserConfig(data) {
  return apiFetch("/users/config/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getUserCosmetics() {
  const token = getToken();
  const res = await fetch(`${API_URL}/users/cosmetics/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Erro ao buscar cosméticos do usuário: ${res.status} ${text}`);
  }
  return res.json();
}

export default {
  getMe,
  getUserConfig,
  updateUserConfig,
};
