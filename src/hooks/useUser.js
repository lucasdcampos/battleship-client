import { useEffect, useState } from "react";
import { getMe, getUserConfig, getUserCosmetics } from "../services/userService";

export function useUser() {
  const [me, setMe] = useState(null);
  const [config, setConfig] = useState(null);
  const [ownedCosmetics, setOwnedCosmetics] = useState([]); // ✅ array
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [meRes, configRes, cosmeticsRes] = await Promise.all([
        getMe(),
        getUserConfig(),
        getUserCosmetics()
      ]);

      setMe(meRes);
      setConfig(configRes);

      // ✅ A API retorna `{ user_id, cosmetics: [] }`
      setOwnedCosmetics(cosmeticsRes.cosmetics || []);

    } catch (err) {
      console.error("useUser error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    me,
    config,
    ownedCosmetics, // ✅ sempre array plano
    loading,
    refresh: load
  };
}
