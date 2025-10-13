import React, { useState } from "react";
import Card from "./elements/Cards/Cards";
import styles from "./Store.module.css";
import navio from "../../../assets/development/loginShips/navio1.png";
import icone from "../../../assets/cosmetic/icons/E00001.png";
import background from "../../../assets/cosmetic/backgrounds/A00001.png";
import card from "../../../assets/cosmetic/cards/C00001.png";
import efeito from "../../../assets/cosmetic/effects/D00001.gif";
import fc from "../../../assets/development/fc.png";

export default function Store() {
  const sell_icons = [
    { titulo: "destroyer", preco: "2", imagem: icone },
    { titulo: "destroyer", preco: "2", imagem: icone },
    { titulo: "destroyer", preco: "2", imagem: icone },
    { titulo: "destroyer", preco: "2", imagem: icone },
    { titulo: "destroyer", preco: "2", imagem: icone },
    { titulo: "destroyer", preco: "2", imagem: icone },
  ];
  const sell_effects = [
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
    { titulo: "destroyer", preco: "2", imagem: efeito },
  ];
  const sell_backgrounds = [
    { titulo: "destroyer", preco: "2", imagem: background },
    { titulo: "destroyer", preco: "2", imagem: background },
    { titulo: "destroyer", preco: "2", imagem: background },
    { titulo: "destroyer", preco: "2", imagem: background },
  ];
  const sell_cards = [
    { titulo: "destroyer", preco: "2", imagem: card },
    { titulo: "destroyer", preco: "2", imagem: card },
    { titulo: "destroyer", preco: "2", imagem: card },
    { titulo: "destroyer", preco: "2", imagem: card },
    { titulo: "destroyer", preco: "2", imagem: card },
    { titulo: "destroyer", preco: "2", imagem: card },
    { titulo: "destroyer", preco: "2", imagem: card },
    { titulo: "destroyer", preco: "2", imagem: card },
  ];
  const sell_ships = [
    { titulo: "destroyer", preco: "2", imagem: navio },
    { titulo: "destroyer", preco: "2", imagem: navio },
    { titulo: "destroyer", preco: "2", imagem: navio },
  ];
  const [actualTab, setActualTab] = useState("icons");
  const tabs = {
    icons: sell_icons,
    effects: sell_effects,
    backgrounds: sell_backgrounds,
    cards: sell_cards,
    ships: sell_ships,
  };

  const Fatec_coins = 9999;

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
        {tabs[actualTab].map((card, index) => (
          <Card
            key={index}
            titulo={card.titulo}
            preco={card.preco}
            imagem={card.imagem}
            onComprar={() => alert("Você comprou um Submarino!")}
          />
        ))}
      </div>
    </div>
  );
}
