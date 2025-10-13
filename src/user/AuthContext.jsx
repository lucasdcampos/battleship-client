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
            email: "email@example.com",
            username: "GustavoMartins",
            fatecCoins: 1500,
          },
          currentCosmetic: {
            currentIcon: "url_do_icone_selecionado",
            currentBackground: "url_do_background_selecionado",
            currentEffect: "url_do_efeito_selecionado",
            currentPrimaryColor: "#RRGGBB",
            currentSecondaryColor: "#RRGGBB",
            currentTertiaryColor: "#RRGGBB",
            currentFontColor: "#RRGGBB",
            currentShipSkin1: "url_da_skin_1",
            currentShipSkin2: "url_da_skin_2",
            currentShipSkin3: "url_da_skin_3",
            currentShipSkin4: "url_da_skin_4",
            currentShipSkin5: "url_da_skin_5",
          },
          availableCosmetic: {
            availableIcons: ["id_icone_1", "id_icone_2"],
            availableBackgrounds: ["id_bg_1", "id_bg_2"],
            availableEffects: ["id_effect_1", "id_effect_2"],
            availableCards: ["id_card_1", "id_card_2"],
            availableShipSkins: {
              ship1: ["skin_id_1_1", "skin_id_1_2"],
              ship2: ["skin_id_2_1"],
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
