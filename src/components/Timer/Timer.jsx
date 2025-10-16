import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';

const Timer = ({ duration, onTimeEnd, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Reseta o tempo quando a duração ou a chave do componente mudam
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (timeLeft <= 0) {
      if (onTimeEnd) onTimeEnd();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeEnd, isRunning]);

  return (
    <div className={styles.timer}>
      <h2>Tempo: {timeLeft}s</h2>
    </div>
  );
};

export default Timer;