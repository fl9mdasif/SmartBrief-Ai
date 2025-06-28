import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // Select the token from the auth state
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;