import { useNavigate } from "react-router-dom";
import styles from "./Nav_Button.module.css";

function Nav_Button({ id, path, label, select, setSelect }) {
  const navigate = useNavigate();

  function handleChange(select, nav) {
    setSelect(select);
    navigate(nav);
  }
  return (
    <div className={styles.Nav_Button_Container}>
      <input
        type="radio"
        name="header"
        checked={select === id}
        id={id}
        onChange={() => handleChange(id, path)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default Nav_Button;
