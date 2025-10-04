import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";
import ProgressBar from "./elements/ProgressBar";
import Perfil_Card from "./elements/Perfil_Card";
import perfil_icon from "./../../../assets/icons/perfil_icon.png";
// imports abaixo são apenas para simulação
import fire from "./../../../assets/effects/fire-flame.gif";
import water from "./../../../assets/effects/water.gif";
import brasil from "./../../../assets/backgrounds/brasil.jpg";

// Variavel modules abaixo serve apenas para importar os icones da pasta icons, mas futuramente será excluido pois os icones disponiveis do usuario virao do backend
const modules = import.meta.glob(
  "./../../../assets/icons/*.{png,jpg,jpeg,svg}",
  {
    eager: true,
  }
);

function Perfil() {
  // Abaixo estão todos os dados do usuário que virão por meio do backend. No momento os valores abaixo são simulação
  const [userName, setUserName] = useState("#user");
  const [lvl, setLvl] = useState(0);
  const [exp, setExp] = useState(0);
  const [partidas, setPartidas] = useState(0);
  const [vitorias, setVitorias] = useState(0);
  const [cards, setCards] = useState(0);
  const [skins, setSkins] = useState(0);
  const [icons, setIcons] = useState([]);
  const [backgrounds, setBackgrounds] = useState([brasil]);
  const [effects, setEffects] = useState([water, fire]);
  // Abaixo as variáveis utilizadas nas funções
  const [perfilEditPopUP, setPerfilEditPopUP] = useState("none");
  const [activeTab, setActiveTab] = useState("icons");
  const [incrementIndex, setIncrementIndex] = useState(0);
  const [item, setItem] = useState(0);
  const [actualIcon, setActualIcon] = useState(perfil_icon);
  const [actualBackground, setActualBackground] = useState(null);
  const [actualEffect, setActualEffect] = useState(null);

  // esse useeffect está sendo utilizado no mesmo contexto do modules lá em cima, será descartado futuramente
  useEffect(() => {
    const images = Object.values(modules).map((m) => m.default);
    setIcons(images);
  }, []);

  function getActiveList() {
    switch (activeTab) {
      case "icons":
        return icons;
        break;
      case "backgrounds":
        return backgrounds;
        break;
      case "effects":
        return effects;
        break;
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
  }

  function decIndex() {
    incrementIndex > 0
      ? setIncrementIndex(incrementIndex - 1)
      : setIncrementIndex(getActiveList().length - 1);
  }

  function sendModification() {
    const selected = getActiveList()[incrementIndex];

    switch (activeTab) {
      case "icons":
        setActualIcon(selected);
        break;
      case "backgrounds":
        setActualBackground(selected);
        break;
      case "effects":
        setActualEffect(selected);
        break;
    }

    console.log("Selecionado:", selected);
  }

  useEffect(() => {
    setIncrementIndex(0);
  }, [activeTab]);
  return (
    <div className={styles.Perfil_Main_Container}>
      <div className={styles.Perfil_Container}>
        <img src={actualIcon} alt="User_Icon" />
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
        <button
          className={styles.Button_Send}
          onClick={() => sendModification()}
        >
          OK
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
