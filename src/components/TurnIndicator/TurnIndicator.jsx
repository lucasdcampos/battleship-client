import React from 'react';
import styles from './TurnIndicator.module.css';

const TurnIndicator = ({ currentPlayer }) => {
  const turnText = currentPlayer === 'player' ? 'Sua Vez' : 'Vez do Oponente';
  
  return (
    <div className={styles.turnIndicator}>
      <h2>{turnText}</h2>
    </div>
  );
};

export default TurnIndicator;