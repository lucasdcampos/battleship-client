import styles from "./Forms.module.css";

function Login({ onSwitchForm }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submit");
  };

  return (
    <div className={styles["login-background"]}>
      <h2 className={styles["form-title"]}>Acesse sua conta</h2>
      <div className={styles["login-container"]}>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Senha" required />
          <button
            type="button"
            className={`${styles["text-link"]} ${styles["stacked-link"]}`}
          >
            Esqueceu a senha?
          </button>
          <button
            type="button"
            className={`${styles["text-link"]} ${styles["stacked-link"]}`}
            onClick={onSwitchForm}
          >
            Criar nova conta
          </button>
          <button type="submit" className={styles["main-button"]}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
