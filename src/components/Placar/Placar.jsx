import styles from "./Placar.module.css";

function Placar({ titulo, ships = [] }) {
  return (
    <div className={styles.placar}>
      <h2>{titulo}</h2>
      <ul className={styles.listaEmbarcacoes}>
        {ships.map((ship) => (
          <li
            key={ship.id}
            className={`${styles.embarcacao} ${ship.isSunk ? styles.sunk : ""}`}
          >
            {ship.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Placar;