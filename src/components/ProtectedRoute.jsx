import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../user/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
}
