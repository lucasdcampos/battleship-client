// services/matchService.js
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

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`API error ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }

  return res.json().catch(() => null);
}

/* ✅ GET /match/ */
export function getMatches(usernameOrRoom) {
  const query = usernameOrRoom
    ? `?username_or_room_name=${encodeURIComponent(usernameOrRoom)}`
    : "";

  return apiFetch(`/match/${query}`, { method: "GET" });
}

/* ✅ POST /match/ */
export function createMatch({ room_name, password, is_private }) {
  return apiFetch("/match/", {
    method: "POST",
    body: JSON.stringify({
      room_name,
      password,
      is_private,
    }),
  });
}

/* ✅ GET /match/{id}/ */
export function getMatchById(id) {
  return apiFetch(`/match/${id}/`, { method: "GET" });
}

export default {
  getMatches,
  createMatch,
  getMatchById,
};