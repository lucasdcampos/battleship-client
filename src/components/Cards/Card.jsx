import React from "react";
import styles from "./Card.module.css";

const Card = ({ image, title }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
  );
};

export default Card;