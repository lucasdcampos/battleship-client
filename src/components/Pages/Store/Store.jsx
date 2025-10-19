import React, { useEffect, useState } from "react";
import Card from "./elements/Cards/Cards";
import styles from "./Store.module.css";
import fc from "../../../assets/development/fc.png";
import { getUser, updateUser } from "../../../../backandSimulation/userService";

export default function Store() {
  const [actualTab, setActualTab] = useState("icons");
  const [tabs, setTabs] = useState(null);
  const [Fatec_coins, setFatecCoins] = useState(0);

  function setMarket() {
    getUser(1).then((data) => {
      setTabs({
        icons: data.market.sell_icons,
        effects: data.market.sell_effects,
        backgrounds: data.market.sell_backgrounds,
        cards: data.market.sell_cards,
        ships: data.market.sell_ships,
      });
    });
  }

  function loadUserCoins() {
    getUser(1).then((data) => {
      setFatecCoins(data.basicData.fatecCoins);
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

  function handleBuy(fatecCoins, productPrice, userID) {
    if (fatecCoins < productPrice) {
      alert("sem saldo fi, ta duro dorme!");
    } else {
      try {
        getUser(1).then((data) => {
          const newCoinsValue = fatecCoins - productPrice;
          const coinsUpdate = { basicData: { fatecCoins: newCoinsValue } };
          updateUser(userID, coinsUpdate);
          const complete =
            "available" + actualTab[0].toUpperCase() + actualTab.slice(1);
          const newProductsAvaible = data.availableCosmetic[complete];
          console.log(newProductsAvaible);
        });
      } catch {
        alert("erro ao comprar!");
      }
    }
  }

  useEffect(() => {
    setMarket();
    loadUserCoins();
  }, []);

  handleBuy();

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
              // onComprar={handleBuy(1, Fatec_coins, card.preco)}
            />
          ))}
      </div>
    </div>
  );
}
