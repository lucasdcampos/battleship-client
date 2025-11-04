// src/pages/Store/elements/Cards/Cards.jsx

import fc from "../../../../../assets/development/fc.png";
import styles from "./Cards.module.css";

export default function Card({ titulo, preco, imagem, onComprar, onImgError }) {
  return (
    <div className={styles.card}>
      <img src={imagem} alt={titulo} className={styles.image} onError={onImgError} />

      <h3 className={styles.title}>{titulo}</h3>

      <p className={styles.price}>
        {preco} <img src={fc} alt="" style={{ width: "15px" }} />
      </p>

      <button
        className={styles.button}
        onClick={() => {
          onComprar();
        }}
      >
        <span className={styles.icon}>🛒</span> Comprar
      </button>
    </div>
  );
}
