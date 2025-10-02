import styles from "./Perfil_Card.module.css";

function Perfil_Card({ num, title }) {
  return (
    <div className={styles.Perfil_Card_Container}>
      <h1>{num}</h1>
      <p>{title}</p>
    </div>
  );
}

export default Perfil_Card;
