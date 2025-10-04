import styles from "./ProgressBar.module.css";
import { useEffect, useState } from "react";

function ProgressBar({ lvl, exp }) {
  const [percent, setPercent] = useState("50%");

  function calcPercent() {
    const calc = (exp * 100) / 1000;
    setPercent(calc + "%");
  }

  useEffect(() => calcPercent(), [exp]);

  return (
    <div className={styles.ProgressBar_Container}>
      <p>Nível: {lvl}</p>
      <div className={styles.ProgressBar_Background}>
        <div style={{ width: percent }}></div>
        <p>{exp}/1000</p>
      </div>
    </div>
  );
}

export default ProgressBar;
