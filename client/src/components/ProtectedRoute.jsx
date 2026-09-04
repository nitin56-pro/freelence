import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component protects routes that require authentication
const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, show the child route components (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
