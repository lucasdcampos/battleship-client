import Card from "./elements/Cards/Cards";
import styles from "./Store.module.css";
import fc from "../../../assets/development/fc.png";
import { getUser, updateUser } from "../../../services/userService";
import { useAuth } from "../../../user/useAuth";
import { useState, useEffect } from "react";

export default function Store() {
  const { user, loading, isAuthenticated, setUserAtt } = useAuth();
  const [actualTab, setActualTab] = useState("icons");
  const [tabs, setTabs] = useState(null);
  const [fatecCoins, setFatecCoins] = useState(0);
  const [inventory, setInventory] = useState(new Set());

  function setMarket(userID) {
    getUser(userID).then((data) => {
      setTabs({
        icons: data.market.sell_icons,
        effects: data.market.sell_effects,
        backgrounds: data.market.sell_backgrounds,
        cards: data.market.sell_cards,
        ships: data.market.sell_ships,
      });

      // Carrega o saldo e o inventário do usuário
      setFatecCoins(data.basicData.fatecCoins);

      const userInventory = new Set([
        ...(data.availableCosmetic?.availableIcons || []),
        ...(data.availableCosmetic?.availableEffects || []),
        ...(data.availableCosmetic?.availableBackgrounds || []),
        ...(data.availableCosmetic?.availableCards || []),
        ...(data.availableShipSkins?.destroyer || []),
        ...(data.availableShipSkins?.battleship || []),
        ...(data.availableShipSkins?.aircraftCarrier || []),
        ...(data.availableShipSkins?.submarine || []),
      ]);
      setInventory(userInventory);
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
    }
    // retorna a URL absoluta pra funcionar no Vite
    return new URL(
      `${basePath}${code}.${actualTab === "effects" ? "gif" : "png"}`,
      import.meta.url
    ).href;
  }

  const handleBuy = async (product) => {
    const userID = user?.data?.basicData?.id || "1";
    const productPrice = parseInt(product.preco, 10);

    // a) Validação de saldo
    if (fatecCoins < productPrice) {
      alert("Saldo insuficiente para realizar a compra.");
      return;
    }

    try {
      // d) Desconto do saldo
      const newCoinsValue = fatecCoins - productPrice;
      const coinsUpdate = { basicData: { fatecCoins: newCoinsValue } };
      await updateUser(userID, coinsUpdate);

      // b) Aquisição do item
      const userData = await getUser(userID); // Pega os dados mais recentes para evitar sobrescrever
      let updatePayload = {};

      if (actualTab === "ships") {
        let shipType;
        if (product.imagem[0] === "H") shipType = "aircraftCarrier";
        else if (product.imagem[0] === "G") shipType = "battleship";
        else if (product.imagem[0] === "F") shipType = "destroyer";
        else if (product.imagem[0] === "I") shipType = "submarine";

        const currentShipSkins = userData.availableShipSkins?.[shipType] || [];
        updatePayload.availableShipSkins = {
          ...userData.availableShipSkins,
          [shipType]: [...currentShipSkins, product.imagem],
        };
      } else {
        const cosmeticTypeKey = "available" + actualTab.charAt(0).toUpperCase() + actualTab.slice(1);
        const currentCosmetics =
          userData.availableCosmetic?.[cosmeticTypeKey] || [];
        updatePayload.availableCosmetic = {
          ...userData.availableCosmetic,
          [cosmeticTypeKey]: [...currentCosmetics, product.imagem],
        };
      }

      await updateUser(userID, updatePayload);

      // c) Desabilitação na Loja (atualizando o estado local)
      setFatecCoins(newCoinsValue);
      setInventory(prevInventory => new Set(prevInventory).add(product.imagem));

      // Atualiza o contexto de autenticação para refletir as mudanças em outros componentes
      setUserAtt(prev => !prev);

      alert(`Você comprou ${product.titulo} por ${productPrice} Fatec Coins!`);
    } catch (error) {
      alert("Ocorreu um erro durante a compra. Tente novamente.");
      console.error("Erro na compra:", error);
      // Se der erro, recarrega os dados para garantir consistência
      setMarket(userID);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      const userID = user?.data?.basicData?.id || "1";
      setMarket(userID);
    }
  }, [loading, user, setUserAtt]);

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
          <span style={{ color: "var(--tertiary-color)" }}>{fatecCoins}</span>
        </h1>
        <img src={fc} alt="FC" />
      </div>
      <div className={styles.Cards_Container}>
        {(() => {
          const availableItems =
            tabs &&
            tabs[actualTab]?.filter((card) => !inventory.has(card.imagem));

          if (availableItems && availableItems.length > 0) {
            return availableItems.map((card, index) => (
              <Card
                key={index}
                titulo={card.titulo}
                preco={card.preco}
                imagem={getImagePath(card.imagem)}
                onComprar={() => handleBuy(card)}
              />
            ));
          } else if (tabs) {
            return <p>Não há itens disponíveis nessa categoria</p>;
          }
        })()}
      </div>
    </div>
  );
}
