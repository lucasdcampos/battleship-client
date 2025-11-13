import React from 'react';
import styles from './OpponentInfoCard.module.css';

const OpponentInfoCard = ({ name, level, status, avatar }) => {
  // Define a classe CSS com base no status para mudar a cor
  const statusClass = status === 'Pronto' ? styles.statusReady : styles.statusPositioning;

  return (
    <div className={styles.card}>
      {avatar && (
        <img src={avatar} alt="Avatar do Oponente" className={styles.avatar} />
      )}
      <span className={styles.name}>{name}</span>
      <span className={styles.level}>Nível {level}</span>
      <div className={`${styles.status} ${statusClass}`}>
        {status}
      </div>
    </div>
  );
};

export default OpponentInfoCard;