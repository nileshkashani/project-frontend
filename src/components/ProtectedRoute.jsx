import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // You could add a loading screen or access-denied message here in future
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
