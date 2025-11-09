import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./Play.module.css";
import Board from "../../Board/Board";
import Ships from "../../Ships/Ships";
import EmojiBox from "../../EmojiBox/EmojiBox";
import EmojiAnimation from "../../EmojiBox/EmojiAnimation";
import Placar from "../../Placar/Placar";
import Deck from "../../Deck/Deck";
import TurnIndicator from "../../TurnIndicator/TurnIndicator";
import Timer from "../../Timer/Timer";
import PopupComponent from "../Perfil/elements/PopupComponent";
import { useAuth } from "../../../hooks/useAuth";

function Play() {
  const { user, setUserAtt } = useAuth();
  const boardRef = useRef(null);
  const shipsRef = useRef(null);
  const enemyBoardRef = useRef(null);
  const enemyShipsRef = useRef(null);
  const [shots, setShots] = useState([]); // Estado para armazenar os tiros
  const [activeEmoji, setActiveEmoji] = useState(null);
  const [isPlacementConfirmed, setIsPlacementConfirmed] = useState(false);
  const [playerShipsState, setPlayerShipsState] = useState([]);
  const [enemyShipsState, setEnemyShipsState] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('player'); // 'player' ou 'enemy'
  const [isDeckPopupOpen, setIsDeckPopupOpen] = useState(false);

  const handleRandomizeClick = () => {
    if (shipsRef.current) {
      shipsRef.current.randomize();
    }
  };

  const handleCellClick = (x, y) => {
    // Só permite clicar se for a vez do jogador e o jogo já começou
    if (currentPlayer !== 'player' || !isPlacementConfirmed) return;

    // Define as colunas para a conversão de coordenadas
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const coordinate = `${cols[x]}${y + 1}`;

    // Verifica se a célula já foi atingida
    if (shots.some(shot => shot.x === x && shot.y === y)) {
      return;
    }

    // Registra o tiro no componente Ships e obtém o ID do navio atingido
    const hitShipId = enemyShipsRef.current.registerHit(x, y);

    if (hitShipId) {
      alert(`Acertou em ${coordinate}!`);
    } else {
      alert(`Errou em ${coordinate}!`);
    }

    // Adiciona o novo tiro ao estado
    setShots([...shots, { x, y, isHit: !!hitShipId }]);
    // Atualiza o estado dos navios inimigos para o placar
    setEnemyShipsState(enemyShipsRef.current.getShips());
    setCurrentPlayer('enemy'); // Passa a vez para o inimigo
  };

  const handleConfirmClick = () => {
    console.log("Posicionamento confirmado!");
    setIsPlacementConfirmed(true);
  };

  const handleTimeEnd = () => {
    console.log("O tempo acabou!");
    // Troca o turno quando o tempo acaba
    setCurrentPlayer(prevPlayer => prevPlayer === 'player' ? 'enemy' : 'player');
  };

  // Simula a jogada do inimigo e devolve o turno para o jogador
  useEffect(() => {
    if (currentPlayer === 'enemy' && isPlacementConfirmed) {
      const enemyTurnTimeout = setTimeout(() => {
        console.log("Inimigo jogou, sua vez!");
        // Aqui você adicionaria a lógica da jogada do inimigo
        setCurrentPlayer('player');
      }, 2000); // Simula um delay para a jogada do inimigo

      return () => clearTimeout(enemyTurnTimeout);
    }
  }, [currentPlayer, isPlacementConfirmed]);

  useEffect(() => {
    // Posiciona os navios inimigos aleatoriamente quando o jogador confirma sua posição
    if (isPlacementConfirmed && enemyShipsRef.current) {
      setTimeout(() => { // Pequeno delay para garantir que o estado de lock foi propagado
        enemyShipsRef.current.randomize();
        setPlayerShipsState(shipsRef.current.getShips());
        setEnemyShipsState(enemyShipsRef.current.getShips());
      }, 100);
    }
  }, [isPlacementConfirmed]);

  const handleEmojiSelect = (emoji) => {
    // Define o emoji ativo para acionar a animação
    setActiveEmoji(emoji);
    console.log(`Emoji selecionado: ${emoji.id}. Animação: ${emoji.animated}`);
  };

  const handleAnimationEnd = () => {
    // Limpa o emoji ativo quando a animação termina
    setActiveEmoji(null);
  };

  const handleDeckSave = useCallback(() => {
    // Atualiza o estado do usuário para refletir as mudanças de cartas
    if (typeof setUserAtt === 'function') setUserAtt((prev) => !prev);
  }, [setUserAtt]);

  return (
    <div className={styles.playContainer}>
      {isPlacementConfirmed && <Placar titulo="Seu Placar" ships={playerShipsState} />}
      
      <div className={styles.mainGameArea}>
        {isPlacementConfirmed && (
          <div className={styles.gameStatusContainer}>
            <TurnIndicator currentPlayer={currentPlayer} />
            <Timer duration={30} onTimeEnd={handleTimeEnd} isRunning={currentPlayer === 'player'} key={currentPlayer} />
          </div>
        )}
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
            {!isPlacementConfirmed && (
              <div className={styles.deckContainer} onClick={() => setIsDeckPopupOpen(true)}>
              <Deck />
              </div>
            )}
          </div>
          {/* Tabuleiro Inimigo (Réplica) */}
          {isPlacementConfirmed && (
            <div className={styles.boardWrapper}>
              <Board ref={enemyBoardRef} onCellClick={handleCellClick} shots={shots} >
                <Ships ref={enemyShipsRef} boardRef={enemyBoardRef} isLocked={true} areShipsHidden={true} />
              </Board>
            </div>
          )}
        </div>
        {isPlacementConfirmed && (
          <>
            <EmojiAnimation
              emoji={activeEmoji}
              onAnimationEnd={handleAnimationEnd}
            /><EmojiBox onEmojiSelect={handleEmojiSelect} /><Deck />
          </>
        )}
      </div>
      {isPlacementConfirmed && <Placar titulo="Placar Inimigo" ships={enemyShipsState} />}
      <PopupComponent
        isOpen={isDeckPopupOpen}
        onClose={() => setIsDeckPopupOpen(false)}
        type="cards"
        userData={user?.data || user}
        onSave={handleDeckSave}
      />
    </div>
  );
}

export default Play;
