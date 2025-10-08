import styles from "./Header.module.css";
import Nav_Button from "./elements/Nav_Button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Perfil_Icon from "../../../assets/icons/perfil_icon.png";
import { useAuth } from "../../../user/useAuth";

function Header() {
  const [select, setSelect] = useState(null);
  const [loggoutPop, setLoggoutPop] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Define o botão ativo com base na URL atual
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("Play")) setSelect("Play");
    else if (path.includes("Store")) setSelect("Store");
    else if (path.includes("Perfil")) setSelect("Perfil");
  }, [location]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Nav_Button
          id="Play"
          path="/Play"
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
            src={localStorage.getItem("userIcon")}
            alt="User_Icon"
            className={styles.Perfil_Icon}
            onClick={() => setPerfilEditPopUP("flex")}
          />
          <div className={styles.Effect_Container}>
            <img src={localStorage.getItem("userEffect")} alt="" />
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
                src={localStorage.getItem("userIcon")}
                alt="User_Icon"
                className={styles.Perfil_Icon}
                onClick={() => setPerfilEditPopUP("flex")}
              />
              <div className={styles.Effect_Container}>
                <img src={localStorage.getItem("userEffect")} alt="" />
              </div>
            </div>
            <h1>
              {user?.username ? (
                <span>{user.username}</span>
              ) : (
                <span>#username</span>
              )}
            </h1>
          </div>
          <h2>
            {user?.email ? <span>{user.email}</span> : <span>#e-mail</span>}
          </h2>
          <button onClick={() => signOut()}>Deslogar</button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
