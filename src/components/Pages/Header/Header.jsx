import styles from "./Header.module.css";
import Nav_Button from "./elements/Nav_Button";
import { useState } from "react";
import Perfil_Icon from "../../../assets/perfil_icon_off.png";

function Header() {
  const [select, setSelect] = useState(null);
  return (
    <nav className={styles.Nav_Container}>
      <ul type="none">
        <li>
          <Nav_Button
            id={"Page1"}
            path={"/Page1"}
            label="Page1"
            select={select}
            setSelect={setSelect}
          />
        </li>
        <li>
          <Nav_Button
            id={"Page2"}
            path={"/Page2"}
            label="Page2"
            select={select}
            setSelect={setSelect}
          />
        </li>
        <li>
          <Nav_Button
            id={"Page3"}
            path={"/Page3"}
            label="Page3"
            select={select}
            setSelect={setSelect}
          />
        </li>
      </ul>
      <div className={styles.Perfil_Icon_Container}>
        <img src={Perfil_Icon} alt="" />
      </div>
    </nav>
  );
}

export default Header;
