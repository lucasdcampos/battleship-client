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
  const [perfilEditPopUP, setPerfilEditPopUP] = useState("none");

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
      <div
        className={styles.Perfil_Edit_Pop_UP}
        style={{ display: perfilEditPopUP }}
      >
        <div className={styles.Perfil_Edit_left}>
          <ul type="none">
            <li>
              <input type="radio" name="perfilEditPopUP" id="icon" />
              <label htmlFor="perfilEditPopUP">Ícones</label>
            </li>
            <li>
              <input type="radio" name="perfilEditPopUP" id="background" />
              <label htmlFor="perfilEditPopUP">Backgrounds</label>
            </li>
            <li>
              <input type="radio" name="perfilEditPopUP" id="effect" />
              <label htmlFor="perfilEditPopUP">Efeitos</label>
            </li>
            <li>
              <input type="radio" name="perfilEditPopUP" id="colors" />
              <label htmlFor="perfilEditPopUP">Cores</label>
            </li>
          </ul>
        </div>
        <div className={styles.Perfil_Edit_Right}>
          <button></button>
          <div>area</div>
          <button></button>
        </div>
        <button
          className={styles.Perfil_Edit_Close}
          onClick={() => setPerfilEditPopUP("none")}
        >
          X
        </button>
      </div>
      <button
        className={styles.Perfil_Edit_Open}
        onClick={() => setPerfilEditPopUP("flex")}
      >
        Editar Perfil
      </button>
    </div>
  );
}

export default Perfil;
