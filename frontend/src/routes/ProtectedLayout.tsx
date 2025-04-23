import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedLayout() {
    const { loggedUser, loading } = useAuth();
  
    if (loading) {
        return <div>Carregando...</div>; // ou spinner
    }

    if (!loggedUser) {
    return <Navigate to="/login" replace />;
    }

    return <Outlet/>;
  }