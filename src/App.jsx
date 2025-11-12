import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useRef, useEffect, useState } from "react"; // Importa useRef, useEffect e useState
import Header from "./components/Pages/Header/Header.jsx";
import Lobby from "./components/Pages/Lobby/Lobby";
import Play from "./components/Pages/Play/Play";
import Perfil from "./components/Pages/Perfil/Perfil";
import Store from "./components/Pages/Store/Store";
import Login from "./components/Pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
// Importa o arquivo de música de introdução. Certifique-se de que o caminho e o nome do arquivo estão corretos.
// Exemplo: c:\Projetos\battleship\frontend\src\assets\sound\ost\intro.mp3
import introMusic from './sound/ost/intro.mp3';
import battleMusic from './sound/ost/battle.mp3';

function AppContent() {
  const location = useLocation();
  const introAudioRef = useRef(null); // Ref para a música de introdução
  const battleAudioRef = useRef(null); // Ref para a música de batalha
  const [userInteracted, setUserInteracted] = useState(false); // Estado para rastrear a interação do usuário
  const [isGameEnding, setIsGameEnding] = useState(false); // Estado para indicar que a animação de fim de jogo está ativa

  const hideHeaderOnPaths = ["/Login"];
  const shouldShowHeader = !hideHeaderOnPaths.some(path => location.pathname.startsWith(path));
  // A música deve tocar em todas as telas, exceto na tela de jogo (/Play)
  const shouldPlayMusic = location.pathname !== "/play";
  const shouldPlayBattleMusic = location.pathname === "/play";

  useEffect(() => {
    // Adiciona um ouvinte de clique para detectar a primeira interação do usuário
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction); // Adiciona o listener de clique

    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  useEffect(() => {
    const introAudio = introAudioRef.current;
    const battleAudio = battleAudioRef.current;

    if (introAudio && battleAudio && userInteracted) {
      // Salva a posição da música antes de descarregar a página
      const saveAudioTime = () => {
        sessionStorage.setItem('musicTime', introAudio.currentTime);
      };
      window.addEventListener('beforeunload', saveAudioTime);

      // Restaura a posição da música ao carregar
      const savedTime = sessionStorage.getItem('musicTime');
      if (savedTime) {
        introAudio.currentTime = parseFloat(savedTime);
      }

      // Lógica para a música de introdução
      if (shouldPlayMusic) {
        if (battleAudio) battleAudio.pause();
        if (introAudio && introAudio.paused) {
          introAudio.play().catch(e => console.warn("Autoplay da intro impedido:", e));
        }
      } else {
        if (introAudio) introAudio.pause();
      }

      // Lógica para a música de batalha
      if (shouldPlayBattleMusic) {
        if (introAudio) introAudio.pause();
        if (battleAudio) {
          // Ajusta o volume da música de batalha com base no estado de fim de jogo
          battleAudio.volume = isGameEnding ? 0.1 : 0.5; // 0.1 para 10%, 0.5 para 50%
          if (battleAudio.paused) {
          battleAudio.play().catch(e => console.warn("Autoplay da batalha impedido:", e));
          }
        }
      } else {
        if (battleAudio) {
          battleAudio.pause();
          battleAudio.currentTime = 0; // Reseta a música de batalha ao sair da tela de jogo
          battleAudio.volume = 0.5; // Restaura o volume padrão ao sair da tela de jogo
        }
      }

      // Limpa o evento ao desmontar o componente
      return () => {
        window.removeEventListener('beforeunload', saveAudioTime);
        // Opcional: Restaurar o volume da música de batalha aqui se necessário, embora já seja feito ao sair da rota.
      };
    }
  }, [shouldPlayMusic, shouldPlayBattleMusic, userInteracted, isGameEnding]); // Adiciona isGameEnding como dependência

  return (
    <>
      {/* Elemento de áudio para a música de fundo */}
      <audio ref={introAudioRef} src={introMusic} loop preload="auto" />
      <audio ref={battleAudioRef} src={battleMusic} loop preload="auto" />

      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route element={<ProtectedRoute />}> {/* ProtectedRoute pode precisar de ajuste se passar props */}
          <Route path="/" element={<Navigate to="/lobby" />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/Play" element={<Play setIsGameEnding={setIsGameEnding} />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Store" element={<Store />} />
        </Route>
        {/* 404 not found */}
        <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
