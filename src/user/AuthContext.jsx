import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signIn = async (credentials) => {
    setLoading(true);

    try {
    await new Promise((r) => setTimeout(r, 500));
    
    // TODO: Substituir pela chamada real ao backend
    const response = {
      ok: true,
      data: {
        id: 1,
        email: credentials.email,
        username: credentials.email.split('@')[0], // Exemplo de username
        avatarUrl: "https://i.pravatar.cc/150?img=3", // Avatar de exemplo
      }
    }

    if (!response.ok) {
      throw new Error('Falha no login');
    }

    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    return userData;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
