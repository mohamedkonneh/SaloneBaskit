import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while the auth state is being checked.
    return <div>Loading...</div>; // Or a proper spinner component
  }

  // If loading is finished, check for userInfo and isAdmin status.
  // If either is missing, redirect to login.
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;