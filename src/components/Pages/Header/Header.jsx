import styles from "./Header.module.css";
import Nav_Button from "./elements/Nav_Button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Perfil_Icon from "../../../assets/icons/perfil_icon.png";

function Header() {
  const [select, setSelect] = useState(null);
  const location = useLocation();

  // Define o botão ativo com base na URL atual
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('Play')) setSelect('Play');
    else if (path.includes('Store')) setSelect('Store');
    else if (path.includes('Perfil')) setSelect('Perfil');
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
        <img src={Perfil_Icon} alt="User_Icon" />
      </div>
    </nav>
  );
}

export default Header;
