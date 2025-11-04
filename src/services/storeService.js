
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
}

export async function getCosmetics() {
  return fetch(`${API_URL}/cosmetics/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar cosméticos");
      return res.json();
    });
}

export default { getCosmetics };