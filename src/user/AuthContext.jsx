import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
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
        status: true,
        data: {
          basicData: {
            id: 1,
            email: "tioben@example.com",
            username: "tioben",
            fatecCoins: 9999,
          },
          currentCosmetic: {
            currentIcon: "E00001",
            currentBackground: "A00001",
            currentEffect: "D00001",
            currentPrimaryColor: "#242424",
            currentSecondaryColor: "gray",
            currentTertiaryColor: "orange",
            currentFontColor: "white",
            currentDestroyer: "F00001",
            currentBattleship: "G00001",
            currentAircraftCarrier: "H00001",
            currentSubmarine: "I00001",
            currentCards: ["C00001", "C00002", "C00003"],
          },
          availableCosmetic: {
            availableIcons: ["E00001", "E00002"],
            availableBackgrounds: ["A00001", "A00002"],
            availableEffects: ["D00001", "D00002"],
            availableCards: [
              "C00001",
              "C00002",
              "C00003",
              "C00004",
              "C00005",
              "C00006",
            ],
            availableShipSkins: {
              destroyer: ["F00001", "F00002", "F00003"],
              battleship: ["G00001", "G00002", "G00003"],
              submarine: ["I00001", "I00002", "I00003"],
              aircraftCarrier: ["H00001", "H00002", "H00003"],
            },
            statistic: {
              gamesPlayed: 120,
              gamesWon: 75,
              level: 12,
              exp: 700,
            },
          },
        },
      };
      if (response.status === 404) {
        throw new Error("Falha na requisição de dados");
      }

      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
