import styles from "./Header.module.css";
import Nav_Button from "./elements/Nav_Button";
import { useState } from "react";
import Perfil_Icon from "../../../assets/perfil_icon.png";

function Header() {
  const [select, setSelect] = useState(null);
  return (
    <nav className={styles.Nav_Container}>
      <ul type="none">
        <li>
          <Nav_Button
            id={"Play"}
            path={"/Play"}
            label="Play"
            select={select}
            setSelect={setSelect}
          />
        </li>
        <li>
          <Nav_Button
            id={"Perfil"}
            path={"/Perfil"}
            label="Perfil"
            select={select}
            setSelect={setSelect}
          />
        </li>
        <li>
          <Nav_Button
            id={"Store"}
            path={"/Store"}
            label="Store"
            select={select}
            setSelect={setSelect}
          />
        </li>
      </ul>
      <div className={styles.Perfil_Icon_Container}>
        <img src={Perfil_Icon} alt="User_Icon" />
      </div>
    </nav>
  );
}

export default Header;
