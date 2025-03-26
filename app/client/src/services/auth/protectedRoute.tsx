import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

const ProtectedRoute = () => {
  const { token } = useAuth();

  console.log(token);

  return token ? <Outlet /> : <Navigate to="/landing" replace />;
};

export default ProtectedRoute;