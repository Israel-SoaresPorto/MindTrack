import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../features/auth/store/auth.store";
import LoadingApp from "./LoadingApp";

export default function ProtectedRoute() {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingApp />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
