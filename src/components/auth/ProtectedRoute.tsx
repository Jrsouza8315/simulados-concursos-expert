import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "assinante" | "visitante";
  allowedRoles?: ("admin" | "assinante" | "visitante")[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
  redirectTo = "/unauthorized",
}) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/acesso" replace />;
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (requiredRole) {
    if (requiredRole === "admin") {
      const isAdmin =
        userProfile.email === "hbrcomercialssa@gmail.com" ||
        userProfile.role === "admin";
      if (!isAdmin) {
        console.log(
          "Tentativa de acesso não autorizado à área administrativa:",
          {
            userEmail: userProfile.email,
            userRole: userProfile.role,
          }
        );
        return <Navigate to={redirectTo} replace />;
      }
    }

    if (userProfile.role !== requiredRole) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
