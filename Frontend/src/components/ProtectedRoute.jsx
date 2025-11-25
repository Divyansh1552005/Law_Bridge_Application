import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";


export default function ProtectedRoute({ children }) {
  const { token } = useContext(AppContext);
  
  // Show toast when user is not authenticated
  useEffect(() => {
    if (!token) {
      toast.warn("You must be logged in to access this page.");
    }
  }, [token]);
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
