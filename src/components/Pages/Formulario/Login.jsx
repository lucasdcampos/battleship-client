import "./Forms.module.css";

function LoginForm({ onSwitchForm }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submit");
  };

  return (
    <div className="login-background">
      <h2 className="form-title">Acesse sua conta</h2>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Senha" required />
          <button type="button" className="text-link stacked-link">
            Esqueceu a senha?
          </button>
          <button
            type="button"
            className="text-link stacked-link"
            onClick={onSwitchForm}
          >
            Criar nova conta
          </button>
          <button type="submit" className="main-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
