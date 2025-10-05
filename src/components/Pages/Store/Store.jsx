import React from "react";
import Card from "../../Cards/Cards";
import styles from "./Store.module.css";
import navio from "../../../assets/navios/animacao_tela_de_login/aircraft-carrier-defence-icon-cartoon-style-vector-removebg-preview.png";

export default function Store() {
  return (
    <div className={styles.container}>
      <Card
        titulo="Submarino"
        preco="2,00"
        imagem={navio}
        onComprar={() => alert("Você comprou um Submarino!")}
      />
    </div>
  );
}
