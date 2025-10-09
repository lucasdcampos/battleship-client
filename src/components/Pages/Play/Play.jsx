import { useRef, useState } from "react";
import styles from "./Play.module.css";
import Board from "../../Board/Board";
import Ships from "../../Ships/Ships";
import EmojiBox from "../../EmojiBox/EmojiBox";
import EmojiAnimation from "../../EmojiBox/EmojiAnimation";

function Play() {
  const boardRef = useRef(null);
  const shipsRef = useRef(null);
  const [shots, setShots] = useState([]); // Estado para armazenar os tiros
  const [activeEmoji, setActiveEmoji] = useState(null);
  const [isPlacementConfirmed, setIsPlacementConfirmed] = useState(false);

  const handleRandomizeClick = () => {
    if (shipsRef.current) {
      shipsRef.current.randomize();
    }
  };

  const handleCellClick = (x, y) => {
    // Define as colunas para a conversão de coordenadas
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const coordinate = `${cols[x]}${y + 1}`;

    // Verifica se a célula já foi atingida
    if (shots.some(shot => shot.x === x && shot.y === y)) {
      return;
    }

    const shipPositions = shipsRef.current.getShipPositions();
    const isHit = shipPositions.some(pos => pos.x === x && pos.y === y);

    if (isHit) {
      alert(`Acertou em ${coordinate}!`);
    } else {
      alert(`Errou em ${coordinate}!`);
    }

    // Adiciona o novo tiro ao estado
    setShots([...shots, { x, y, isHit }]);
  };

  const handleConfirmClick = () => {
    // TODO: Adicionar lógica para travar os navios e iniciar o jogo.
    console.log("Posicionamento confirmado!");
    setIsPlacementConfirmed(true);
  };

  const handleEmojiSelect = (emoji) => {
    // Define o emoji ativo para acionar a animação
    setActiveEmoji(emoji);
    console.log(`Emoji selecionado: ${emoji.id}. Animação: ${emoji.animated}`);
  };

  const handleAnimationEnd = () => {
    // Limpa o emoji ativo quando a animação termina
    setActiveEmoji(null);
  };

  return (
    <div className={styles.playContainer}>
      <div className={styles.boardsContainer}>
        {/* Tabuleiro do Jogador */}
        <div className={styles.boardWrapper}>
          <Board ref={boardRef}><Ships ref={shipsRef} boardRef={boardRef} isLocked={isPlacementConfirmed} /></Board>
          {!isPlacementConfirmed && (
            <div className={styles.buttonContainer}>
              <button className={styles.randomizeButton} onClick={handleRandomizeClick}>
                Reposicionar Navios
              </button>
              <button className={styles.confirmButton} onClick={handleConfirmClick}>
                Confirmar Posicionamento
              </button>
            </div>
          )}
        </div>
        {/* Tabuleiro Inimigo (Réplica) */}
        <div className={styles.boardWrapper}>
          <Board onCellClick={handleCellClick} shots={shots} />
        </div>
      </div>
      {isPlacementConfirmed && (
        <><EmojiAnimation emoji={activeEmoji} onAnimationEnd={handleAnimationEnd} /><EmojiBox onEmojiSelect={handleEmojiSelect} /></>
      )}
    </div>
  );
}

export default Play;
