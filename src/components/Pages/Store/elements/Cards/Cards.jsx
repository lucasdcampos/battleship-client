import React from "react";
import fc from "../../../../../assets/development/fc.png";

import styles from "./Cards.module.css";

export default function Card({ titulo, preco, imagem, onComprar }) {
  return (
    <div className={styles.card}>
      <img src={imagem} alt={titulo} className={styles.image} />

      <h3 className={styles.title}>{titulo}</h3>

      <p className={styles.price}>
        {preco} <img src={fc} alt="" style={{ width: "15px" }} />
      </p>

      <button className={styles.button} onClick={onComprar}>
        <span className={styles.icon}>🛒</span> Comprar
      </button>
    </div>
  );
}
