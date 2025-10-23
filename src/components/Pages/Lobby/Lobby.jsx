import { useState } from "react";
import styles from "./Lobby.module.css"; // Corrigido para o caminho correto se necessário
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [lobbyState, setLobbyState] = useState("main"); // 'main', 'searchingRandom', 'invite', 'waitingForFriend'
  const [friendName, setFriendName] = useState("");
  const navigate = useNavigate();

  const handleRandomClick = () => {
    setLobbyState("searchingRandom");
    // Simula a busca por uma partida e depois navega para o jogo
    setTimeout(() => {
      navigate("/play");
    }, 3000); // Atraso de 3 segundos para simular o matchmaking
  };

  const handleInviteClick = () => {
    setLobbyState("invite");
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (friendName.trim()) {
      setLobbyState("waitingForFriend");
    }
  };

  const renderMain = () => (
    <div className={styles.cardContainer}>
      <div className={styles.gameCard} onClick={handleRandomClick}>
        <h3>Partida Aleatória</h3>
        <p>Encontre um oponente e jogue imediatamente.</p>
      </div>
      <div className={styles.gameCard} onClick={handleInviteClick}>
        <h3>Party</h3>
        <p>Jogue uma partida com um amigo.</p>
      </div>
    </div>
  );

  const renderLoading = (message) => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );

  const renderInvite = () => (
    <div className={styles.inviteContainer}>
      <h3>Convidar um Amigo</h3>
      <form onSubmit={handleSendInvite}>
        <input
          type="text"
          placeholder="Nome de usuário do amigo"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
          className={styles.inviteInput}
          required
        />
        <button type="submit" className={styles.inviteButton}>
          Enviar Convite
        </button>
      </form>
       <button onClick={() => setLobbyState('main')} className={styles.backButton}>
        Voltar
      </button>
    </div>
  );

  const renderContent = () => {
    switch (lobbyState) {
      case "searchingRandom":
        return renderLoading("Buscando uma nova partida...");
      case "invite":
        return renderInvite();
      case "waitingForFriend":
        return renderLoading(`Aguardando resposta de ${friendName}...`);
      case "main":
      default:
        return renderMain();
    }
  };

  return (
    <div className={styles.lobbyBackground}>
      <div className={styles.lobbyContainer}>
        <h1 className={styles.title}>Modo de Jogo</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default Lobby;