import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";
import ProgressBar from "./elements/ProgressBar";
import Perfil_Card from "./elements/Perfil_Card";
import perfil_icon from "./../../../assets/icons/perfil_icon.png";

// Variavel modules abaixo serve apenas para importar icones, backgrounds e efeitos da pasta assets, mas futuramente será excluido pois os icones disponiveis do usuario virao do backend
const module_icons = import.meta.glob(
  "./../../../assets/icons/*.{png,jpg,jpeg,svg}",
  {
    eager: true,
  }
);

const module_effects = import.meta.glob(
  "./../../../assets/effects/*.{png,jpg,jpeg,svg,gif}",
  {
    eager: true,
  }
);

const module_backgrounds = import.meta.glob(
  "./../../../assets/backgrounds/*.{png,jpg,jpeg,svg,gif}",
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
  const [backgrounds, setBackgrounds] = useState([]);
  const [effects, setEffects] = useState([]);
  // Abaixo as variáveis utilizadas nas funções
  const [perfilEditPopUP, setPerfilEditPopUP] = useState("none");
  const [activeTab, setActiveTab] = useState("icons");
  const [incrementIndex, setIncrementIndex] = useState(0);
  const [actualIcon, setActualIcon] = useState(perfil_icon);
  const [actualBackground, setActualBackground] = useState(null);
  const [actualEffect, setActualEffect] = useState(null);
  const [actualPrimaryColor, setActualPrimaryColor] = useState(null);
  const [actualSecondaryColor, setActualSecondaryColor] = useState(null);
  const [actualTertiaryColor, setActualTertiaryColor] = useState(null);
  const [actualFontColor, setActualFontColor] = useState(null);
  const [newPrimaryColor, setNewPrimaryColor] = useState(null);
  const [newSecondaryColor, setNewSecondaryColor] = useState(null);
  const [newTertiaryColor, setNewTertiaryColor] = useState(null);
  const [newFontColor, setNewFontColor] = useState(null);

  // esse useeffect está sendo utilizado no mesmo contexto do modules lá em cima, será descartado futuramente
  useEffect(() => {
    const mod_icons = Object.values(module_icons).map((m) => m.default);
    setIcons(mod_icons);
    const mod_effects = Object.values(module_effects).map((m) => m.default);
    setEffects(mod_effects);
    const mod_backgrounds = Object.values(module_backgrounds).map(
      (m) => m.default
    );
    setBackgrounds(mod_backgrounds);
  }, []);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setActualPrimaryColor(root.getPropertyValue("--primary-color").trim());
    setActualSecondaryColor(root.getPropertyValue("--secondary-color").trim());
    setActualTertiaryColor(root.getPropertyValue("--tertiary-color").trim());
    setActualFontColor(root.getPropertyValue("--font-color").trim());
  }, [actualPrimaryColor, actualSecondaryColor, actualTertiaryColor]);

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
        break;
      case "backgrounds":
        setActualBackground(selected);
        break;
      case "effects":
        setActualEffect(selected);
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
      style={{ backgroundImage: "url(" + actualBackground + ")" }}
    >
      <div className={styles.Perfil_Container}>
        <img
          src={actualIcon}
          alt="User_Icon"
          className={styles.Perfil_Icon}
          onClick={() => setPerfilEditPopUP("flex")}
        />
        <h1>{userName}</h1>
        <ProgressBar lvl={lvl} exp={exp} />
        <div className={styles.Effect_Container}>
          <img src={actualEffect} alt="" />
        </div>
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
