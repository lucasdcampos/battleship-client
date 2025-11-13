import { useState, useCallback } from "react";
import { getMatches, createMatch } from "../services/matchService";

export function useMatch() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMatches = useCallback(async (query = "") => {
    try {
      setLoading(true);
      const res = await getMatches(query);

      // Garante que SEMPRE vira array
      const list =
        Array.isArray(res)
          ? res
          : Array.isArray(res?.matches)
          ? res.matches
          : Array.isArray(res?.results)
          ? res.results
          : [];

      setMatches(list);
    } finally {
      setLoading(false);
    }
  }, []);

  const newMatch = useCallback(async (body) => {
    try {
      setLoading(true);
      const res = await createMatch(body);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    matches,
    loading,
    searchMatches,
    newMatch,
  };
}
