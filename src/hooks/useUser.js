// src/hooks/useUser.js
import { useEffect, useState, useCallback } from "react";
import {
  getMe,
  getUserConfig,
  getUserCosmetics
} from "../services/userService";

export function useUser() {
  const [me, setMe] = useState(null);
  const [config, setConfig] = useState(null);
  const [ownedCosmetics, setOwnedCosmetics] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const meRes = await getMe();
      setMe(meRes);

      const cfg = await getUserConfig();
      setConfig(cfg);

      const userCos = await getUserCosmetics();
      setOwnedCosmetics(
        new Set((userCos.cosmetics || []).map((c) => c.cosmetic_id))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    me,
    config,
    ownedCosmetics,
    loading,
    error,
    refresh: load
  };
}
