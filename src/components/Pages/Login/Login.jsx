import { useState } from "react";
import styles from "./Login.module.css";
import navio1 from "../../../assets/cosmetic/ships/destroyer/F00001.png";
import navio2 from "../../../assets/cosmetic/ships/battleship/G00001.png";
import navio3 from "../../../assets/cosmetic/ships/aircraftCarrier/H00001.png";
import navio4 from "../../../assets/cosmetic/ships/submarine/I00001.png";
import { useAuth } from "../../../user/useAuth";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  // Variáveis
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [actualTab, setActualTab] = useState("login");
  const navigate = useNavigate();
  const { signIn, signOut } = useAuth();

  // Funções
  async function handleSubmitLoginForm(e) {
    e.preventDefault();

    await signIn(email, password);
    navigate("/Perfil");
  }

  async function handleSubmitSignupForm(e) {
    e.preventDefault();
    signOut();
  }

  return (
    <div className={styles.login_background}>
      <img src={navio1} alt="navio1" className={styles.navio1} />
      <img src={navio2} alt="navio2" className={styles.navio2} />
      <img src={navio3} alt="navio3" className={styles.navio3} />
      <img src={navio4} alt="navio4" className={styles.navio4} />

      <h2 className={styles.form_title}>Acesse sua conta</h2>
      <div className={styles.login_container}>
        {/* Logar em conta existente */}
        <form
          onSubmit={handleSubmitLoginForm}
          style={{ display: actualTab === "login" ? "flex" : "none" }}
        >
          <input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className={styles.text_link_stacked_link}
            onClick={() => setActualTab("forgot_password")}
          >
            Esqueceu a senha?
          </button>
          <button
            type="button"
            className={styles.text_link_stacked_link}
            onClick={() => setActualTab("new_account")}
          >
            Criar nova conta
          </button>
          <button
            type="submit"
            className={styles.main_button}
            onClick={() => handleSubmitLoginForm()}
          >
            Entrar
          </button>
        </form>
        {/* Criar nova conta */}
        <form
          onSubmit={handleSubmitSignupForm}
          style={{ display: actualTab === "new_account" ? "flex" : "none" }}
        >
          <input type="text" placeholder="Nome de usuário" required />
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Senha" required />
          <input type="password" placeholder="Confirmar senha" required />
          <button
            type="button"
            className={styles.text_link_stacked_link}
            onClick={() => setActualTab("login")}
          >
            Já tem uma conta? Entrar
          </button>
          <button
            type="submit"
            className={styles.main_button}
            onClick={() => handleSubmitSignupForm()}
          >
            Criar
          </button>
        </form>
        {/* Recuperar senha */}
        <form
          onSubmit={handleSubmitSignupForm}
          style={{ display: actualTab === "forgot_password" ? "flex" : "none" }}
        >
          <input type="email" placeholder="E-mail" required />
          <button
            type="button"
            className={styles.text_link_stacked_link}
            onClick={() => setActualTab("login")}
          >
            Voltar
          </button>
          <button
            type="submit"
            className={styles.main_button}
            onClick={() => {}}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
