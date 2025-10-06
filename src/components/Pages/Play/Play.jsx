
import Styles from "./Play.module.css";
import Placar from "../../Placar/Placar";

function Play() {
  // Embarcações Mockadas
  const suasEmbarcacoes = ["Porta-aviões", "Navio-tanque", "Contratorpedeiro", "Submarino"];
  const oponenteEmbarcacoes = ["Porta-aviões", "Navio-tanque", "Submarino"];

  return (
    <div className={Styles.play} style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ flex: 1, maxWidth: 350 }}>
        <Placar titulo="Suas Embarcações" embarcacoes={suasEmbarcacoes} />
      </div>
      <div style={{ flex: 2 }} />
      <div style={{ flex: 1, maxWidth: 350 }}>
        <Placar titulo="Navios do Oponente" embarcacoes={oponenteEmbarcacoes} />
      </div>
    </div>
  );
}

export default Play;
