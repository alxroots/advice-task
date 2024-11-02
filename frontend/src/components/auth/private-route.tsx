import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.tsx";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();
  console.log('user', user)
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
