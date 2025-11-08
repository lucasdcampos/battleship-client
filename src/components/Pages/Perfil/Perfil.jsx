import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";

import PopupComponent from "./elements/PopupComponent";
import ProgressBar from "./elements/ProgressBar";
import Perfil_Card from "./elements/Perfil_Card";

import perfil_icon from "./../../../assets/cosmetic/icons/E00001.png";

import { updateUserConfig } from "../../../services/userService";
import { useUser } from "../../../hooks/useUser";

export default function Perfil() {
  const { me, config, ownedCosmetics, loading, refresh } = useUser();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState("ICON");

  const [activeTab, setActiveTab] = useState("icons");

  const [newPrimaryColor, setNewPrimaryColor] = useState("#000000");
  const [newSecondaryColor, setNewSecondaryColor] = useState("#000000");
  const [newTertiaryColor, setNewTertiaryColor] = useState("#000000");
  const [newFontColor, setNewFontColor] = useState("#000000");

  // ---------------------- HOOKS SEMPRE NO TOPO ----------------------

  // inicializa inputs de cor
  useEffect(() => {
    if (!config) return;

    setNewPrimaryColor(config.primary_color ?? "#000000");
    setNewSecondaryColor(config.secondary_color ?? "#000000");
    setNewTertiaryColor(config.tertiary_color ?? "#000000");
    setNewFontColor(config.font_color ?? "#000000");
  }, [config]);

  // aplica css vars globais
  useEffect(() => {
    if (!config) return;

    const r = document.documentElement.style;

    r.setProperty("--primary-color", config.primary_color ?? "#000000");
    r.setProperty("--secondary-color", config.secondary_color ?? "#000000");
    r.setProperty("--tertiary-color", config.tertiary_color ?? "#000000");
    r.setProperty("--font-color", config.font_color ?? "#000000");
  }, [config]);

  // ------------------------------------------------------------------

  if (loading) return <div>Carregando...</div>;
  if (!me) return <div>Usuário não autenticado.</div>;

  // ---------------------- DADOS DERIVADOS ---------------------------

  const lvl = me.statistic?.lvl ?? 0;
  const exp = me.statistic?.exp ?? 0;
  const partidas = me.statistic?.gamesPlayed ?? 0;
  const vitorias = me.statistic?.gamesWon ?? 0;

  const actualIcon = config?.enabled_icon ?? perfil_icon;
  const actualBackground = config?.enabled_background ?? null;
  const actualEffect = config?.enabled_effect ?? null;

  const skins = [...ownedCosmetics].filter(c => c.type === "SKIN");
  const cards = [...ownedCosmetics].filter(c => c.type === "CARD").length;

  const resolveIconSrc = (icon) => {
    if (!icon) return perfil_icon;
    if (icon.startsWith("http") || icon.includes("/")) return icon;
    try {
      return new URL(`/src/assets/cosmetic/icons/${icon}.png`, import.meta.url).href;
    } catch {
      return perfil_icon;
    }
  };

  // ---------------------- SALVAR CORES ------------------------------

  async function saveColors() {
    const payload = {
      primary_color: newPrimaryColor,
      secondary_color: newSecondaryColor,
      tertiary_color: newTertiaryColor,
      font_color: newFontColor,
    };

    await updateUserConfig(null, payload);
    await refresh();
    alert("Cores atualizadas!");
  }

  // ------------------------------------------------------------------

  return (
    <div
      className={styles.Perfil_Main_Container}
      style={{
        backgroundImage: actualBackground ? `url(${actualBackground})` : "none",
      }}
    >
      {/* PAINEL SUPERIOR */}
      <div className={styles.Perfil_Container}>
        <img
          src={resolveIconSrc(actualIcon)}
          alt="User_Icon"
          className={styles.Perfil_Icon}
          onClick={() => setActiveTab("icons")}
          onError={(e) => { e.currentTarget.src = perfil_icon; }}
        />

        <h1>{me.username ?? "#user"}</h1>

        <ProgressBar lvl={lvl} exp={exp} />

        {/* EFEITO (GIF) */}
        <div className={styles.Effect_Container}>
          {actualEffect && (
            <img
              src={actualEffect}
              alt=""
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICA */}
      <div className={styles.Perfil_Cards_Container}>
        <Perfil_Card num={partidas} title="Partidas" />
        <Perfil_Card num={vitorias} title="Vitórias" />

        <div onClick={() => { setPopupType("CARD"); setIsPopupOpen(true); }}>
          <Perfil_Card num={cards} title="Cards" />
        </div>

        <div onClick={() => { setPopupType("SKIN"); setIsPopupOpen(true); }}>
          <Perfil_Card num={skins.length} title="Skins" />
        </div>
      </div>

      {/* POPUP DE COSMÉTICOS */}
      <PopupComponent
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        type={popupType}
      />

      {/* POPUP DE EDIÇÃO COMPLETA (cores + cosméticos) */}
      <div
        className={styles.Perfil_Edit_Pop_UP}
        style={{ display: activeTab !== "none" ? "flex" : "none" }}
      >
        <div className={styles.Perfil_Edit_left}>
          <ul type="none">
            <li>
              <button
                onClick={() => setPopupType("ICON") || setIsPopupOpen(true)}
              >
                Ícones
              </button>
            </li>
            <li>
              <button
                onClick={() => setPopupType("BACKGROUND") || setIsPopupOpen(true)}
              >
                Backgrounds
              </button>
            </li>
            <li>
              <button
                onClick={() => setPopupType("EFFECT") || setIsPopupOpen(true)}
              >
                Efeitos
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("colors")}>Cores</button>
            </li>
          </ul>
        </div>

        {/* ABA DE CORES */}
        <div
          className={styles.Perfil_Edit_Right}
          style={{ display: activeTab === "colors" ? "flex" : "none" }}
        >
          <table>
            <thead>
              <tr>
                <th>Primária</th>
                <th>Secundária</th>
                <th>Terciária</th>
                <th>Fonte</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="color" value={newPrimaryColor} onChange={e => setNewPrimaryColor(e.target.value)} /></td>
                <td><input type="color" value={newSecondaryColor} onChange={e => setNewSecondaryColor(e.target.value)} /></td>
                <td><input type="color" value={newTertiaryColor} onChange={e => setNewTertiaryColor(e.target.value)} /></td>
                <td><input type="color" value={newFontColor} onChange={e => setNewFontColor(e.target.value)} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          className={styles.Perfil_Edit_Close}
          onClick={() => setActiveTab("none")}
        >
          X
        </button>

        <button
          className={styles.Button_Send}
          onClick={() => {
            if (activeTab === "colors") saveColors();
            setActiveTab("none");
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
