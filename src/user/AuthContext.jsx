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
        // vamos enviar este token para o backend
        // para validar e pegar os dados do usuário.

        // simulção temporaria
        const response = {
          status: 200,
          data: {
            basicData: {
              id: 1,
              email: "tioben@example.com",
              username: "tioben",
              fatecCoins: 9999,
            },
            currentCosmetic: {
              currentIcon: "E00002",
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
            },
            availableShipSkins: {
              destroyer: ["F00001", "F00002", "F00003"],
              battleship: ["G00001", "G00002", "G00003"],
              submarine: ["I00001", "I00002", "I00003"],
              aircraftCarrier: ["H00001", "H00002", "H00003"],
            },
            statistic: {
              gamesPlayed: 125,
              gamesWon: 75,
              lvl: 12,
              exp: 700,
            },
          },
        };
        setUser(response);
        setIsAuthenticated(true);
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
    // Lógica para chamar API de login
    // Se sucesso:
    //   setUser(userData);
    //   setIsAuthenticated(true);
    //   localStorage.setItem('authToken', token);
    // Se falha:
    //   setIsAuthenticated(false);
    //   setUser(null);
    //   throw new Error('Falha no login');

    // simulação temporaria
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "teste@email.com" && password === "teste") {
          const response = {
            status: 200,
            data: {
              basicData: {
                id: 1,
                email: "tioben@example.com",
                username: "tioben",
                fatecCoins: 9999,
              },
              currentCosmetic: {
                currentIcon: "E00002",
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
              },
              availableShipSkins: {
                destroyer: ["F00001", "F00002", "F00003"],
                battleship: ["G00001", "G00002", "G00003"],
                submarine: ["I00001", "I00002", "I00003"],
                aircraftCarrier: ["H00001", "H00002", "H00003"],
              },
              statistic: {
                gamesPlayed: 125,
                gamesWon: 75,
                lvl: 12,
                exp: 700,
              },
            },
          };
          setUser(response);
          setIsAuthenticated(true);
          localStorage.setItem("authToken", "simulated_token");
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
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
