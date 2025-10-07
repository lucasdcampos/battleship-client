import React, { createContext, useEffect, useState } from 'react';

const mockUser = {
  username: 'johndoe',
  avatarUrl: 'https://i.pravatar.cc/150?u=johndoe',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signIn = async () => {
    // Simula delay da API
    await new Promise((r) => setTimeout(r, 500));
    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    return mockUser;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };