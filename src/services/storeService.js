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

export async function purchaseCosmetic(cosmeticId) {
  const token = getToken();
  const res = await fetch(`${API_URL}/cosmetics/purchase/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ cosmetic_id: cosmeticId })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Erro ao comprar cosmético: ${res.status} ${text}`);
  }
  return res.json();
}

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