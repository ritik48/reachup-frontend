import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export function ProtectedRoute() {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
