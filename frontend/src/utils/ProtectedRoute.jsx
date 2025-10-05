import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // If user is not logged in, redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access to the page
  return children;
};

export default ProtectedRoute;
