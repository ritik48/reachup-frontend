import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import ClipLoader from "react-spinners/ClipLoader";

export function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) {
    return <ClipLoader size={15} color="grey" />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
