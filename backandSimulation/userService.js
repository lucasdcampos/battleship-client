const API_URL = "http://localhost:5000";

export async function getUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar usuário");
  return response.json();
}

export async function updateUser(id, data) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar usuário");
  return response.json();
}
