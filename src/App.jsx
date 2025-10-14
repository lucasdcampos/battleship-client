import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Pages/Header/Header";
import Play from "./components/Pages/Play/Play";
import Perfil from "./components/Pages/Perfil/Perfil";
import Store from "./components/Pages/Store/Store";
import Login from "./components/Pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  const hideHeaderOnPaths = ["/Login"];
  const shouldShowHeader = !hideHeaderOnPaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/Play" element={<Play />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Store" element={<Store />} />
        </Route>
        {/* 404 not found */}
        <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
