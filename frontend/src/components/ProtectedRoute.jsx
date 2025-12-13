import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    // While checking for authentication, show a loading indicator.
    // This prevents a flash of the login page on a refresh.
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return userInfo ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
