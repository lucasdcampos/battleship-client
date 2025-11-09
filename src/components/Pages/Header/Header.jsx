import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Header.module.css";
import Nav_Button from "./elements/Nav_Button";

import Perfil_Icon_Default from "../../../assets/cosmetic/icons/E00001.png";

import { useAuth } from "../../../hooks/useAuth";
import { useUser } from "../../../hooks/useUser";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const { signOut } = useAuth();
  const { me, config, loading } = useUser();

  const [active, setActive] = useState(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  // -------------------------
  // Determina aba ativa
  // -------------------------
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/play") || path.includes("/lobby")) setActive("Play");
    else if (path.includes("/Store")) setActive("Store");
    else if (path.includes("/Perfil")) setActive("Perfil");
    else setActive(null);
  }, [location]);

  // -------------------------
  // Dados seguros do usuário
  // -------------------------
  const username = me?.username ?? "#username";
  const email = me?.email ?? "#email";

  // Cosméticos
  const userIcon = config?.enabled_icon || Perfil_Icon_Default;
  const userEffect = config?.enabled_effect || null;

  // Resolve path de ícone (cosméticos agora já possuem link absoluto)
  const resolveIconSrc = (icon) => {
    if (!icon) return Perfil_Icon_Default;
    if (icon.startsWith("http") || icon.startsWith("/")) return icon;
    return Perfil_Icon_Default;
  };

  if (loading) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <span style={{ color: "#fff" }}>Carregando...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Nav_Button id="Play" path="/lobby" label="PLAY" select={active} setSelect={setActive} />
        <Nav_Button id="Store" path="/Store" label="Market" select={active} setSelect={setActive} />
        <Nav_Button id="Perfil" path="/Perfil" label="Perfil" select={active} setSelect={setActive} />
      </div>

      <div className={styles.navbarRight}>
        {/* Perfil resumido no canto */}
        <div className={styles.Perfil_Container} onClick={() => setOpenProfileMenu(!openProfileMenu)}>
          <img
            src={resolveIconSrc(userIcon)}
            alt="User_Icon"
            className={styles.Perfil_Icon}
            onError={(e) => {
              e.currentTarget.src = Perfil_Icon_Default;
            }}
          />

          <div className={styles.Effect_Container}>
            {userEffect && (
              <img
                src={userEffect}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </div>

        {/* Popup de opções */}
        {openProfileMenu && (
          <div className={styles.loggoutPopUP}>
            <div>
              <div className={styles.Perfil_Container} onClick={() => navigate("/Perfil")}>
                <img
                  src={resolveIconSrc(userIcon)}
                  alt="User_Icon"
                  className={styles.Perfil_Icon}
                  onError={(e) => (e.currentTarget.src = Perfil_Icon_Default)}
                />
              </div>

              <h1>
                <span>{username}</span>
              </h1>
            </div>

            <h2>
              <span>{email}</span>
            </h2>

            <button onClick={() => signOut()}>Deslogar</button>
          </div>
        )}
      </div>
    </nav>
  );
}
