import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";
import ProgressBar from "./elements/ProgressBar";
import Perfil_Card from "./elements/Perfil_Card";
import perfil_icon from "./../../../assets/cosmetic/icons/E00001.png";
import { useAuth } from "../../../user/useAuth";

function Perfil() {
  // Abaixo estão todos os dados do usuário que virão por meio do backend. No momento os valores abaixo são simulação
  const [lvl, setLvl] = useState(0);
  const [exp, setExp] = useState(0);
  const [partidas, setPartidas] = useState(0);
  const [vitorias, setVitorias] = useState(0);
  const [cards, setCards] = useState(0);
  const [skins, setSkins] = useState(0);
  const [icons, setIcons] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [effects, setEffects] = useState([]);
  const [actualIcon, setActualIcon] = useState(perfil_icon);
  const [actualBackground, setActualBackground] = useState(null);
  const [actualEffect, setActualEffect] = useState(null);
  const [actualPrimaryColor, setActualPrimaryColor] = useState(null);
  const [actualSecondaryColor, setActualSecondaryColor] = useState(null);
  const [actualTertiaryColor, setActualTertiaryColor] = useState(null);
  const [actualFontColor, setActualFontColor] = useState(null);
  // Abaixo as variáveis utilizadas nas funções
  const [perfilEditPopUP, setPerfilEditPopUP] = useState("none");
  const [activeTab, setActiveTab] = useState("icons");
  const [incrementIndex, setIncrementIndex] = useState(0);
  const [newPrimaryColor, setNewPrimaryColor] = useState(null);
  const [newSecondaryColor, setNewSecondaryColor] = useState(null);
  const [newTertiaryColor, setNewTertiaryColor] = useState(null);
  const [newFontColor, setNewFontColor] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    // Estatísticas
    setLvl(user.statistic.lvl);
    setExp(user.statistic.exp);
    setPartidas(user.statistic.gamesPlayed);
    setVitorias(user.statistic.gamesWon);
    // Inventário disponível
    setCards(user.availableCosmetic.availableCards.length);
    setSkins(user.availableShipSkins);
    setIcons(user.availableCosmetic.availableIcons);
    setBackgrounds(user.availableCosmetic.availableBackgrounds);
    setEffects(user.availableCosmetic.availableEffects);
    // Últimos cosméticos e configurações de cores setados
    setActualIcon(user.currentCosmetic.currentIcon);
    setActualBackground(user.currentCosmetic.currentBackground);
    setActualEffect(user.currentCosmetic.currentEffect);
    setActualPrimaryColor(user.currentCosmetic.currentPrimaryColor);
    setActualSecondaryColor(user.currentCosmetic.currentSecondaryColor);
    setActualTertiaryColor(user.currentCosmetic.currentTertiaryColor);
    setActualFontColor(user.currentCosmetic.currentFontColor);
  }, []);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setActualPrimaryColor(root.getPropertyValue("--primary-color").trim());
    setActualSecondaryColor(root.getPropertyValue("--secondary-color").trim());
    setActualTertiaryColor(root.getPropertyValue("--tertiary-color").trim());
    setActualFontColor(root.getPropertyValue("--font-color").trim());
  }, [actualPrimaryColor, actualSecondaryColor, actualTertiaryColor]);

  function totalShipSkins() {
    return (
      user.availableShipSkins.destroyer.length +
      user.availableShipSkins.battleship.length +
      user.availableShipSkins.aircraftCarrier.length +
      user.availableShipSkins.submarine.length
    );
  }

  function getActiveList() {
    switch (activeTab) {
      case "icons":
        return icons;
      case "backgrounds":
        return backgrounds;
      case "effects":
        return effects;
      default:
        return [];
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
        localStorage.setItem("userIcon", selected);
        break;
      case "backgrounds":
        setActualBackground(selected);
        localStorage.setItem("userBackground", selected);
        break;
      case "effects":
        setActualEffect(selected);
        localStorage.setItem("userEffect", selected);
        break;
      case "colors":
        document.documentElement.style.setProperty(
          "--primary-color",
          newPrimaryColor
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          newSecondaryColor
        );
        document.documentElement.style.setProperty(
          "--tertiary-color",
          newTertiaryColor
        );
        document.documentElement.style.setProperty(
          "--font-color",
          newFontColor
        );
        setActualPrimaryColor(newPrimaryColor);
        setActualSecondaryColor(newSecondaryColor);
        setActualTertiaryColor(newTertiaryColor);
        setActualFontColor(newFontColor);
        break;
    }
  }

  const userPrimaryColorChange = (e) => {
    setNewPrimaryColor(e.target.value);
  };
  const userSecondaryColorChange = (e) => {
    setNewSecondaryColor(e.target.value);
  };
  const userTertiaryColorChange = (e) => {
    setNewTertiaryColor(e.target.value);
  };
  const userFontColorChange = (e) => {
    setNewFontColor(e.target.value);
  };

  useEffect(() => {
    setIncrementIndex(0);
  }, [activeTab]);
  return (
    <div
      className={styles.Perfil_Main_Container}
      style={{
        backgroundImage: `url(/src/assets/cosmetic/backgrounds/${actualBackground}.png)`,
      }}
    >
      <div className={styles.Perfil_Container}>
        <img
          src={
            new URL(
              `/src/assets/cosmetic/icons/${actualIcon}.png`,
              import.meta.url
            ).href
          }
          alt="User_Icon"
          className={styles.Perfil_Icon}
          onClick={() => setPerfilEditPopUP("flex")}
        />
        <h1>
          {user?.basicData.username ? (
            <span>{user.basicData.username}</span>
          ) : (
            <span>#user</span>
          )}
        </h1>
        <ProgressBar lvl={lvl} exp={exp} />
        <div className={styles.Effect_Container}>
          <img
            src={
              new URL(
                `/src/assets/cosmetic/effects/${actualEffect}.gif`,
                import.meta.url
              ).href
            }
            alt=""
          />
        </div>
      </div>
      <div className={styles.Perfil_Cards_Container}>
        <Perfil_Card num={partidas} title={"Partidas"} />
        <Perfil_Card num={vitorias} title={"Vitórias"} />
        <Perfil_Card num={cards} title={"Cards"} />
        <Perfil_Card num={totalShipSkins()} title={"Skins"} />
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
                    ? { border: "solid 3px " + actualTertiaryColor }
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
                    ? { border: "solid 3px " + actualTertiaryColor }
                    : { border: "none" }
                }
              >
                Efeitos
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("colors")}
                style={
                  activeTab === "colors"
                    ? { border: "solid 3px " + actualTertiaryColor }
                    : { border: "none" }
                }
              >
                Cores
              </button>
            </li>
          </ul>
        </div>
        <div
          className={styles.Perfil_Edit_Right}
          style={{ display: activeTab != "colors" ? "flex" : "none" }}
        >
          <button onClick={() => decIndex()}></button>
          <div>
            <img src={getActiveList()[incrementIndex]} alt="fault" />
          </div>
          <button onClick={() => incIndex()}></button>
        </div>
        <div
          className={styles.Perfil_Edit_Right}
          style={{ display: activeTab != "colors" ? "none" : "flex" }}
        >
          <table>
            <caption>Ajuste de Cores</caption>
            <thead>
              <tr>
                <th>Status</th>
                <th>Primária</th>
                <th>Secundaria</th>
                <th>Terciaria</th>
                <th>Font</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>atual</td>
                <td>{actualPrimaryColor}</td>
                <td>{actualSecondaryColor}</td>
                <td>{actualTertiaryColor}</td>
                <td>{actualFontColor}</td>
              </tr>
              <tr>
                <td>nova</td>
                <td>
                  <input type="color" onChange={userPrimaryColorChange} />
                </td>
                <td>
                  <input type="color" onChange={userSecondaryColorChange} />
                </td>
                <td>
                  <input type="color" onChange={userTertiaryColorChange} />
                </td>
                <td>
                  <input type="color" onChange={userFontColorChange} />
                </td>
              </tr>
            </tbody>
          </table>
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
    </div>
  );
}

export default Perfil;
