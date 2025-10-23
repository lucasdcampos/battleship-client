import React from "react";
import styles from "./Deck.module.css";
import Card from "../Cards/Card";
import C00001 from "../../assets/cosmetic/cards/C00001.png";
import C00002 from "../../assets/cosmetic/cards/C00002.png";
import C00003 from "../../assets/cosmetic/cards/C00003.png";
import C00004 from "../../assets/cosmetic/cards/C00004.png";
import C00005 from "../../assets/cosmetic/cards/C00005.png";

const Deck = ({ cards = [] }) => {
  // Dados de exemplo para visualização
  const exampleCards = [
    { id: "c1", image: C00001, title: "Teleguiado" },
    { id: "c2", image: C00002, title: "Hit-Kill" },
    { id: "c3", image: C00003, title: "Massivo" },
    { id: "c4", image: C00004, title: "Counter" },
    { id: "c5", image: C00005, title: "Fantasma" },
  ];

  const cardsToDisplay = cards.length > 0 ? cards : exampleCards;

  return (
    <div className={styles.deckContainer}>
      {Array.from({ length: 5 }).map((_, index) => {
        const card = cardsToDisplay[index];
        return (
          <div key={index} className={styles.cardSlot}>
            {card && <Card image={card.image} title={card.title} />}
          </div>
        );
      })}
    </div>
  );
};

export default Deck;