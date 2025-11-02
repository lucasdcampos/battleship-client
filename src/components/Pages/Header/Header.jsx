import styles from "./Header.module.css";
import Nav_Button from "./elements/Nav_Button";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Perfil_Icon from "../../../assets/cosmetic/icons/E00001.png";
import { useAuth } from "../../../user/useAuth";
import { useMe } from "../../../user/useMe";
// service not required here because we read from `me`/context

function Header() {
  const [select, setSelect] = useState(null);
  const [loggoutPop, setLoggoutPop] = useState(false);
  const location = useLocation();
  const { user, signOut, loading, userAtt } = useAuth();
  const { me } = useMe();
  const [actualIcon, setActualIcon] = useState(Perfil_Icon);
  const [actualEffect, setActualEffect] = useState(null);
  // Resolve icon path: accept either a code (e.g. 'E00001') or a full URL/path.
  const resolveIconSrc = (icon) => {
    if (!icon) return Perfil_Icon;
    // If icon is already a full path or imported URL, return it
    if (typeof icon === 'string' && (icon.startsWith('http') || icon.includes('/') || icon.endsWith('.png'))) {
      return icon;
    }
    try {
      return new URL(`/src/assets/cosmetic/icons/${icon}.png`, import.meta.url).href;
    } catch {
      return Perfil_Icon;
    }
  };
  // valores seguros para exibição (evitam acessar `user.data` quando `user` for null)
  const displayName = me?.basicData?.username ?? user?.data?.basicData?.username ?? "#username";
  const displayEmail = me?.basicData?.email ?? user?.data?.basicData?.email ?? "#e-mail";

  // Define o botão ativo com base na URL atual
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/play") || path.includes("/lobby")) setSelect("Play");
    else if (path.includes("Store")) setSelect("Store");
    else if (path.includes("Perfil")) setSelect("Perfil");
    else if (path.includes("Login")) setSelect(null);
    else setSelect(null);
  }, [location]);

  useEffect(() => {
    // guard with optional chaining: user may be an object but the nested
    // `data` or `basicData` fields can be missing depending on the auth
    // provider response shape. Only call getUser when we have an id.
  // prefer reading currentCosmetic from `me` (already fetched via useMe)
    // prefer reading currentCosmetic from `me` (already fetched via useMe)
    if (!loading) {
      if (me || user) {
        const current = me?.currentCosmetic ?? user?.data?.currentCosmetic;
        if (current) {
          setActualIcon(current.currentIcon || Perfil_Icon);
          setActualEffect(current.currentEffect || null);
        }
      } else {
        setActualIcon("E00001");
        setActualEffect(null);
      }
    }
  }, [loading, user, userAtt, me]);

  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Nav_Button
          id="Play"
          path="/lobby"
          label="PLAY"
          select={select}
          setSelect={setSelect}
        />
        <Nav_Button
          id="Store"
          path="/Store"
          label="Market"
          select={select}
          setSelect={setSelect}
        />
        <Nav_Button
          id="Perfil"
          path="/Perfil"
          label="Perfil"
          select={select}
          setSelect={setSelect}
        />
      </div>

      <div className={styles.navbarRight}>
        <div
          className={styles.Perfil_Container}
          onClick={() => setLoggoutPop(!loggoutPop)}
        >
          <img
            src={resolveIconSrc(actualIcon)}
            alt="User_Icon"
            className={styles.Perfil_Icon}
            onError={(e) => {
              // fallback to imported default image
              e.currentTarget.onerror = null;
              e.currentTarget.src = Perfil_Icon;
            }}
          />
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
        <div
          className={styles.loggoutPopUP}
          style={{ display: loggoutPop ? "flex" : "none" }}
        >
          <div>
            <div
              className={styles.Perfil_Container}
              onClick={() => setLoggoutPop(!loggoutPop)}
            >
              <img
                src={resolveIconSrc(actualIcon)}
                alt="User_Icon"
                className={styles.Perfil_Icon}
                onClick={() => navigate("/Perfil")}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = Perfil_Icon;
                }}
              />
            </div>
            <h1>
              <span>{displayName}</span>
            </h1>
          </div>
          <h2>
            <span>{displayEmail}</span>
          </h2>
          <button onClick={() => signOut()}>Deslogar</button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
