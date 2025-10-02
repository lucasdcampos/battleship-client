import styles from "./ProgressBar.module.css";

function ProgressBar({ lvl, exp }) {
  return (
    <div className={styles.ProgressBar_Container}>
      <p>Nível: {lvl}</p>
      <div className={styles.ProgressBar_Background}>
        <div></div>
        <p>{exp}/1000</p>
      </div>
    </div>
  );
}

export default ProgressBar;
