import React from 'react';
import styles from './InfoCard.module.css';

const InfoCard = ({ name, level, status, avatar, altText = "Avatar" }) => {
  // Define a classe CSS com base no status para mudar a cor
  const statusClass = status === 'Pronto' ? styles.statusReady : styles.statusPositioning;

  return (
    <div className={styles.card}>
      {avatar && (
        <img src={avatar} alt={altText} className={styles.avatar} />
      )}
      <span className={styles.name}>{name}</span>
      <span className={styles.level}>Nível {level}</span>
      <div className={`${styles.status} ${statusClass}`}>
        {status}
      </div>
    </div>
  );
};

export default InfoCard;