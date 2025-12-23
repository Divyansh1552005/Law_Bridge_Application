import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { LawyerContext } from '../context/LawyerContext';

const ProtectedRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  const { lToken } = useContext(LawyerContext);

  // If no token exists, redirect to login
  if (!aToken && !lToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;
