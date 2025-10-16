import React from "react";
import styles from "./Deck.module.css";
import Card from "../Cards/Card";
import AimShot from "../../assets/cards/aim-shot.png";
import HitKill from "../../assets/cards/hit-kill.png";
import Resurrect from "../../assets/cards/resurrect.png";
import GhostShip from "../../assets/cards/ghost-ship.png";
import Shield from "../../assets/cards/shield.png";

const Deck = ({ cards = [] }) => {
  // Dados de exemplo para visualização
  const exampleCards = [
    { id: "c1", image: AimShot, title: "Teleguiado" },
    { id: "c2", image: HitKill, title: "Hit-Kill" },
    { id: "c3", image: Resurrect, title: "Ressureição" },
    { id: "c4", image: GhostShip, title: "Fanstama" },
    { id: "c5", image: Shield, title: "Escudo" },
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