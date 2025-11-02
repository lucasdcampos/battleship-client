import { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAtt, setUserAtt] = useState(false);

  const checkUserToken = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (token) {
        // tenta buscar os dados do usuário com o token salvo
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsAuthenticated(true);
        } else {
          // token inválido ou expirado
          localStorage.removeItem("authToken");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Erro ao verifica status de login:", error);
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserToken();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Alguns backends (por exemplo FastAPI OAuth2) esperam form-url-encoded
      // com o campo `username` em vez de `email`. Enviamos os dados nesse
      // formato para suportar esse caso.
      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setIsAuthenticated(false);
        setUser(null);
        // Se o backend devolver um array de validação em `detail`, formatamos
        // ele para uma string legível.
        if (Array.isArray(json.detail)) {
          const msgs = json.detail
            .map((d) => {
              const loc = Array.isArray(d.loc) ? d.loc.join(".") : d.loc;
              return `${loc}: ${d.msg}`;
            })
            .join("; ");
          return { ok: false, message: msgs };
        }
        return { ok: false, message: json.detail || json.message || "Falha no login" };
      }

      const token = json.access_token || json.token;
      if (!token) {
        return { ok: false, message: "Token não recebido do servidor" };
      }

      localStorage.setItem("authToken", token);

      // buscar dados do usuário
      const meRes = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!meRes.ok) {
        localStorage.removeItem("authToken");
        return { ok: false, message: "Falha ao obter dados do usuário" };
      }

      const meJson = await meRes.json();
      setUser(meJson);
      setIsAuthenticated(true);
      return { ok: true };
    } catch (error) {
      console.error("Erro no signIn:", error);
      return { ok: false, message: error.message || "Erro desconhecido" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated,
        setUserAtt,
        userAtt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
