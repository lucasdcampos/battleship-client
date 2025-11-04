import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";
import ProgressBar from "./elements/ProgressBar";
import Perfil_Card from "./elements/Perfil_Card";
import PopupComponent from "./elements/PopupComponent"; // IMPORTAR O POPUP
import perfil_icon from "./../../../assets/cosmetic/icons/E00001.png";
import { useAuth } from "../../../user/useAuth";
import { updateUser, updateUserConfig } from '../../../services/userService';
import { getUserCosmetics } from '../../../services/storeService';
import { useUserConfig } from '../../../user/useUserConfig';

const defaultCosmeticImg = perfil_icon;

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
  const [cardsCosmetics, setCardsCosmetics] = useState([]);
  const [skinsCosmetics, setSkinsCosmetics] = useState([]);
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
  const [newPrimaryColor, setNewPrimaryColor] = useState(null);
  const [newSecondaryColor, setNewSecondaryColor] = useState(null);
  const [newTertiaryColor, setNewTertiaryColor] = useState(null);
  const [newFontColor, setNewFontColor] = useState(null);

  // NOVOS ESTADOS PARA O POPUP DE CARDS/SKINS
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState("cards"); // 'cards' ou 'skins'

  const { user, setUserAtt, refreshUser } = useAuth();
  const { config: userConfig, refresh: refreshUserConfig } = useUserConfig();

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

  // Busca cosméticos do usuário e popula os estados
  useEffect(() => {
    if (!user) return;
    const data = user.data ? user.data : user;
    setLvl(data.statistic?.lvl || 0);
    setExp(data.statistic?.exp || 0);
    setPartidas(data.statistic?.gamesPlayed || 0);
    setVitorias(data.statistic?.gamesWon || 0);
    setActualIcon(data.currentCosmetic?.currentIcon || perfil_icon);
    setActualBackground(data.currentCosmetic?.currentBackground || null);
    setActualEffect(data.currentCosmetic?.currentEffect || null);
    setActualPrimaryColor(data.currentCosmetic?.currentPrimaryColor || null);
    setActualSecondaryColor(data.currentCosmetic?.currentSecondaryColor || null);
    setActualTertiaryColor(data.currentCosmetic?.currentTertiaryColor || null);
    setActualFontColor(data.currentCosmetic?.currentFontColor || null);

    // Busca cosméticos do backend
    getUserCosmetics().then(res => {
      const cosmetics = res.cosmetics || [];
      setIcons(cosmetics.filter(c => c.type === 'ICON'));
      setBackgrounds(cosmetics.filter(c => c.type === 'BACKGROUND'));
      setEffects(cosmetics.filter(c => c.type === 'EFFECT'));
      setCardsCosmetics(cosmetics.filter(c => c.type === 'CARD'));
      setSkinsCosmetics(cosmetics.filter(c => c.type === 'SKIN'));
      setCards(cosmetics.filter(c => c.type === 'CARD').length);
    }).catch(() => {
      setIcons([]);
      setBackgrounds([]);
      setEffects([]);
      setCardsCosmetics([]);
      setSkinsCosmetics([]);
      setCards(0);
    });
  }, [user]);

  // Apply colors from user config when available
  useEffect(() => {
    if (!userConfig) return;
    setActualPrimaryColor((prev) => userConfig.primary_color || prev);
    setActualSecondaryColor((prev) => userConfig.secondary_color || prev);
    setActualTertiaryColor((prev) => userConfig.tertiary_color || prev);
    setActualFontColor((prev) => userConfig.font_color || prev);
  }, [userConfig]);

  // Initialize "nova" inputs with current config/colors when available
  useEffect(() => {
    if (userConfig) {
      setNewPrimaryColor(userConfig.primary_color || userConfig.primaryColor || actualPrimaryColor || '#000000');
      setNewSecondaryColor(userConfig.secondary_color || userConfig.secondaryColor || actualSecondaryColor || '#000000');
      setNewTertiaryColor(userConfig.tertiary_color || userConfig.tertiaryColor || actualTertiaryColor || '#000000');
      setNewFontColor(userConfig.font_color || userConfig.fontColor || actualFontColor || '#000000');
    } else {
      // fallback to currently applied actual colors
      if (actualPrimaryColor) setNewPrimaryColor(actualPrimaryColor);
      if (actualSecondaryColor) setNewSecondaryColor(actualSecondaryColor);
      if (actualTertiaryColor) setNewTertiaryColor(actualTertiaryColor);
      if (actualFontColor) setNewFontColor(actualFontColor);
    }
  }, [userConfig, actualPrimaryColor, actualSecondaryColor, actualTertiaryColor, actualFontColor]);

  // Apply current actual colors to :root CSS variables so the UI uses
  // the real user configuration colors. This avoids reading from a mock
  // and ensures components using the CSS variables reflect the config.
  useEffect(() => {
    const rootStyle = document.documentElement.style;
    if (actualPrimaryColor) rootStyle.setProperty("--primary-color", actualPrimaryColor);
    if (actualSecondaryColor) rootStyle.setProperty("--secondary-color", actualSecondaryColor);
    if (actualTertiaryColor) rootStyle.setProperty("--tertiary-color", actualTertiaryColor);
    if (actualFontColor) rootStyle.setProperty("--font-color", actualFontColor);
  }, [actualPrimaryColor, actualSecondaryColor, actualTertiaryColor, actualFontColor]);

  function totalShipSkins() {
    // protect against missing user/data/availableShipSkins
    const source = user?.data ? user.data : user;
    const destroyer = source?.availableShipSkins?.destroyer?.length || 0;
    const battleship = source?.availableShipSkins?.battleship?.length || 0;
    const aircraftCarrier = source?.availableShipSkins?.aircraftCarrier?.length || 0;
    const submarine = source?.availableShipSkins?.submarine?.length || 0;
    return destroyer + battleship + aircraftCarrier + submarine;
  }

  // NOVAS FUNÇÕES PARA ABRIR O POPUP
  const handleOpenCardsPopup = () => {
    setPopupType("cards");
    setIsPopupOpen(true);
  };

  const handleOpenSkinsPopup = () => {
    setPopupType("skins");
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // NOVA FUNÇÃO PARA RECARREGAR DADOS APÓS SALVAR
  const handlePopupSave = async () => {
    try {
      // Refresh user and config from context/hooks
      if (typeof refreshUser === 'function') await refreshUser();
      if (typeof refreshUserConfig === 'function') await refreshUserConfig();
      setUserAtt((prev) => !prev);
    } catch (err) {
      console.error('Erro ao recarregar dados após salvar popup:', err);
    }
  };

  // Funções existentes...
  function getActiveList() {
    switch (activeTab) {
      case "icons":
        return icons.map(c => c.cosmetic_id);
      case "backgrounds":
        return backgrounds.map(c => c.cosmetic_id);
      case "effects":
        return effects.map(c => c.cosmetic_id);
      case "cards":
        return cardsCosmetics.map(c => c.cosmetic_id);
      case "skins":
        return skinsCosmetics.map(c => c.cosmetic_id);
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

  // Save colors to backend when activeTab === 'colors'
  async function saveColors() {
    try {
  const userId = user?.data?.basicData?.id || user?.basicData?.id || null;
      const payload = {
        enabled_background: userConfig?.enabledBackground ?? 0,
        enabled_skin: userConfig?.enabledSkin ?? 0,
        enabled_effect: userConfig?.enabledEffect ?? 0,
        enabled_icon: userConfig?.enabledIcon ?? 0,
        primary_color: newPrimaryColor || actualPrimaryColor || "#000000",
        secondary_color: newSecondaryColor || actualSecondaryColor || "#000000",
        tertiary_color: newTertiaryColor || actualTertiaryColor || "#000000",
        font_color: newFontColor || actualFontColor || "#000000",
      };

  await updateUserConfig(userId, payload);

      // refresh local config and applied colors
      if (typeof refreshUserConfig === 'function') await refreshUserConfig();
      // apply immediately locally
      setActualPrimaryColor(payload.primary_color);
      setActualSecondaryColor(payload.secondary_color);
      setActualTertiaryColor(payload.tertiary_color);
      setActualFontColor(payload.font_color);
      alert('Cores atualizadas com sucesso');
    } catch (err) {
      console.error('Erro ao salvar cores:', err);
      alert('Falha ao salvar cores');
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
          {(() => {
            // Suporta user = { username }, { basicData }, { data: { basicData } }
            const username = user?.data?.basicData?.username || user?.basicData?.username || user?.username;
            if (username && typeof username === 'string' && username.trim().length > 0) {
              return <span>{username}</span>;
            }
            return <span>#user</span>;
          })()}
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
        <div>
          <Perfil_Card num={partidas} title={"Partidas"} />
        </div>
        <div>
          <Perfil_Card num={vitorias} title={"Vitórias"} />
        </div>
        <div onClick={handleOpenCardsPopup}>
          <Perfil_Card num={cards} title={"Cards"} />
        </div>
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
            {/* Miniaturas dos cosméticos do tipo selecionado */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' }}>
              {(() => {
                let cosmetics = [];
                if (activeTab === 'icons') cosmetics = icons;
                else if (activeTab === 'backgrounds') cosmetics = backgrounds;
                else if (activeTab === 'effects') cosmetics = effects;
                else if (activeTab === 'cards') cosmetics = cardsCosmetics;
                else if (activeTab === 'skins') cosmetics = skinsCosmetics;
                return cosmetics.map(cosmetic => (
                  <img
                    key={cosmetic.cosmetic_id}
                    src={cosmetic.link || defaultCosmeticImg}
                    alt={cosmetic.description}
                    title={cosmetic.description}
                    style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4, background: '#fff', border: '1px solid #ccc' }}
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = defaultCosmeticImg; }}
                  />
                ));
              })()}
            </div>
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
                  <input type="color" value={newPrimaryColor || '#000000'} onChange={userPrimaryColorChange} />
                </td>
                <td>
                  <input type="color" value={newSecondaryColor || '#000000'} onChange={userSecondaryColorChange} />
                </td>
                <td>
                  <input type="color" value={newTertiaryColor || '#000000'} onChange={userTertiaryColorChange} />
                </td>
                <td>
                  <input type="color" value={newFontColor || '#000000'} onChange={userFontColorChange} />
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
          onClick={() => {
            if (activeTab === 'colors') {
              saveColors();
            } else {
              sendModification();
            }
          }}
        >
          OK
        </button>
      </div>

      {/* NOVO POPUP COMPONENT PARA CARDS E SKINS */}
      <PopupComponent
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        type={popupType}
        userData={user?.data || user || null}
        onSave={handlePopupSave}
      />
    </div>
  );
}

export default Perfil;
