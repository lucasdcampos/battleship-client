import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";
import ProgressBar from "./elements/ProgressBar";
import PerfilIcon from "./../../../assets/perfil_icon.png";
import Perfil_Card from "./elements/Perfil_Card";
import fire from "./../../../assets/fire-flame.gif";
import water from "./../../../assets/200w.gif";

function Perfil() {
  const [userName, setUserName] = useState("#user");
  const [lvl, setLvl] = useState(0);
  const [exp, setExp] = useState(0);
  const [partidas, setPartidas] = useState(0);
  const [vitorias, setVitorias] = useState(0);
  const [cards, setCards] = useState(0);
  const [skins, setSkins] = useState(0);
  const icons = ["icon1", "icon2", "icon3"];
  const backgrounds = [
    "background1",
    "background2",
    "background3",
    "background4",
  ];
  const effects = [water, fire];
  const [perfilEditPopUP, setPerfilEditPopUP] = useState("none");
  const [activeTab, setActiveTab] = useState("icons");
  const [incrementIndex, setIncrementIndex] = useState(0);

  function getActiveList() {
    switch (activeTab) {
      case "icons":
        return icons;
      case "backgrounds":
        return backgrounds;
      case "effects":
        return effects;
    }
  }
  function incIndex() {
    switch (activeTab) {
      case "icons":
        incrementIndex === icons.length - 1
          ? setIncrementIndex(0)
          : setIncrementIndex(incrementIndex + 1);
        break;
      case "backgrounds":
        incrementIndex === backgrounds.length - 1
          ? setIncrementIndex(0)
          : setIncrementIndex(incrementIndex + 1);
        break;
      case "effects":
        incrementIndex === effects.length - 1
          ? setIncrementIndex(0)
          : setIncrementIndex(incrementIndex + 1);
        break;
    }
    console.log(incrementIndex);
  }

  function decIndex() {
    incrementIndex > 0
      ? setIncrementIndex(incrementIndex - 1)
      : setIncrementIndex(getActiveList().length - 1);
  }
  useEffect(() => {
    setIncrementIndex(0);
  }, [activeTab]);
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
              <button
                onClick={() => setActiveTab("icons")}
                style={
                  activeTab === "icons"
                    ? { border: "solid 3px orange" }
                    : { border: "none" }
                }
              >
                Ícones
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("backgrounds")}
                style={
                  activeTab === "backgrounds"
                    ? { border: "solid 3px orange" }
                    : { border: "none" }
                }
              >
                Backgrounds
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("effects")}
                style={
                  activeTab === "effects"
                    ? { border: "solid 3px orange" }
                    : { border: "none" }
                }
              >
                Efeitos
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("icons")}>Cores</button>
            </li>
          </ul>
        </div>
        <div className={styles.Perfil_Edit_Right}>
          <button onClick={() => decIndex()}></button>
          <div>
            <img src={getActiveList()[incrementIndex]} alt="fault" />
          </div>
          <button onClick={() => incIndex()}></button>
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
