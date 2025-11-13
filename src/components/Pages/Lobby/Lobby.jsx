import { useState, useMemo } from "react";
import styles from "./Lobby.module.css";
import { useNavigate } from "react-router-dom";

// Dados simulados de salas
const initialRooms = [
  { id: 1, name: "Batalha dos Mares", creator: "Capitão Jack", isPrivate: false, players: 1, maxPlayers: 2 },
  { id: 2, name: "Sala VIP", creator: "Almirante Nelson", isPrivate: true, players: 1, maxPlayers: 2 },
  { id: 3, name: "Destruição Total", creator: "Barba Negra", isPrivate: false, players: 1, maxPlayers: 2 },
  { id: 4, name: "Apenas Veteranos", creator: "Comandante Cobra", isPrivate: false, players: 1, maxPlayers: 2 },
  { id: 5, name: "Clube Secreto", creator: "Mestre das Águas", isPrivate: true, players: 1, maxPlayers: 2 },
  { id: 6, name: "Guerra Naval", creator: "Luffy", isPrivate: false, players: 1, maxPlayers: 2 },
];

function Lobby() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(initialRooms);
  const [filter, setFilter] = useState("all"); // 'all', 'public', 'private'
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState({ show: false, room: null });

  // State para o formulário de nova sala
  const [newRoomName, setNewRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [newRoomPassword, setNewRoomPassword] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const handleCreateRoom = (e) => {
    e.preventDefault();
    // Lógica para criar a sala (aqui apenas simulamos)
    console.log("Criando sala:", { name: newRoomName, isPrivate, password: newRoomPassword });
    // Após criar, redireciona para a tela de espera/jogo
    navigate("/play");
  };

  const handleJoinRoom = (room) => {
    if (room.isPrivate) {
      setShowPasswordModal({ show: true, room });
    } else {
      console.log(`Entrando na sala pública ${room.name}`);
      navigate("/play");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Lógica para verificar a senha (aqui apenas simulamos)
    console.log(`Tentando entrar na sala ${showPasswordModal.room.name} com a senha: ${enteredPassword}`);
    if (enteredPassword) {
      setShowPasswordModal({ show: false, room: null });
      setEnteredPassword("");
      navigate("/play");
    } else {
      alert("Senha incorreta!");
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        if (filter === "public") return !room.isPrivate;
        if (filter === "private") return room.isPrivate;
        return true;
      })
      .filter((room) => {
        const term = searchTerm.toLowerCase();
        return room.name.toLowerCase().includes(term) || room.creator.toLowerCase().includes(term);
      });
  }, [rooms, filter, searchTerm]);

  return (
    <div className={styles.lobbyBackground}>
      <div className={styles.lobbyContainer}>
        <div className={styles.header}>
          <div className={styles.filters}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={styles.filterSelect}>
              <option value="all">Todas as Salas</option>
              <option value="public">Públicas</option>
              <option value="private">Privadas</option>
            </select>
            <input
              type="text"
              placeholder="Buscar por nome da sala ou criador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button onClick={() => setShowNewGameModal(true)} className={styles.newGameButton}>
            Novo Jogo
          </button>
        </div>

        <div className={styles.roomList}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.roomInfo}>
                  <h3>{room.name}</h3>
                  <p>Criador: {room.creator}</p>
                </div>
                <div className={styles.roomStatus}>
                  <span className={room.isPrivate ? styles.privateTag : styles.publicTag}>
                    {room.isPrivate ? "Privada" : "Pública"}
                  </span>
                  <button onClick={() => handleJoinRoom(room)} className={styles.joinButton}>
                    Entrar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noRooms}>Nenhuma sala encontrada.</p>
          )}
        </div>
      </div>

      {/* Modal de Novo Jogo */}
      {showNewGameModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={() => setShowNewGameModal(false)} className={styles.closeButton}>X</button>
            <h2>Criar Nova Sala</h2>
            <form onSubmit={handleCreateRoom} className={styles.modalForm}>
              <input
                type="text"
                placeholder="Nome da Sala"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                required
              />
              <div className={styles.toggleContainer}>
                <label>Sala Privada?</label>
                <label className={styles.switch}>
                  <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                  <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
              </div>
              {isPrivate && (
                <input
                  type="password"
                  placeholder="Senha da Sala"
                  value={newRoomPassword}
                  onChange={(e) => setNewRoomPassword(e.target.value)}
                  required
                />
              )}
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowNewGameModal(false)} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.confirmButton}>
                  Criar e Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Senha */}
      {showPasswordModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={() => setShowPasswordModal({ show: false, room: null })} className={styles.closeButton}>X</button>
            <h2>Sala Privada</h2>
            <p>A sala "{showPasswordModal.room?.name}" requer uma senha para entrar.</p>
            <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
              <input
                type="password"
                placeholder="Digite a senha"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                required
              />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowPasswordModal({ show: false, room: null })} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.confirmButton}>
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lobby;