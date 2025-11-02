import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";
import ProgressBar from "./elements/ProgressBar";
import Perfil_Card from "./elements/Perfil_Card";
import PopupComponent from "./elements/PopupComponent"; // IMPORTAR O POPUP
import perfil_icon from "./../../../assets/cosmetic/icons/E00001.png";
import { useAuth } from "../../../user/useAuth";
import { useMe } from '../../../user/useMe';
import { getUser } from "../../../../backandSimulation/userService";
import { updateUser } from "../../../../backandSimulation/userService";

function Perfil() {
  // Estados existentes...
  const [lvl, setLvl] = useState(0);
  const [exp, setExp] = useState(0);
  const [partidas, setPartidas] = useState(0);
  const [vitorias, setVitorias] = useState(0);
  const [cards, setCards] = useState(0);
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
  
  // Estados existentes do popup de perfil
  const [perfilEditPopUP, setPerfilEditPopUP] = useState("none");
  const [activeTab, setActiveTab] = useState("icons");
  const [incrementIndex, setIncrementIndex] = useState(0);
  const [setNewPrimaryColor] = useState(null);
  const [setNewSecondaryColor] = useState(null);
  const [setNewTertiaryColor] = useState(null);
  const [setNewFontColor] = useState(null);

  // NOVOS ESTADOS PARA O POPUP DE CARDS/SKINS
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('cards'); // 'cards' ou 'skins'

  const { user, setUserAtt } = useAuth();
  const { me } = useMe();

  // Resolve icon path: accept either a code (e.g. 'E00001') or a full URL/path.
  const resolveIconSrc = (icon) => {
    if (!icon) return perfil_icon;
    if (typeof icon === 'string' && (icon.startsWith('http') || icon.includes('/') || icon.endsWith('.png'))) {
      return icon;
    }
    try {
      return new URL(`/src/assets/cosmetic/icons/${icon}.png`, import.meta.url).href;
    } catch {
      return perfil_icon;
    }
  };

  useEffect(() => {
    const id = me?.basicData?.id || 1;
    getUser(id).then((data) => {
      // Estatísticas
      setLvl(data.statistic.lvl);
      setExp(data.statistic.exp);
      setPartidas(data.statistic.gamesPlayed);
      setVitorias(data.statistic.gamesWon);
      // Inventário disponível
      setCards(data.availableCosmetic.availableCards.length);
      setIcons(data.availableCosmetic.availableIcons);
      setBackgrounds(data.availableCosmetic.availableBackgrounds);
      setEffects(data.availableCosmetic.availableEffects);
      // Últimos cosméticos e configurações de cores setados
      setActualIcon(data.currentCosmetic.currentIcon);
      setActualBackground(data.currentCosmetic.currentBackground);
      setActualEffect(data.currentCosmetic.currentEffect);
      setActualPrimaryColor(data.currentCosmetic.currentPrimaryColor);
      setActualSecondaryColor(data.currentCosmetic.currentSecondaryColor);
      setActualTertiaryColor(data.currentCosmetic.currentTertiaryColor);
      setActualFontColor(data.currentCosmetic.currentFontColor);
    });
  }, [me?.basicData?.id]);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setActualPrimaryColor(root.getPropertyValue("--primary-color").trim());
    setActualSecondaryColor(root.getPropertyValue("--secondary-color").trim());
    setActualTertiaryColor(root.getPropertyValue("--tertiary-color").trim());
    setActualFontColor(root.getPropertyValue("--font-color").trim());
  }, [actualPrimaryColor, actualSecondaryColor, actualTertiaryColor]);

  function totalShipSkins() {
    // protect against missing user/data/availableShipSkins and prefer `me` when available
    const source = me || user?.data;
    const destroyer = source?.availableShipSkins?.destroyer?.length || 0;
    const battleship = source?.availableShipSkins?.battleship?.length || 0;
    const aircraftCarrier = source?.availableShipSkins?.aircraftCarrier?.length || 0;
    const submarine = source?.availableShipSkins?.submarine?.length || 0;
    return destroyer + battleship + aircraftCarrier + submarine;
  }

  // NOVAS FUNÇÕES PARA ABRIR O POPUP
  const handleOpenCardsPopup = () => {
    setPopupType('cards');
    setIsPopupOpen(true);
  };

  const handleOpenSkinsPopup = () => {
    setPopupType('skins');
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // NOVA FUNÇÃO PARA RECARREGAR DADOS APÓS SALVAR
  const handlePopupSave = () => {
    const userId = me?.basicData?.id || user?.data?.basicData?.id || 1;
    getUser(userId).then((data) => {
      // Atualizar todos os estados com os dados mais recentes
      setLvl(data.statistic.lvl);
      setExp(data.statistic.exp);
      setPartidas(data.statistic.gamesPlayed);
      setVitorias(data.statistic.gamesWon);
      setCards(data.availableCosmetic.availableCards.length);
      setIcons(data.availableCosmetic.availableIcons);
      setBackgrounds(data.availableCosmetic.availableBackgrounds);
      setEffects(data.availableCosmetic.availableEffects);
      setActualIcon(data.currentCosmetic.currentIcon);
      setActualBackground(data.currentCosmetic.currentBackground);
      setActualEffect(data.currentCosmetic.currentEffect);
      setActualPrimaryColor(data.currentCosmetic.currentPrimaryColor);
      setActualSecondaryColor(data.currentCosmetic.currentSecondaryColor);
      setActualTertiaryColor(data.currentCosmetic.currentTertiaryColor);
      setActualFontColor(data.currentCosmetic.currentFontColor);
    });
    
    // Notificar contexto de autenticação sobre mudanças
    setUserAtt((prev) => !prev);
  };

  // Funções existentes...
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

  function getImagePath(code) {
    let basePath = "";

    switch (activeTab) {
      case "icons":
        basePath = "/src/assets/cosmetic/icons/";
        break;
      case "backgrounds":
        basePath = "/src/assets/cosmetic/backgrounds/";
        break;
      case "effects":
        basePath = "/src/assets/cosmetic/effects/";
        break;
      default:
        return "";
    }

    return new URL(
      `${basePath}${code}.${activeTab === "effects" ? "gif" : "png"}`,
      import.meta.url
    ).href;
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

  async function sendModification() {
    const selected = getActiveList()[incrementIndex];

    switch (activeTab) {
      case "icons":
        setActualIcon(selected);
        await updateUser(1, {
          currentCosmetic: {
            ...user?.data?.currentCosmetic,
            currentIcon: selected,
          },
        });
        break;

      case "backgrounds":
        setActualBackground(selected);
        await updateUser(1, {
          currentCosmetic: {
            ...user?.data?.currentCosmetic,
            currentBackground: selected,
          },
        });
        break;

      case "effects":
        setActualEffect(selected);
        await updateUser(1, {
          currentCosmetic: {
            ...user?.data?.currentCosmetic,
            currentEffect: selected,
          },
        });
        break;
    }
    setUserAtt((prev) => !prev);
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
          src={resolveIconSrc(actualIcon)}
          alt="User_Icon"
          className={styles.Perfil_Icon}
          onClick={() => setPerfilEditPopUP("flex")}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = perfil_icon;
          }}
        />
        <h1>
          {me?.basicData?.username || user?.data?.basicData?.username ? (
            <span>{me?.basicData?.username || user?.data?.basicData?.username}</span>
          ) : (
            <span>#user</span>
          )}
        </h1>
        <ProgressBar lvl={lvl} exp={exp} />
        <div className={styles.Effect_Container}>
          {actualEffect ? (
            <img
              src={
                new URL(
                  `/src/assets/cosmetic/effects/${actualEffect}.gif`,
                  import.meta.url
                ).href
              }
              alt=""
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
        </div>
      </div>
      
      <div className={styles.Perfil_Cards_Container}>
        <Perfil_Card num={partidas} title={"Partidas"} />
        <Perfil_Card num={vitorias} title={"Vitórias"} />
        {/* MODIFICAR O CARD DE CARDS PARA ABRIR O POPUP */}
        <div onClick={handleOpenCardsPopup}>
          <Perfil_Card num={cards} title={"Cards"} />
        </div>
        {/* MODIFICAR O CARD DE SKINS PARA ABRIR O POPUP */}
        <div onClick={handleOpenSkinsPopup}>
          <Perfil_Card num={totalShipSkins()} title={"Skins"} />
        </div>
      </div>

      {/* POPUP EXISTENTE DE EDIÇÃO DE PERFIL */}
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
            <img
              src={getImagePath(getActiveList()[incrementIndex])}
              alt="fault"
            />
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

      {/* NOVO POPUP COMPONENT PARA CARDS E SKINS */}
      <PopupComponent
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        type={popupType}
        userData={me || user?.data || null}
        onSave={handlePopupSave}
      />
    </div>
  );
}

export default Perfil;