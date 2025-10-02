import { useState } from "react";
import styles from "./Perfil.module.css";
import ProgressBar from "./elements/ProgressBar";
import PerfilIcon from "./../../../assets/perfil_icon.png";
import Perfil_Card from "./elements/Perfil_Card";

function Perfil() {
  const [userName, setUserName] = useState("#user");
  const [lvl, setLvl] = useState(0);
  const [exp, setExp] = useState(0);
  const [partidas, setPartidas] = useState(0);
  const [vitorias, setVitorias] = useState(0);
  const [cards, setCards] = useState(0);
  const [skins, setSkins] = useState(0);

  return (
    <div className={styles.Perfil_Main_Container}>
      <div className={styles.Perfil_Container}>
        <img src={PerfilIcon} alt="User_Icon" />
        <h1>{userName}</h1>
        <ProgressBar lvl={lvl} exp={exp} />
      </div>
      <div className={styles.Perfil_Cards_Container}>
        <Perfil_Card num={partidas} title={"Partidas"} />
        <Perfil_Card num={vitorias} title={"Vitórias"} />
        <Perfil_Card num={cards} title={"Cards"} />
        <Perfil_Card num={skins} title={"Skins"} />
      </div>
      <button>Editar Perfil</button>
    </div>
  );
}

export default Perfil;
