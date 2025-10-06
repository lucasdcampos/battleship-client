import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Pages/Header/Header";
import Play from "./components/Pages/Play/Play";
import Perfil from "./components/Pages/Perfil/Perfil";
import Store from "./components/Pages/Store/Store";
import Login from "./components/Pages/Formulario/Login";
import Signup from "./components/Pages/Formulario/Signup";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Play" element={<Play />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Store" element={<Store />} />
      </Routes>
    </Router>
  );
}

export default App;
