import Card from "./elements/Cards/Cards";
import styles from "./Store.module.css";
import fc from "../../../assets/development/fc.png";
import { getUser, updateUser } from "../../../../backandSimulation/userService";
import { useAuth } from "../../../user/useAuth";
import { useState, useEffect } from "react";

export default function Store() {
  const { user, loading, isAuthenticated } = useAuth();
  const [actualTab, setActualTab] = useState("icons");
  const [tabs, setTabs] = useState(null);
  const Fatec_coins = user?.basicData?.fatecCoins || 0;

  function setMarket(userID) {
    getUser(userID).then((data) => {
      setTabs({
        icons: data.market.sell_icons,
        effects: data.market.sell_effects,
        backgrounds: data.market.sell_backgrounds,
        cards: data.market.sell_cards,
        ships: data.market.sell_ships,
      });
    });
  }

  function getImagePath(code) {
    let basePath = "";

    switch (actualTab) {
      case "icons":
        basePath = "/src/assets/cosmetic/icons/";
        break;
      case "backgrounds":
        basePath = "/src/assets/cosmetic/backgrounds/";
        break;
      case "effects":
        basePath = "/src/assets/cosmetic/effects/";
        break;
      case "cards":
        basePath = "/src/assets/cosmetic/cards/";
        break;
      case "ships":
        if (code[0] === "H") {
          basePath = "/src/assets/cosmetic/ships/aircraftCarrier/";
          break;
        }
        if (code[0] === "G") {
          basePath = "/src/assets/cosmetic/ships/battleship/";
          break;
        }
        if (code[0] === "F") {
          basePath = "/src/assets/cosmetic/ships/destroyer/";
          break;
        }
        if (code[0] === "I") {
          basePath = "/src/assets/cosmetic/ships/submarine/";
          break;
        }
      default:
        return "";
    }
    // retorna a URL absoluta pra funcionar no Vite
    return new URL(
      `${basePath}${code}.${actualTab === "effects" ? "gif" : "png"}`,
      import.meta.url
    ).href;
  }

  const handleBuy = async (product) => {
    const userID = user?.id || 1;
    const currentFatecCoins = user?.basicData?.fatecCoins || 0;
    const productPrice = product.preco;

    if (currentFatecCoins < productPrice) {
      alert("sem saldo fi, ta duro dorme!");
      return;
    }

    try {
      // att muedas
      const newCoinsValue = currentFatecCoins - productPrice;
      const coinsUpdate = { basicData: { fatecCoins: newCoinsValue } };
      await updateUser(userID, coinsUpdate); // Await para garantir que a atualização termine

      // add item no inv do ujsuario
      let updatePayload = {};
      let cosmeticTypeKey =
        "available" + actualTab[0].toUpperCase() + actualTab.slice(1);

      if (actualTab === "ships") {
        let shipType;
        if (product.imagem[0] === "H") shipType = "aircraftCarrier";
        else if (product.imagem[0] === "G") shipType = "battleship";
        else if (product.imagem[0] === "F") shipType = "destroyer";
        else if (product.imagem[0] === "I") shipType = "submarine";

        // pega skins atual e ad novas
        const currentShipSkins = user?.availableShipSkins?.[shipType] || [];
        updatePayload.availableShipSkins = {
          ...user.availableShipSkins,
          [shipType]: [...currentShipSkins, product.imagem],
        };
      } else {
        // icons, effects, backgrounds, cards
        const currentCosmetics =
          user?.availableCosmetic?.[cosmeticTypeKey] || [];
        updatePayload.availableCosmetic = {
          ...user.availableCosmetic,
          [cosmeticTypeKey]: [...currentCosmetics, product.imagem],
        };
      }

      await updateUser(userID, updatePayload);

      alert(`Você comprou ${product.titulo} por ${productPrice} Fatec Coins!`);

      // Após a compra, recarregue os dados do usuário para refletir as mudanças
      // Isso deve ser feito através do seu AuthContext para atualizar o 'user' globalmente.
      // Assumindo que você tem uma função para recarregar o usuário no AuthContext
      if (user && user.refreshUser) {
        // Se você tem essa função no seu AuthContext
        user.refreshUser();
      } else {
        // Se não tiver refreshUser, você pode re-chamar setMarket e loadUserCoins
        // Mas o ideal é que o user no contexto seja atualizado
        setMarket(1);
        // loadUserCoins(); // Não é mais um estado local
      }
    } catch (error) {
      alert("Erro ao comprar!");
      console.error("Erro na compra:", error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      setMarket(1);
    }
  }, [loading, user]);

  if (loading) {
    return <div>Carregando Loja...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.Nav_Buttons_Container}>
        <ul type="none">
          <li
            style={{
              border:
                actualTab === "icons"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("icons")}
          >
            Ícones
          </li>
          <li
            style={{
              border:
                actualTab === "effects"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("effects")}
          >
            Efeitos
          </li>
          <li
            style={{
              border:
                actualTab === "backgrounds"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("backgrounds")}
          >
            Backgrounds
          </li>
          <li
            style={{
              border:
                actualTab === "cards"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("cards")}
          >
            Cards
          </li>
          <li
            style={{
              border:
                actualTab === "ships"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("ships")}
          >
            Navios
          </li>
        </ul>
      </div>
      <div className={styles.FC_Container}>
        <h1>
          Fatec Coins:{" "}
          <span style={{ color: "var(--tertiary-color)" }}>{Fatec_coins}</span>
        </h1>
        <img src={fc} alt="FC" />
      </div>
      <div className={styles.Cards_Container}>
        {tabs &&
          tabs[actualTab]?.map((card, index) => (
            <Card
              key={index}
              titulo={card.titulo}
              preco={card.preco}
              imagem={getImagePath(card.imagem)}
              onComprar={() => handleBuy(card)}
            />
          ))}
      </div>
    </div>
  );
}
