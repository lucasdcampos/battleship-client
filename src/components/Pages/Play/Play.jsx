import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import EndGameAnimation from "../../EndGameAnimation/EndGameAnimation";
import OpponentInfoCard from "../../OpponentInfoCard/OpponentInfoCard";
import { useAuth } from "../../../user/useAuth";
import explosionSound from '../../../sound/sfx/explosion.wav'; // Importa o som de explosão
import sunkSound from '../../../sound/sfx/sunk.wav'; // Importa o som de navio afundando
import waterSound from '../../../sound/sfx/water.wav'; // Importa o som de água
import opponentAvatar from '../../../assets/cosmetic/icons/E00001.png'; // Importa o avatar do oponente

function Play({ setIsGameEnding }) { // Recebe setIsGameEnding como prop
  const { user, setUserAtt } = useAuth();
  const navigate = useNavigate();
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
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' ou 'lose'
  const [showPostGamePopup, setShowPostGamePopup] = useState(false); // Estado para o popup pós-jogo
  const explosionAudioRef = useRef(null); // Ref para o áudio de explosão
  const sunkAudioRef = useRef(null); // Ref para o áudio de navio afundando
  const waterAudioRef = useRef(null); // Ref para o áudio de água

  const resetGameState = useCallback(() => {
    setShots([]);
    setIsPlacementConfirmed(false);
    setPlayerShipsState([]);
    setEnemyShipsState([]);
    setCurrentPlayer('player');
    setIsGameOver(false);
    setGameResult(null);
    setShowPostGamePopup(false);
    if (setIsGameEnding) setIsGameEnding(false);

    // Força a randomização dos navios para a nova partida
    setTimeout(() => {
      if (shipsRef.current) shipsRef.current.randomize();
    }, 0);
  }, [setIsGameEnding]);

  const handleRandomizeClick = () => {
    if (shipsRef.current) {
      shipsRef.current.randomize();
    }
  };

  const handleCellClick = (x, y) => {
    // Só permite clicar se for a vez do jogador, o jogo já começou e não terminou
    if (currentPlayer !== 'player' || !isPlacementConfirmed || isGameOver) return;

    // Define as colunas para a conversão de coordenadas
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const coordinate = `${cols[x]}${y + 1}`;

    // Verifica se a célula já foi atingida
    if (shots.some(shot => shot.x === x && shot.y === y)) {
      return;
    }

    // Registra o tiro no componente Ships e obtém o ID do navio atingido
    const hitShipId = enemyShipsRef.current.registerHit(x, y);

    if (!!hitShipId) {
      alert(`Acertou em ${coordinate}!`);
      if (explosionAudioRef.current) explosionAudioRef.current.play(); // Toca o som de explosão
    } else {
      alert(`Errou em ${coordinate}!`);
      if (waterAudioRef.current) waterAudioRef.current.play(); // Toca o som de água
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
    // Troca o turno quando o tempo acaba, se o jogo não terminou
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

  // Verifica se o jogo terminou
  useEffect(() => {
    if (!isPlacementConfirmed) return;

    // Checa vitória
    const allEnemyShipsSunk = enemyShipsState.length > 0 && enemyShipsState.every(ship => ship.isSunk);
    if (allEnemyShipsSunk) {
      setGameResult('win');
      setIsGameOver(true);
      if (setIsGameEnding) setIsGameEnding(true); // Notifica App.jsx que o jogo está terminando
    }

    // Checa derrota (a lógica de jogada do inimigo precisaria ser implementada para isso)
    // const allPlayerShipsSunk = playerShipsState.length > 0 && playerShipsState.every(ship => ship.isSunk);
    // if (allPlayerShipsSunk) {
    //   setGameResult('lose');
    //   setIsGameOver(true);
    //   if (setIsGameEnding) setIsGameEnding(true); // Notifica App.jsx que o jogo está terminando
    // }
  }, [enemyShipsState, playerShipsState, isPlacementConfirmed, setIsGameEnding]);

  // Expondo uma função no window para fins de depuração para chamar o EndGame
  useEffect(() => {
    window.triggerEndGame = (result) => {
      if (result === 'win' || result === 'lose') {
        setGameResult(result);
        setIsGameOver(true);
        if (setIsGameEnding) setIsGameEnding(true); // Notifica App.jsx que o jogo está terminando
        console.log(`Fim de jogo acionado via console com resultado: ${result}`);
      } else {
        console.error("Resultado inválido. Use 'win' ou 'lose'.");
      }
    };

    // Limpa a função quando o componente é desmontado
    return () => {
      delete window.triggerEndGame;
    };
  }, [setIsGameEnding]); // Adiciona setIsGameEnding como dependência

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

  const handleBackToLobby = () => {
    resetGameState();
    navigate('/lobby');
  };

  return (
    <div className={styles.playContainer}>
      <OpponentInfoCard
        name="Computador"
        level={5}
        status={isPlacementConfirmed ? "Pronto" : "Posicionando"}
        isGameStarted={isPlacementConfirmed}
        avatar={opponentAvatar} // Usa o avatar importado
      />
      <audio ref={explosionAudioRef} src={explosionSound} preload="auto" /> {/* Elemento de áudio para a explosão */}
      <audio ref={sunkAudioRef} src={sunkSound} preload="auto" /> {/* Elemento de áudio para o navio afundando */}
      <audio ref={waterAudioRef} src={waterSound} preload="auto" /> {/* Elemento de áudio para a água */} 
      {isGameOver && <EndGameAnimation result={gameResult} onEnd={() => {
        setIsGameOver(false); // Esconde a animação
        setShowPostGamePopup(true); // Mostra o popup de fim de jogo
      }} />}
      {showPostGamePopup && (
        <div className={styles.postGamePopupOverlay}>
          <div className={styles.postGamePopup}>
            <h3>Partida Finalizada</h3>
            <div className={styles.postGameButtons}>
              <button onClick={resetGameState} className={styles.confirmButton}>Jogar de Novo</button>
              <button onClick={handleBackToLobby} className={styles.randomizeButton}>Voltar ao Lobby</button>
            </div>
          </div>
        </div>
      )}
      {isPlacementConfirmed && <Placar titulo="Seu Placar" ships={playerShipsState} />}
      
      <div className={styles.mainGameArea}>
        {!isPlacementConfirmed && (
          <div className={styles.placementTimerContainer}>
            <span className={styles.placementTimerLabel}>Tempo para Posicionar</span>
            {/* O timer inicia e confirma a posição ao terminar */}
            <Timer duration={90} onTimeEnd={handleConfirmClick} isRunning={!isPlacementConfirmed} key="placement-timer" />
          </div>
        )}
        {isPlacementConfirmed && (
          <div className={styles.gameStatusContainer}>
            <TurnIndicator currentPlayer={currentPlayer} />
            <Timer duration={30} onTimeEnd={handleTimeEnd} isRunning={currentPlayer === 'player' && !isGameOver} key={currentPlayer} />
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
