import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("admin" | "cajero")[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    // Si no hay usuario, redirigir al login
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);

    if (!allowedRoles.includes(user.rol)) {
      // Si el rol no está permitido, redirigir al dashboard
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Error al verificar permisos:", error);
    return <Navigate to="/" replace />;
  }
};
