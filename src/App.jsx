import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Pages/Header/Header";
import Play from "./components/Pages/Play/Play";
import Perfil from "./components/Pages/Perfil/Perfil";
import Store from "./components/Pages/Store/Store";
import Login from "./components/Pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // ajuste o caminho conforme seu projeto

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Rota pública */}
        <Route path="/Login" element={<Login />} />

        {/* Rotas protegidas: só acessíveis se o usuário estiver logado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Play" element={<Play />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Store" element={<Store />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
