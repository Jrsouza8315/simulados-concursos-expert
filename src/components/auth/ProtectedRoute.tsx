import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "assinante" | "visitante";
  allowedRoles?: ("admin" | "assinante" | "visitante")[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requiredRole,
  allowedRoles,
  redirectTo = "/unauthorized",
}: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/acesso" replace />;
  }

  if (!userProfile) {
    return <div>Carregando perfil...</div>;
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
