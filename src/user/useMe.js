import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

// Hook reutilizável para obter e normalizar os dados do usuário retornados por /users/me
export function useMe() {
  const { user: authUser } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalize = (raw) => {
    if (!raw) return null;
    // Se o provedor já devolveu um objeto com `data` (ex.: { data: { basicData: ... } })
    let o = raw;
    if (raw.data) o = raw.data;

    // Se já possui basicData, assumimos formato esperado
    if (o.basicData) return o;

    // Caso o backend retorne diretamente o usuário (id, username, email...), empacotamos em basicData
    const basicData = {};
    if (o.id) basicData.id = o.id;
    if (o.username) basicData.username = o.username;
    if (o.email) basicData.email = o.email;

    return { ...o, basicData };
  };

  const fetchMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Preferir o `authUser` já carregado pelo AuthProvider
      if (authUser) {
        setMe(normalize(authUser));
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setMe(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Falha ao obter /users/me');
      }

      const json = await res.json();
      setMe(normalize(json));
    } catch (err) {
      setError(err);
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return { me, loading, error, refresh: fetchMe };
}
