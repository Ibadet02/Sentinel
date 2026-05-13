import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};
