import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

// Hook para obter as configurações de usuário (cores e enabled_*).
// Ele tenta usar o `me` do hook useMe e, se disponível, busca
// `/users/{id}/config`; caso contrário, tenta `/users/config` (rota "me").
export function useUserConfig() {
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalize = (raw) => {
    if (!raw) return null;
    // Se o backend já retornou em snake_case, convertemos para camelCase
    return {
      userConfigId: raw.user_config_id ?? raw.userConfigId,
      enabledBackground: raw.enabled_background ?? raw.enabledBackground,
      enabledSkin: raw.enabled_skin ?? raw.enabledSkin,
      enabledEffect: raw.enabled_effect ?? raw.enabledEffect,
      enabledIcon: raw.enabled_icon ?? raw.enabledIcon,
      primary_color: raw.primary_color ?? raw.primaryColor ?? null,
      secondary_color: raw.secondary_color ?? raw.secondaryColor ?? null,
      tertiary_color: raw.tertiary_color ?? raw.tertiaryColor ?? null,
      font_color: raw.font_color ?? raw.fontColor ?? null,
    };
  };

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      // Suporta user = { basicData }, { data: { basicData } }, { id }
      const id = user?.data?.basicData?.id || user?.basicData?.id || user?.id;
      const base = import.meta.env.VITE_API_URL;
      const url = id ? `${base}/users/${id}/config/` : `${base}/users/config/`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) throw new Error('Failed to fetch user config');
      const json = await res.json();
      setConfig(normalize(json));
    } catch (err) {
      setError(err);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refresh: fetchConfig };
}
