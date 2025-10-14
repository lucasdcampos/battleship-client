import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../user/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
}
