import styles from "./Forms.module.css";

function SignupForm({ onSwitchForm }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup submit");
  };

  return (
    <div className={styles["login-background"]}>
      <h2 className={styles["form-title"]}>Cadastre-se</h2>
      <div className={styles["login-container"]}>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nome de usuário" required />
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Senha" required />
          <input type="password" placeholder="Confirmar senha" required />
          <button
            type="button"
            className={`${styles["text-link"]} ${styles["stacked-link"]}`}
            onClick={onSwitchForm}
          >
            Já tem uma conta? Entrar
          </button>
          <button type="submit" className={styles["main-button"]}>
            Criar
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
